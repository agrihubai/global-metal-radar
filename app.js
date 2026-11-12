"use strict";

const OZ_G = 31.1034768;
const METALS = ["gold", "silver", "platinum", "palladium", "copper"];
const SD_METALS = ["gold", "silver", "platinum"];
const COLORS = {
  gold: "#C9A227", silver: "#8A97A6", platinum: "#4F7CAC", palladium: "#8A63B8", copper: "#C1652F"
};
const COMP_COLORS = {
  mine_production: "#2E7D5B", recycling: "#7BC0A0",
  industrial_demand: "#3B6EA5", investment_cb_demand: "#8FB3DE", other_demand: "#B9C3D1"
};
const SYM = { usd_oz: "$", try_g: "₺", eur_g: "€" };
const PERIOD_DAYS = { "1m": 30, "6m": 182, "1y": 365, "5y": 1830 };

const I18N = {
  tr: {
    title: "Değerli ve Stratejik Metaller Piyasa Panosu",
    subtitle: "Altın, gümüş, platin, paladyum ve bakır için günlük güncellenen fiyatlar ve göstergeler",
    gold: "Altın", silver: "Gümüş", platinum: "Platin", palladium: "Paladyum", copper: "Bakır",
    unit_usd_oz: "Ons USD", unit_try_g: "Gram TRY", unit_eur_g: "Gram EUR",
    unit_long_usd_oz: "USD / ons", unit_long_try_g: "TRY / gram", unit_long_eur_g: "EUR / gram",
    card_ratio: "Altın / Gümüş Rasyosu",
    ratio_sub: "5Y ort. {avg} · 30 gün {chg}",
    card_usdtry: "USD / TRY", card_eurusd: "EUR / USD", fx_sub: "Son kapanış",
    card_updated: "Son güncelleme", data_date: "Piyasa verisi: {d}",
    sec_prices: "Fiyatlar ve Değişimler",
    prices_note: "Değişimler seçili birim üzerinden hesaplanır. Karşılaştırma grafiğine eklemek için kutuyu işaretleyin. Bakır fiyatı libreden onsa çevrilmiştir.",
    th_cmp: "Grafik", th_metal: "Metal", th_price: "Fiyat", th_w: "7 Gün", th_m: "30 Gün", th_y: "1 Yıl",
    th_avg: "5Y Ortalama", th_vs: "5Y Ort.'a Göre", th_other: "Diğer birimler (USD)",
    sec_chart: "Karşılaştırmalı Performans",
    chart_sub: "Seçilen metaller dönem başında 100'e eşitlenir; seçili birim kullanılır.",
    chart_hint: "Grafikte görmek için tablodan en az bir metal seçin.",
    p_1m: "1A", p_6m: "6A", p_1y: "1Y", p_5y: "5Y",
    index_axis: "Endeks (başlangıç = 100)",
    sec_sd: "Arz – Talep Dengesi (2021–2025)",
    sd_bal_title: "Net denge — toplam arzın yüzdesi",
    sd_comp_title: "Arz ve talep bileşenleri",
    mine_production: "Maden üretimi", recycling: "Geri dönüşüm", industrial_demand: "Endüstriyel talep",
    investment_cb_demand: "Yatırım / Merkez Bankası", other_demand: "Diğer talep (mücevher vb.)", balance: "Net denge",
    surplus: "Fazla", deficit: "Açık", est_mark: "*", est_note: "* tahmini",
    sec_explain: "Kavramlar — kısaca",
    exp_mine_t: "Maden Üretimi", exp_mine: "Yer altından yeni çıkarılarak piyasaya giren metal miktarıdır.",
    exp_rec_t: "Geri Dönüşüm", exp_rec: "Eski takı, elektronik atık ve katalizörlerden geri kazanılıp yeniden arz edilen metaldir.",
    exp_ind_t: "Endüstriyel Talep", exp_ind: "Metalin elektronik, otomotiv, güneş paneli gibi üretim alanlarında hammadde olarak tüketilmesidir.",
    exp_inv_t: "Yatırım / Merkez Bankası Talebi", exp_inv: "Külçe, sikke, borsa yatırım fonları ve merkez bankası rezervleri için yapılan alımlardır.",
    exp_bal_t: "Net Denge (Açık / Fazla)", exp_bal: "Toplam arz talepten büyükse fazla, küçükse açık oluşur; açık genellikle stokların eridiğine işaret eder.",
    exp_ratio_t: "Altın / Gümüş Rasyosu", exp_ratio: "1 ons altın almak için kaç ons gümüş gerektiğini gösterir; iki metalin görece pahalılığını izlemeye yarar.",
    exp_idx_t: "100 Bazlı Endeks", exp_idx: "Farklı fiyat seviyelerindeki metalleri aynı başlangıç noktasından kıyaslayarak yüzde performansı görünür kılar.",
    source_line: "Kaynak: Yahoo Finance vadeli işlem fiyatları (gecikmeli). Arz-talep: WGC, Silver Institute ve WPIC verilerinden derlenmiş yaklaşık değerler.",
    err_data: "Piyasa verisi (data.json) yüklenemedi. Önce “python fetch_data.py” çalıştırın ve sayfayı yerel bir sunucuyla açın (ör. “python -m http.server 8000”).",
    err_sd: "Arz-talep verisi (supply_demand.json) yüklenemedi."
  },
  en: {
    title: "Precious & Strategic Metals Market Dashboard",
    subtitle: "Daily updated prices and indicators for gold, silver, platinum, palladium and copper",
    gold: "Gold", silver: "Silver", platinum: "Platinum", palladium: "Palladium", copper: "Copper",
    unit_usd_oz: "Oz USD", unit_try_g: "Gram TRY", unit_eur_g: "Gram EUR",
    unit_long_usd_oz: "USD / oz", unit_long_try_g: "TRY / gram", unit_long_eur_g: "EUR / gram",
    card_ratio: "Gold / Silver Ratio",
    ratio_sub: "5Y avg. {avg} · 30 days {chg}",
    card_usdtry: "USD / TRY", card_eurusd: "EUR / USD", fx_sub: "Last close",
    card_updated: "Last update", data_date: "Market data: {d}",
    sec_prices: "Prices & Changes",
    prices_note: "Changes are calculated in the selected unit. Tick a box to add a metal to the comparison chart. Copper is converted from pounds to ounces.",
    th_cmp: "Chart", th_metal: "Metal", th_price: "Price", th_w: "7 Days", th_m: "30 Days", th_y: "1 Year",
    th_avg: "5Y Average", th_vs: "vs 5Y Avg.", th_other: "Other units (USD)",
    sec_chart: "Comparative Performance",
    chart_sub: "Selected metals are rebased to 100 at the start of the period, in the selected unit.",
    chart_hint: "Select at least one metal in the table to show it on the chart.",
    p_1m: "1M", p_6m: "6M", p_1y: "1Y", p_5y: "5Y",
    index_axis: "Index (start = 100)",
    sec_sd: "Supply – Demand Balance (2021–2025)",
    sd_bal_title: "Net balance — % of total supply",
    sd_comp_title: "Supply and demand components",
    mine_production: "Mine production", recycling: "Recycling", industrial_demand: "Industrial demand",
    investment_cb_demand: "Investment / Central banks", other_demand: "Other demand (jewellery etc.)", balance: "Net balance",
    surplus: "Surplus", deficit: "Deficit", est_mark: "*", est_note: "* estimate",
    sec_explain: "Key concepts — in brief",
    exp_mine_t: "Mine Production", exp_mine: "The amount of newly extracted metal entering the market each year.",
    exp_rec_t: "Recycling", exp_rec: "Metal recovered from old jewellery, e-waste and catalysts and supplied back to the market.",
    exp_ind_t: "Industrial Demand", exp_ind: "Metal consumed as a raw material in electronics, cars, solar panels and other manufacturing.",
    exp_inv_t: "Investment / Central Bank Demand", exp_inv: "Purchases of bars, coins, exchange-traded funds and central bank reserves.",
    exp_bal_t: "Net Balance (Deficit / Surplus)", exp_bal: "A surplus means supply exceeds demand, a deficit the opposite; deficits usually mean inventories are being drawn down.",
    exp_ratio_t: "Gold / Silver Ratio", exp_ratio: "How many ounces of silver it takes to buy one ounce of gold; used to track the two metals' relative value.",
    exp_idx_t: "Rebased Index (100)", exp_idx: "Starts every metal at the same point so percentage performance is comparable despite very different prices.",
    source_line: "Source: Yahoo Finance futures prices (delayed). Supply-demand: approximate figures compiled from WGC, Silver Institute and WPIC data.",
    err_data: "Market data (data.json) could not be loaded. Run “python fetch_data.py” first and open the page through a local server (e.g. “python -m http.server 8000”).",
    err_sd: "Supply-demand data (supply_demand.json) could not be loaded."
  }
};

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* yok say */ } }
};

