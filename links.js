"use strict";
/* Metal × Tarım sekmesi — app.js'ten sonra yüklenir; DATA, state, t, fmtNum, fmtPct,
   locale, cssVar, baseOptions, COLORS, METALS, OZ_G ve $ global olarak app.js'ten gelir. */
(() => {
  const EMTIA = window.EMTIA_BASE || "https://agrihubai.github.io/emtia/data/";
  const AG_COLOR = "#2E7D5B";
  const MAXK = 6;

  Object.assign(I18N.tr, {
    tab_market: "Piyasa", tab_links: "Metal × Tarım",
    links_title: "Metal × Tarım Bağlantıları",
    links_intro: "Metaller ile tarım ürünleri arasındaki ilişki çoğunlukla dolaylıdır: enerji, dolar, faiz ve sanayi döngüsü gibi ortak sürücüler ikisini de etkiler. Bu sekme “tavuk mu yumurtadan, yumurta mı tavuktan?” sorusunu veriyle izler: hangisi önce hareket ediyor ve ilişki ne kadar güçlü. Korelasyon nedensellik değildir; buradaki ölçümler hipotez kurmak ve sınamak içindir.",
    links_source: "Tarım verisi: AgriHub-AI Emtia Panosu (IMF birincil emtia fiyatları, FRED; gübre: ABD BLS üretici fiyat endeksi). Metaller: Yahoo Finance aylık ortalamaları. Hesap: aylık log değişimlerin korelasyonu.",
    links_loading: "Tarım verisi yükleniyor…",
    links_err_emtia: "Emtia panosu verisi okunamadı (agrihubai.github.io/emtia).",
    links_err_monthly: "data.json aylık metal serisini henüz içermiyor. Actions’ta “Update market data” iş akışını bir kez çalıştırın.",
    span_all: "2015–bugün", span_5y: "Son 5 yıl",
    heat_title: "İlişki haritası (aynı ay korelasyonu)",
    heat_sub: "Mavi: aynı yönde, kırmızı: ters yönde hareket. Bir hücreye tıklayınca o çiftin “kim önde” analizi aşağıda açılır.",
    lag_title: "Kim önce hareket ediyor?",
    lag_chart_t: "Gecikmeli korelasyon",
    lag_axis: "Gecikme (ay) — sağ: metal önde · sol: tarım ürünü önde",
    pair_title: "Fiyat seyri (başlangıç = 100)",
    lbl_metal: "Metal", lbl_ag: "Tarım ürünü",
    thr: "Anlamlılık sınırı",
    lead_metal: "{m}, {a} fiyatından ortalama {k} ay önce hareket ediyor",
    lead_ag: "{a}, {m} fiyatından ortalama {k} ay önce hareket ediyor",
    lead_same: "{m} ile {a} aynı ay içinde birlikte hareket ediyor",
    s_none: "yok denecek kadar zayıf", s_weak: "zayıf", s_mid: "orta", s_strong: "güçlü",
    dir_pos: "aynı yönde", dir_neg: "ters yönde",
    sig_yes: "anlamlılık sınırının üstünde", sig_no: "anlamlılık sınırının altında, tesadüf olabilir",
    summary: "{lead}. En güçlü ilişki r = {r}: {strength}, {dir}, {sig} ({n} ay).",
    lag_tt: "Gecikme {k} ay: r = {r}",
    ratio_gold_wheat: "1 ons altın = ? ton buğday",
    ratio_gold_maize: "1 ons altın = ? ton mısır",
    ratio_cu_fert: "Bakır / gübre oranı",
    unit_t: "ton", unit_idx: "endeks (2015–24 ort. = 100)",
    ratio_sub: "5Y ort. {avg} · fark {d} · {m}",
    hyp_title: "Bağlantı hipotezleri",
    hyp_sub: "Emtia panosundaki hipotez karnesiyle aynı yapı: iddia, gerekçe, kontrol tarihi ve hipotezi çürütecek koşul. “Şu anki ölçüm” her gün veriden yeniden hesaplanır; durum kararı elle verilir.",
    h_reason: "Gerekçe", h_expect: "Beklenti", h_cond: "Çürütme koşulu", h_due: "Kontrol tarihi",
    h_now: "Şu anki ölçüm (son 60 ay)", h_show: "Grafikte göster →",
    st_draft: "Taslak · onay bekliyor", st_pending: "Bekliyor", st_held: "Tuttu", st_partial: "Kısmen tuttu",
    st_failed: "Tutmadı", st_nodata: "Veri yok",
    ratio_now: "Oran {v}; 5 yıllık ortalamaya göre {d} ({m}).",
    corr_max_now: "Metallerle en yüksek aynı ay korelasyonu: r = {r} ({m}).",
    na: "Bu çift için yeterli ortak veri yok."
  });

  Object.assign(I18N.en, {
    tab_market: "Market", tab_links: "Metals × Agriculture",
    links_title: "Metals × Agriculture Links",
    links_intro: "The link between metals and farm commodities is mostly indirect: common drivers such as energy, the dollar, interest rates and the industrial cycle move both. This tab tracks the “chicken or egg?” question with data: which one moves first, and how strong the link is. Correlation is not causation; these measurements are for building and testing hypotheses.",
    links_source: "Agricultural data: AgriHub-AI Commodity Dashboard (IMF primary commodity prices, FRED; fertilizer: US BLS producer price index). Metals: Yahoo Finance monthly averages. Method: correlation of monthly log changes.",
    links_loading: "Loading agricultural data…",
    links_err_emtia: "Could not read the commodity dashboard data (agrihubai.github.io/emtia).",
    links_err_monthly: "data.json does not contain the monthly metal series yet. Run the “Update market data” workflow once in Actions.",
    span_all: "2015–today", span_5y: "Last 5 years",
    heat_title: "Relationship map (same-month correlation)",
    heat_sub: "Blue: moving together, red: moving in opposite directions. Click a cell to open that pair's “who leads” analysis below.",
    lag_title: "Who moves first?",
    lag_chart_t: "Lagged correlation",
    lag_axis: "Lag (months) — right: metal leads · left: farm commodity leads",
    pair_title: "Price path (start = 100)",
    lbl_metal: "Metal", lbl_ag: "Farm commodity",
    thr: "Significance threshold",
    lead_metal: "{m} tends to move about {k} months before {a}",
    lead_ag: "{a} tends to move about {k} months before {m}",
    lead_same: "{m} and {a} move together within the same month",
    s_none: "negligible", s_weak: "weak", s_mid: "moderate", s_strong: "strong",
    dir_pos: "same direction", dir_neg: "opposite direction",
    sig_yes: "above the significance threshold", sig_no: "below the significance threshold, may be chance",
    summary: "{lead}. Strongest link r = {r}: {strength}, {dir}, {sig} ({n} months).",
    lag_tt: "Lag {k} months: r = {r}",
    ratio_gold_wheat: "1 oz gold = ? tonnes of wheat",
    ratio_gold_maize: "1 oz gold = ? tonnes of maize",
    ratio_cu_fert: "Copper / fertilizer ratio",
    unit_t: "tonnes", unit_idx: "index (2015–24 avg. = 100)",
    ratio_sub: "5Y avg. {avg} · gap {d} · {m}",
    hyp_title: "Link hypotheses",
    hyp_sub: "Same structure as the commodity dashboard's hypothesis scorecard: claim, reasoning, check date and the condition that would prove it wrong. The “current measurement” is recomputed daily from data; the status is decided by hand.",
    h_reason: "Reasoning", h_expect: "Expectation", h_cond: "Falsified if", h_due: "Check date",
    h_now: "Current measurement (last 60 months)", h_show: "Show on chart →",
    st_draft: "Draft · awaiting approval", st_pending: "Pending", st_held: "Held", st_partial: "Partly held",
    st_failed: "Failed", st_nodata: "No data",
    ratio_now: "Ratio {v}; {d} vs its 5-year average ({m}).",
    corr_max_now: "Highest same-month correlation with metals: r = {r} ({m}).",
    na: "Not enough overlapping data for this pair."
  });

  const L = { prices: null, meta: null, hyps: null, ag: {}, agKeys: [], err: null, loading: null,
              metal: "copper", agSel: "fert", span: "all", lagChart: null, pairChart: null, bound: false };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tx = (obj, key) => (state.lang === "en" ? obj[`${key}_en`] || obj[key] : obj[key]) || "";
  const monthLabel = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleDateString(locale(), { month: "short", year: "numeric" });

  /* ---------- veri ---------- */
  function load() {
    if (L.loading) return L.loading;
    const get = async (u) => { const r = await fetch(u, { cache: "no-cache" }); if (!r.ok) throw new Error(u); return r.json(); };
    L.loading = Promise.allSettled([
      get(EMTIA + "emtia-fiyatlari.json"), get(EMTIA + "emtia-serileri.json"), get("baglanti-hipotezleri.json")
    ]).then(([p, s, h]) => {
      if (p.status === "fulfilled") L.prices = p.value; else L.err = "links_err_emtia";
      if (s.status === "fulfilled") L.meta = s.value;
      if (h.status === "fulfilled") L.hyps = h.value;
      buildAg();
    });
    return L.loading;
  }

  function buildAg() {
    const byKey = {};
    for (const row of Array.isArray(L.prices) ? L.prices : []) {
      if (row == null || row.value == null || !row.date) continue;
      (byKey[row.series] ||= new Map()).set(String(row.date).slice(0, 7), +row.value);
    }
    const meta = Array.isArray(L.meta) ? L.meta : [];
    const order = meta.length ? meta.map((m) => m.series) : Object.keys(byKey);
    L.agKeys = order.filter((k) => byKey[k] && byKey[k].size > 24);
    for (const k of L.agKeys) L.ag[k] = { ...(meta.find((m) => m.series === k) || { name: k }), vals: byKey[k] };
    if (!L.ag[L.agSel]) L.agSel = L.agKeys[0];
  }

  const agName = (k) => (L.ag[k] ? tx(L.ag[k], "name") || k : k);

  function metalMonthly(m) {
    const mo = DATA?.monthly;
    if (!mo || !mo.usd_oz?.[m]) return null;
    const map = new Map();
    mo.dates.forEach((d, i) => { const v = mo.usd_oz[m][i]; if (v != null) map.set(d, v); });
    return map;
  }

  /* ---------- istatistik ---------- */
  function align(a, b, span) {
    let dates = [...a.keys()].filter((d) => b.has(d)).sort();
    if (span === "5y") dates = dates.slice(-61);
    return { dates, a: dates.map((d) => a.get(d)), b: dates.map((d) => b.get(d)) };
  }
  const rets = (arr) => arr.slice(1).map((v, i) => (v > 0 && arr[i] > 0 ? Math.log(v / arr[i]) : null));

  function corr(x, y) {
    let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
    for (let i = 0; i < x.length; i++) {
      const a = x[i], b = y[i];
      if (a == null || b == null) continue;
      n++; sx += a; sy += b; sxx += a * a; syy += b * b; sxy += a * b;
    }
    if (n < 12) return { r: null, n };
    const vx = sxx - sx * sx / n, vy = syy - sy * sy / n;
    if (vx <= 0 || vy <= 0) return { r: null, n };
    return { r: (sxy - sx * sy / n) / Math.sqrt(vx * vy), n };
  }

  // k > 0: metal t anında, tarım ürünü t+k anında → metal önde
  function lagged(mr, ar) {
    const out = [];
    for (let k = -MAXK; k <= MAXK; k++) {
      const x = [], y = [];
      for (let i = 0; i < mr.length; i++) {
        const j = i + k;
        if (j < 0 || j >= ar.length) continue;
        x.push(mr[i]); y.push(ar[j]);
      }
      out.push({ k, ...corr(x, y) });
    }
    return out;
  }

  const cache = new Map();
  function analyze(metal, ag, span) {
    const key = `${metal}|${ag}|${span}|${DATA?.last_date}`;
    if (cache.has(key)) return cache.get(key);
    let res = null;
    const mm = metalMonthly(metal), am = L.ag[ag]?.vals;
    if (mm && am) {
      const al = align(mm, am, span);
      const mr = rets(al.a), ar = rets(al.b);
      const lags = lagged(mr, ar);
      const valid = lags.filter((o) => o.r != null);
      if (valid.length) {
        const best = valid.reduce((p, c) => (Math.abs(c.r) > Math.abs(p.r) ? c : p));
        const same = lags.find((o) => o.k === 0);
        const n = mr.filter((v) => v != null).length;
        res = { al, lags, best, same, n, thr: 1.96 / Math.sqrt(Math.max(n, 1)) };
      }
    }
    cache.set(key, res);
    return res;
  }

  function strength(r) {
    const a = Math.abs(r);
    return t(a < 0.15 ? "s_none" : a < 0.3 ? "s_weak" : a < 0.5 ? "s_mid" : "s_strong");
  }

  function summary(res, metal, ag) {
    if (!res) return t("na");
    const vars = { m: t(metal), a: agName(ag), k: Math.abs(res.best.k) };
    const lead = res.best.k > 0 ? t("lead_metal", vars) : res.best.k < 0 ? t("lead_ag", vars) : t("lead_same", vars);
    return t("summary", {
      lead,
      r: fmtNum(res.best.r, 2),
      strength: strength(res.best.r),
      dir: t(res.best.r >= 0 ? "dir_pos" : "dir_neg"),
      sig: t(Math.abs(res.best.r) >= res.thr ? "sig_yes" : "sig_no"),
      n: res.n
    });
  }

  /* ---------- oranlar ---------- */
  function ratioSeries(kind) {
    if (kind === "gold_wheat" || kind === "gold_maize") {
      const g = metalMonthly("gold"), a = L.ag[kind === "gold_wheat" ? "wheat" : "maize"]?.vals;
      if (!g || !a) return null;
      const al = align(g, a, "all");
      return { dates: al.dates, v: al.a.map((x, i) => x / al.b[i]), unit: "unit_t", d: 2 };
    }
    if (kind === "cu_fert") {
      const c = metalMonthly("copper"), f = L.ag.fert?.vals;
      if (!c || !f) return null;
      const al = align(c, f, "all");
      const raw = al.a.map((x, i) => (x / OZ_G * 1e6) / al.b[i]);
      const base = raw.filter((_, i) => al.dates[i] <= "2024-12");
      const avg = base.reduce((s, v) => s + v, 0) / (base.length || 1);
      return { dates: al.dates, v: raw.map((v) => v / avg * 100), unit: "unit_idx", d: 1 };
    }
    return null;
  }
  function ratioStats(s) {
    if (!s || !s.v.length) return null;
    const last = s.v[s.v.length - 1];
    const w = s.v.slice(-60);
    const avg = w.reduce((a, b) => a + b, 0) / w.length;
    return { last, avg, dev: (last / avg - 1) * 100, month: s.dates[s.dates.length - 1], d: s.d, unit: s.unit };
  }

  /* ---------- çizim ---------- */
  function renderRatios() {
    const box = $("ratioCards");
    box.innerHTML = ["gold_wheat", "gold_maize", "cu_fert"].map((k) => {
      const st = ratioStats(ratioSeries(k));
      if (!st) return "";
      return `<article class="card">
        <h3>${esc(t("ratio_" + k))}</h3>
        <div class="big">${fmtNum(st.last, st.d)} <small>${esc(t(st.unit))}</small></div>
        <div class="sub">${esc(t("ratio_sub", { avg: fmtNum(st.avg, st.d), d: fmtPct(st.dev), m: monthLabel(st.month) }))}</div>
      </article>`;
    }).join("");
  }

  function heatColor(r) {
    if (r == null) return "transparent";
    const a = Math.min(Math.abs(r) / 0.6, 1) * 0.8;
    return r >= 0 ? `rgba(59,110,165,${a.toFixed(2)})` : `rgba(201,55,44,${a.toFixed(2)})`;
  }

  function renderHeat() {
    const tb = $("heatTable");
    const head = `<thead><tr><th></th>${L.agKeys.map((k) => `<th>${esc(agName(k))}</th>`).join("")}</tr></thead>`;
    const body = METALS.map((m) => `<tr><th class="row"><span class="dot" style="background:${COLORS[m]}"></span>${esc(t(m))}</th>${
      L.agKeys.map((a) => {
        const res = analyze(m, a, L.span);
        const r = res?.same?.r;
        const sel = m === L.metal && a === L.agSel ? " sel" : "";
        const tip = res ? summary(res, m, a) : t("na");
        const strong = r != null && Math.abs(r) >= 0.45 ? " strong" : "";
        return `<td class="${sel}${strong}" style="background:${heatColor(r)}" data-m="${m}" data-a="${esc(a)}" title="${esc(tip)}">${r == null ? "–" : fmtNum(r, 2)}</td>`;
      }).join("")}</tr>`).join("");
    tb.innerHTML = head + `<tbody>${body}</tbody>`;
  }

  function fillSelects() {
    $("selMetal").innerHTML = METALS.map((m) => `<option value="${m}"${m === L.metal ? " selected" : ""}>${esc(t(m))}</option>`).join("");
    $("selAg").innerHTML = L.agKeys.map((a) => `<option value="${esc(a)}"${a === L.agSel ? " selected" : ""}>${esc(agName(a))}</option>`).join("");
  }

  function renderPair() {
    if (L.lagChart) { L.lagChart.destroy(); L.lagChart = null; }
    if (L.pairChart) { L.pairChart.destroy(); L.pairChart = null; }
    const res = analyze(L.metal, L.agSel, L.span);
    $("lagSummary").textContent = summary(res, L.metal, L.agSel);
    if (!res || typeof Chart === "undefined") return;

    const mc = COLORS[L.metal], gray = "#7d8898";
    const colors = res.lags.map((o) => {
      const base = o.k > 0 ? mc : o.k < 0 ? AG_COLOR : gray;
      return o.k === res.best.k ? base : base + "59";
    });
    const lo = baseOptions();
    lo.interaction = { mode: "index", intersect: false };
    lo.scales.y.suggestedMin = -0.6; lo.scales.y.suggestedMax = 0.6;
    lo.scales.y.ticks.callback = (v) => fmtNum(v, 1);
    lo.scales.x.title = { display: true, text: t("lag_axis"), color: cssVar("--text-2") };
    lo.plugins.legend.labels.filter = (item) => item.datasetIndex === 1;
    lo.plugins.tooltip = {
      filter: (c) => c.datasetIndex === 0,
      callbacks: { label: (c) => t("lag_tt", { k: res.lags[c.dataIndex].k, r: fmtNum(c.parsed.y, 2) }) }
    };
    const thrLine = (sign) => ({
      type: "line", label: `${t("thr")} (±${fmtNum(res.thr, 2)})`, data: res.lags.map(() => sign * res.thr),
      borderColor: gray, borderDash: [4, 4], borderWidth: 1, pointRadius: 0, fill: false
    });
    L.lagChart = new Chart($("lagChart"), {
      type: "bar",
      data: {
        labels: res.lags.map((o) => (o.k > 0 ? `+${o.k}` : String(o.k))),
        datasets: [
          { label: "r", data: res.lags.map((o) => (o.r == null ? null : +o.r.toFixed(3))), backgroundColor: colors, borderRadius: 3 },
          thrLine(1), thrLine(-1)
        ]
      },
      options: lo
    });

    const reb = (arr) => { const b = arr.find((v) => v > 0); return arr.map((v) => (v > 0 && b ? +(v / b * 100).toFixed(2) : null)); };
    const po = baseOptions();
    po.scales.x.ticks.maxTicksLimit = 8;
    po.scales.x.ticks.callback = function (val) { return monthLabel(this.getLabelForValue(val)); };
    po.plugins.tooltip = {
      callbacks: {
        title: (items) => monthLabel(items[0].label),
        label: (c) => `${c.dataset.label}: ${fmtNum(c.parsed.y, 1)}`
      }
    };
    L.pairChart = new Chart($("pairChart"), {
      type: "line",
      data: {
        labels: res.al.dates,
        datasets: [
          { label: t(L.metal), data: reb(res.al.a), borderColor: mc, backgroundColor: mc, borderWidth: 2, pointRadius: 0, tension: 0.15, spanGaps: true },
          { label: agName(L.agSel), data: reb(res.al.b), borderColor: AG_COLOR, backgroundColor: AG_COLOR, borderWidth: 2, pointRadius: 0, tension: 0.15, spanGaps: true }
        ]
      },
      options: po
    });
  }

  function hypNow(h) {
    const a = h.auto || {};
    if (a.type === "leadlag") return summary(analyze(a.metal, a.ag, "5y"), a.metal, a.ag);
    if (a.type === "ratio") {
      const st = ratioStats(ratioSeries(a.ratio));
      return st ? t("ratio_now", { v: fmtNum(st.last, st.d), d: fmtPct(st.dev), m: monthLabel(st.month) }) : t("na");
    }
    if (a.type === "corr_max") {
      let best = null;
      for (const m of METALS) {
        const r = analyze(m, a.ag, "5y")?.same?.r;
        if (r != null && (!best || Math.abs(r) > Math.abs(best.r))) best = { m, r };
      }
      return best ? t("corr_max_now", { r: fmtNum(best.r, 2), m: t(best.m) }) : t("na");
    }
    return "";
  }

  function hypTarget(h) {
    const a = h.auto || {};
    if (a.type === "leadlag") return [a.metal, a.ag];
    if (a.type === "ratio") return a.ratio === "cu_fert" ? ["copper", "fert"] : ["gold", a.ratio === "gold_maize" ? "maize" : "wheat"];
    if (a.type === "corr_max") return ["gold", a.ag];
    return null;
  }

  function renderHyps() {
    const items = L.hyps?.items || [];
    $("hypList").innerHTML = items.map((h, i) => {
      const due = h.due ? new Date(`${h.due}T00:00:00`).toLocaleDateString(locale(), { dateStyle: "medium" }) : "–";
      const target = hypTarget(h);
      return `<article class="hyp">
        <div class="hyp-head"><span class="hyp-id">${esc(h.id)}</span><span class="badge st-${esc(h.status)}">${esc(t("st_" + h.status))}</span></div>
        <p class="claim">${esc(tx(h, "claim"))}</p>
        <dl>
          <dt>${esc(t("h_reason"))}</dt><dd>${esc(tx(h, "reason"))}</dd>
          <dt>${esc(t("h_expect"))}</dt><dd>${esc(tx(h, "expect"))}</dd>
          <dt>${esc(t("h_cond"))}</dt><dd>${esc(tx(h, "cond"))}</dd>
          <dt>${esc(t("h_due"))}</dt><dd>${esc(due)}</dd>
        </dl>
        <div class="now"><strong>${esc(t("h_now"))}:</strong> ${esc(hypNow(h))}</div>
        ${target ? `<button type="button" class="link" data-h="${i}">${esc(t("h_show"))}</button>` : ""}
      </article>`;
    }).join("");
    $("hypList").querySelectorAll("button[data-h]").forEach((b) => b.addEventListener("click", () => {
      const tg = hypTarget(items[+b.dataset.h]);
      if (!tg || !L.ag[tg[1]]) return;
      [L.metal, L.agSel] = tg;
      refreshPair();
      $("lagSection").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  function refreshPair() { fillSelects(); renderHeat(); renderPair(); }

  function markSpan() {
    document.querySelectorAll("[data-span]").forEach((b) => {
      const on = b.dataset.span === L.span;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on);
    });
  }

  function bind() {
    if (L.bound) return;
    L.bound = true;
    document.querySelectorAll("[data-span]").forEach((b) => b.addEventListener("click", () => {
      L.span = b.dataset.span; markSpan(); renderHeat(); renderPair();
    }));
    $("selMetal").addEventListener("change", (e) => { L.metal = e.target.value; refreshPair(); });
    $("selAg").addEventListener("change", (e) => { L.agSel = e.target.value; refreshPair(); });
    $("heatTable").addEventListener("click", (e) => {
      const td = e.target.closest("td[data-m]");
      if (!td) return;
      L.metal = td.dataset.m; L.agSel = td.dataset.a; refreshPair();
    });
  }

  window.renderLinks = async function () {
    if (state.tab !== "links") return;
    bind();
    const st = $("linksStatus");
    if (!L.prices && !L.err) { st.hidden = false; st.textContent = t("links_loading"); await load(); }
    if (state.tab !== "links") return;
    const msgs = [];
    if (L.err) msgs.push(t(L.err));
    if (!DATA?.monthly) msgs.push(t("links_err_monthly"));
    st.hidden = msgs.length === 0;
    st.textContent = msgs.join(" ");
    markSpan();
    if (!L.agKeys.length || !DATA?.monthly) return;
    fillSelects(); renderRatios(); renderHeat(); renderPair(); renderHyps();
  };
})();
