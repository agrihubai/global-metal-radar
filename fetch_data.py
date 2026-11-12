#!/usr/bin/env python3
"""Degerli ve Stratejik Metaller Piyasa Panosu - veri betigi.

yfinance ile 5 metal + USD/TRY + EUR/USD verisini ceker, birim donusumlerini,
donemsel degisimleri, 5 yillik ortalamaya gore farki ve Altin/Gumus rasyosunu
hesaplayip data.json dosyasina yazar.
"""
import json
import math
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd
import yfinance as yf

OZ_G = 31.1034768      # 1 troy ons = 31.1034768 gram
LB_G = 453.59237       # 1 libre = 453.59237 gram

METALS = {
    "gold": "GC=F",
    "silver": "SI=F",
    "platinum": "PL=F",
    "palladium": "PA=F",
    "copper": "HG=F",  # Yahoo'da USD / libre
}
FX = {"usdtry": "USDTRY=X", "eurusd": "EURUSD=X"}
PERIODS = {"w": 7, "m": 30, "y": 365}
FIVE_Y = timedelta(days=5 * 365 + 1)
OUT = Path(__file__).resolve().with_name("data.json")
START = "2014-12-01"  # aylik seri 2015 basindan itibaren


def num(x, nd=4):
    try:
        x = float(x)
    except (TypeError, ValueError):
        return None
    if math.isnan(x) or math.isinf(x):
        return None
    return round(x, nd)


def pct(now, ref):
    if now is None or ref is None or ref == 0 or pd.isna(now) or pd.isna(ref):
        return None
    return num((now / ref - 1) * 100, 2)


def _naive(idx):
    idx = pd.to_datetime(idx)
    if getattr(idx, "tz", None) is not None:
        idx = idx.tz_convert(None)
    return idx.normalize()


def download():
    tickers = list(METALS.values()) + list(FX.values())
    close = pd.DataFrame()
    try:
        raw = yf.download(tickers, start=START, interval="1d", auto_adjust=False,
                          progress=False, threads=True)
        if not raw.empty:
            close = raw["Close"].copy() if isinstance(raw.columns, pd.MultiIndex) else raw[["Close"]].copy()
            close.index = _naive(close.index)
    except Exception as exc:  # noqa: BLE001
        print(f"Toplu indirme hatasi: {exc}", file=sys.stderr)

    # Eksik / bos sutunlari tek tek tekrar dene
    for t in tickers:
        if t not in close.columns or close[t].dropna().empty:
            try:
                h = yf.Ticker(t).history(start=START, interval="1d", auto_adjust=False)["Close"]
                h.index = _naive(h.index)
                h = h[~h.index.duplicated(keep="last")]
                if t in close.columns:
                    close = close.drop(columns=[t])
                close = close.join(h.rename(t), how="outer") if not close.empty else h.rename(t).to_frame()
            except Exception as exc:  # noqa: BLE001
                print(f"{t} indirilemedi: {exc}", file=sys.stderr)

    close = close.loc[:, ~close.columns.duplicated()]
    close = close[~close.index.duplicated(keep="last")].sort_index()
    return close


def series_changes(s):
    s = s.dropna()
    if s.empty:
        return {"w": None, "m": None, "y": None, "avg5y": None, "vs_avg5y": None}
    last_d, last = s.index[-1], s.iloc[-1]
    out = {}
    for key, days in PERIODS.items():
        past = s[s.index <= last_d - timedelta(days=days)]
        out[key] = pct(last, past.iloc[-1]) if len(past) else None
    avg = s[s.index >= last_d - FIVE_Y].mean()
    out["avg5y"] = num(avg, 4)
    out["vs_avg5y"] = pct(last, avg)
    return out