const state = {
  lang: ["tr", "en"].includes(store.get("mp_lang", "tr")) ? store.get("mp_lang", "tr") : "tr",
  unit: ["usd_oz", "try_g", "eur_g"].includes(store.get("mp_unit", "usd_oz")) ? store.get("mp_unit", "usd_oz") : "usd_oz",
  period: "1y",
  selected: new Set(["gold", "silver"]),
  sdMetal: "gold",
  tab: store.get("mp_tab", "market") === "links" ? "links" : "market"
};

let DATA = null, SD = null, lineChart = null, balChart = null, compChart = null;
const errors = new Set();

/* ---------- yardımcılar ---------- */
const $ = (id) => document.getElementById(id);
const t = (k, vars = {}) => {
  let s = I18N[state.lang][k] ?? I18N.tr[k] ?? k;
  for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};
const locale = () => (state.lang === "tr" ? "tr-TR" : "en-US");
const cssVar = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

function fmtNum(v, d) {
  if (v == null || !isFinite(v)) return "–";
  return new Intl.NumberFormat(locale(), { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
}
function decimals(v) { const a = Math.abs(v); return a < 1 ? 4 : a < 10 ? 3 : 2; }
function fmtPrice(v, unit) { return v == null ? "–" : SYM[unit] + fmtNum(v, decimals(v)); }
function fmtPct(v) {
  if (v == null || !isFinite(v)) return "–";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  return sign + fmtNum(Math.abs(v), 2) + "%";
}
const pctClass = (v) => (v == null ? "" : v > 0 ? "pos" : v < 0 ? "neg" : "");

async function fetchJSON(url) {
  const r = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

function baseOptions() {
  const tc = cssVar("--text-2"), gc = cssVar("--grid");
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { labels: { color: tc, boxWidth: 12, boxHeight: 12 } } },
    scales: {
      x: { ticks: { color: tc, maxRotation: 0, autoSkip: true }, grid: { color: gc } },
      y: { ticks: { color: tc }, grid: { color: gc } }
    }
  };
}

/* ---------- dil ve durum ---------- */
function applyI18n() {
  document.documentElement.lang = state.lang;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  const mark = (sel, key, val) => document.querySelectorAll(sel).forEach((b) => {
    const on = b.dataset[key] === val;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on);
  });
  mark("[data-lang]", "lang", state.lang);
  mark("[data-unit]", "unit", state.unit);
  mark("[data-period]", "period", state.period);
  mark("[data-sd]", "sd", state.sdMetal);
  mark("[data-tab]", "tab", state.tab);
  $("tab-market").hidden = state.tab !== "market";
  $("tab-links").hidden = state.tab !== "links";
  setText("priceUnit", `(${t("unit_long_" + state.unit)})`);
  const st = $("status");
  st.hidden = errors.size === 0;
  st.textContent = [...errors].map((k) => t(k)).join(" ");
}

/* ---------- kartlar ---------- */
function renderCards() {
  if (!DATA) return;
  const r = DATA.gold_silver_ratio || {};
  setText("ratioVal", fmtNum(r.value, 2));
  setText("ratioSub", t("ratio_sub", { avg: fmtNum(r.avg5y, 1), chg: fmtPct(r.change_30d) }));
  setText("usdtryVal", fmtNum(DATA.fx?.usdtry, 4));
  setText("eurusdVal", fmtNum(DATA.fx?.eurusd, 4));
  const up = new Date(DATA.updated);
  setText("updatedVal", isNaN(up) ? "–" : up.toLocaleString(locale(), { dateStyle: "medium", timeStyle: "short" }));
  setText("updatedSub", t("data_date", { d: new Date(DATA.last_date).toLocaleDateString(locale(), { dateStyle: "medium" }) }));
}

/* ---------- tablo ---------- */
function renderTable() {
  const tb = $("priceBody");
  tb.innerHTML = "";
  if (!DATA) return;
  for (const m of METALS) {
    const md = DATA.metals?.[m];
    if (!md) continue;
    const ch = md.changes?.[state.unit] || {};
    const p = md.price || {};
    const other = m === "copper"
      ? `$${fmtNum(p.usd_lb, 3)}/lb · $${fmtNum(p.usd_kg, 0)}/kg`
      : `$${fmtNum(p.usd_g, 2)}/g · $${fmtNum(p.usd_kg, 0)}/kg`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" data-metal="${m}" ${state.selected.has(m) ? "checked" : ""} aria-label="${t(m)}"></td>
      <td class="metal"><span class="dot" style="background:${COLORS[m]}"></span>${t(m)}<small>${md.ticker}</small></td>
      <td><strong>${fmtPrice(p[state.unit], state.unit)}</strong></td>
      ${["w", "m", "y"].map((k) => `<td class="${pctClass(ch[k])}">${fmtPct(ch[k])}</td>`).join("")}
      <td>${fmtPrice(ch.avg5y, state.unit)}</td>
      <td class="${pctClass(ch.vs_avg5y)}">${fmtPct(ch.vs_avg5y)}</td>
      <td class="muted">${other}</td>`;
    tb.appendChild(tr);
  }
  tb.querySelectorAll("input[type=checkbox]").forEach((cb) => cb.addEventListener("change", (e) => {
    const m = e.target.dataset.metal;
    if (e.target.checked) state.selected.add(m); else state.selected.delete(m);
    renderLine();
  }));
}

/* ---------- karşılaştırma grafiği ---------- */
function unitSeries(m) {
  const h = DATA.history;
  const s = h.usd_oz[m] || [];
  return s.map((v, i) => {
    if (v == null) return null;
    if (state.unit === "usd_oz") return v;
    const g = v / OZ_G;
    if (state.unit === "try_g") { const fx = h.usdtry[i]; return fx == null ? null : g * fx; }
    const e = h.eurusd[i];
    return e == null || e === 0 ? null : g / e;
  });
}

function renderLine() {
  if (lineChart) { lineChart.destroy(); lineChart = null; }
  const h = DATA?.history;
  if (!h || !h.dates?.length || typeof Chart === "undefined") return;
  const dates = h.dates;
  const cut = new Date(dates[dates.length - 1]);
  cut.setDate(cut.getDate() - PERIOD_DAYS[state.period]);
  const cutS = cut.toISOString().slice(0, 10);
  let start = dates.findIndex((d) => d >= cutS);
  if (start < 0) start = 0;
  const labels = dates.slice(start);

  const datasets = METALS.filter((m) => state.selected.has(m) && h.usd_oz[m]).map((m) => {
    const s = unitSeries(m).slice(start);
    const base = s.find((v) => v != null && v > 0);
    return {
      label: t(m),
      data: s.map((v) => (v == null || !base ? null : +(v / base * 100).toFixed(2))),
      borderColor: COLORS[m], backgroundColor: COLORS[m],
      borderWidth: 2, pointRadius: 0, pointHoverRadius: 3, tension: 0.15, spanGaps: true
    };
  });
  $("chartHint").hidden = datasets.length > 0;

  const opts = baseOptions();
  const short = state.period === "1m" || state.period === "6m";
  opts.scales.x.ticks.maxTicksLimit = 8;
  opts.scales.x.ticks.callback = function (val) {
    const d = new Date(this.getLabelForValue(val));
    return d.toLocaleDateString(locale(), short ? { day: "numeric", month: "short" } : { month: "short", year: "2-digit" });
  };
  opts.scales.y.title = { display: true, text: t("index_axis"), color: cssVar("--text-2") };
  opts.plugins.tooltip = {
    callbacks: {
      title: (items) => new Date(items[0].label).toLocaleDateString(locale(), { dateStyle: "medium" }),
      label: (c) => `${c.dataset.label}: ${fmtNum(c.parsed.y, 2)} (${fmtPct(c.parsed.y - 100)})`
    }
  };
  lineChart = new Chart($("lineChart"), { type: "line", data: { labels, datasets }, options: opts });
}

/* ---------- arz-talep ---------- */
function renderSD() {
  if (balChart) { balChart.destroy(); balChart = null; }
  if (compChart) { compChart.destroy(); compChart = null; }
  if (!SD || typeof Chart === "undefined") return;

  const est = SD.meta?.estimate_years || [];
  const labels = SD.years.map((y) => (est.includes(y) ? `${y}${t("est_mark")}` : String(y)));
  setText("sdNote", `${SD.meta?.[`note_${state.lang}`] || ""} ${t("est_note")}`);
  const unitOf = (m) => SD.metals[m][`unit_${state.lang}`];
  const supplyAt = (d, i) => d.mine_production[i] + d.recycling[i];

  // 1) Net denge (% arz), tüm metaller
  const bOpts = baseOptions();
  bOpts.scales.y.ticks.callback = (v) => `${v}%`;
  bOpts.plugins.tooltip = {
    callbacks: {
      label: (c) => {
        const m = SD_METALS[c.datasetIndex];
        const raw = SD.metals[m].balance[c.dataIndex];
        const tag = raw >= 0 ? t("surplus") : t("deficit");
        return `${c.dataset.label}: ${tag} ${fmtNum(Math.abs(raw), 0)} ${unitOf(m)} (${fmtPct(c.parsed.y)})`;
      }
    }
  };
  balChart = new Chart($("balChart"), {
    type: "bar",
    data: {
      labels,
      datasets: SD_METALS.map((m) => {
        const d = SD.metals[m];
        return {
          label: t(m),
          data: d.balance.map((b, i) => +(b / supplyAt(d, i) * 100).toFixed(2)),
          backgroundColor: COLORS[m], borderRadius: 4
        };
      })
    },
    options: bOpts
  });

  // 2) Seçili metal bileşenleri
  const m = state.sdMetal;
  const d = SD.metals[m];
  setText("sdUnit", `(${unitOf(m)})`);
  const keys = Object.keys(COMP_COLORS);
  const cOpts = baseOptions();
  cOpts.plugins.tooltip = {
    callbacks: { label: (c) => `${c.dataset.label}: ${fmtNum(c.parsed.y, 0)} ${unitOf(m)}` }
  };
  cOpts.scales.y.ticks.callback = (v) => fmtNum(v, 0);
  const posC = cssVar("--pos"), negC = cssVar("--neg");
  compChart = new Chart($("compChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        ...keys.map((k) => ({ label: t(k), data: d[k], backgroundColor: COMP_COLORS[k], borderRadius: 3 })),
        { label: t("balance"), data: d.balance, backgroundColor: d.balance.map((b) => (b >= 0 ? posC : negC)), borderRadius: 3 }
      ]
    },
    options: cOpts
  });

  $("sdChips").innerHTML = d.balance.map((b, i) => {
    const cls = b >= 0 ? "pos" : "neg";
    return `<span class="chip ${cls}">${labels[i]}: <strong class="${cls}">${b >= 0 ? t("surplus") : t("deficit")}</strong> ${fmtNum(Math.abs(b), 0)} ${unitOf(m)}</span>`;
  }).join("");
}

/* ---------- genel ---------- */
function renderAll() {
  applyI18n();
  renderCards();
  renderTable();
  renderLine();
  renderSD();
  if (typeof window.renderLinks === "function") window.renderLinks();
}

function bindEvents() {
  document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => {
    if (state.tab === b.dataset.tab) return;
    state.tab = b.dataset.tab; store.set("mp_tab", state.tab);
    applyI18n();
    if (state.tab === "market") { renderLine(); renderSD(); }
    else if (typeof window.renderLinks === "function") window.renderLinks();
  }));
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => {
    state.lang = b.dataset.lang; store.set("mp_lang", state.lang); renderAll();
  }));
  document.querySelectorAll("[data-unit]").forEach((b) => b.addEventListener("click", () => {
    state.unit = b.dataset.unit; store.set("mp_unit", state.unit);
    applyI18n(); renderTable(); renderLine();
  }));
  document.querySelectorAll("[data-period]").forEach((b) => b.addEventListener("click", () => {
    state.period = b.dataset.period; applyI18n(); renderLine();
  }));
  document.querySelectorAll("[data-sd]").forEach((b) => b.addEventListener("click", () => {
    state.sdMetal = b.dataset.sd; applyI18n(); renderSD();
  }));
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      renderLine(); renderSD();
      if (typeof window.renderLinks === "function") window.renderLinks();
    });
  } catch { /* eski tarayıcılar */ }
}

async function init() {
  bindEvents();
  applyI18n();
  const [d, s] = await Promise.allSettled([fetchJSON("data.json"), fetchJSON("supply_demand.json")]);
  if (d.status === "fulfilled") DATA = d.value; else errors.add("err_data");
  if (s.status === "fulfilled") SD = s.value; else errors.add("err_sd");
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