def build(close):
    close = close.dropna(how="all")
    metal_cols = [t for t in METALS.values() if t in close.columns]
    if not metal_cols:
        raise RuntimeError("Hicbir metal verisi alinamadi.")
    for t in FX.values():
        if t not in close.columns or close[t].dropna().empty:
            raise RuntimeError(f"Kur verisi alinamadi: {t}")

    # Yalnizca en az bir metalin islem gordugu gunleri tut, bosluklari ileri doldur
    close = close[close[metal_cols].notna().any(axis=1)].ffill()

    usd_oz = pd.DataFrame(index=close.index)
    for key, t in METALS.items():
        if t in close.columns:
            s = close[t]
            usd_oz[key] = s * OZ_G / LB_G if key == "copper" else s
    usdtry = close[FX["usdtry"]]
    eurusd = close[FX["eurusd"]]

    units = {
        "usd_oz": usd_oz,
        "try_g": usd_oz.div(OZ_G).mul(usdtry, axis=0),
        "eur_g": usd_oz.div(OZ_G).div(eurusd, axis=0),
    }

    last_d = close.index[-1]
    metals = {}
    for key, t in METALS.items():
        if key not in usd_oz.columns or usd_oz[key].dropna().empty:
            continue
        s = usd_oz[key].dropna()
        p_oz = s.iloc[-1]
        p_g = p_oz / OZ_G
        price = {
            "usd_oz": num(p_oz, 4),
            "usd_g": num(p_g, 4),
            "usd_kg": num(p_g * 1000, 2),
            "try_g": num(units["try_g"][key].dropna().iloc[-1], 4),
            "eur_g": num(units["eur_g"][key].dropna().iloc[-1], 4),
        }
        if key == "copper":
            price["usd_lb"] = num(close[t].dropna().iloc[-1], 4)
        metals[key] = {
            "ticker": t,
            "date": s.index[-1].strftime("%Y-%m-%d"),
            "price": price,
            "changes": {u: series_changes(df[key]) for u, df in units.items()},
        }

    ratio = None
    if "gold" in usd_oz and "silver" in usd_oz:
        r = (usd_oz["gold"] / usd_oz["silver"]).dropna()
        ch = series_changes(r)
        ratio = {"value": num(r.iloc[-1], 2), "avg5y": num(ch["avg5y"], 2),
                 "change_30d": ch["m"], "change_1y": ch["y"]}

    # Aylik ortalamalar (Emtia panosu ile karsilastirma icin; tamamlanmamis ay haric)
    mon = usd_oz[usd_oz.index >= "2015-01-01"].resample("MS").mean()
    mon = mon[mon.index < last_d.to_period("M").to_timestamp()]
    monthly = {
        "dates": [d.strftime("%Y-%m") for d in mon.index],
        "usd_oz": {k: [num(v, 4) for v in mon[k]] for k in mon.columns},
    }

    hist = close[close.index >= last_d - FIVE_Y]
    hu = usd_oz.loc[hist.index]
    history = {
        "dates": [d.strftime("%Y-%m-%d") for d in hist.index],
        "usd_oz": {k: [num(v, 4) for v in hu[k]] for k in hu.columns},
        "usdtry": [num(v, 4) for v in usdtry.loc[hist.index]],
        "eurusd": [num(v, 5) for v in eurusd.loc[hist.index]],
    }

    return {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "last_date": last_d.strftime("%Y-%m-%d"),
        "source": "Yahoo Finance (yfinance)",
        "constants": {"oz_g": OZ_G, "lb_g": LB_G},
        "fx": {"usdtry": num(usdtry.dropna().iloc[-1], 4), "eurusd": num(eurusd.dropna().iloc[-1], 5)},
        "gold_silver_ratio": ratio,
        "metals": metals,
        "history": history,
        "monthly": monthly,
    }


def main():
    try:
        data = build(download())
    except Exception as exc:  # noqa: BLE001
        print(f"HATA: {exc} - data.json degistirilmedi.", file=sys.stderr)
        sys.exit(1)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":"), allow_nan=False),
                   encoding="utf-8")
    print(f"OK: {OUT.name} yazildi ({len(data['metals'])} metal, son tarih {data['last_date']}).")


if __name__ == "__main__":
    main()
