/* Zeichnungen des Decks "Next-Token Prediction" (Konzept, 2026-10-22).
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer dieselbe Leinwand; was noch nicht sichtbar
 * sein soll, wird weggelassen, nie verschoben. So wandert nichts.
 *
 * Alle Wahrscheinlichkeiten sind ausgedacht (Fussnote auf den Folien), die
 * Temperatur ist aber echt gerechnet: p_i^(1/T), neu normiert. Der Rest des
 * Wortschatzes ist als 1000 gleich wahrscheinliche Tokens mit zusammen 18 %
 * angenommen; bei T = 2 holt dieser Schwanz deshalb fast alles.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

/* Textbreite in Arial, im Browser gemessen; Codeschrift rechnet 0,6 × Groesse */
function breite(text, size, mono) {
  if (mono) return text.length * size * 0.6;
  const ctx = breite.ctx || (breite.ctx = document.createElement("canvas").getContext("2d"));
  ctx.font = `${size}px ${C().font}`;
  return ctx.measureText(text).width;
}

/* ------------------------------------------------------------------ */
/* Tokens eines Satzes, darunter ihre Nummern                           */
/* ------------------------------------------------------------------ */
const SATZ = [["the", 1820], ["farmer", 47312], ["drove", 31907], ["the", 1820], ["tractor", 72545], ["into", 1511], ["the", 1820]];

function figTokens(step) {
  const c = C();
  const W = 1680, H = 300, size = 48, gap = 20, h = 100, y = 40;
  // Kastenbreite: Zeichen × 48 × 0,6 + 2 × 20 Rand; Summe 31 Zeichen → 893 + 280 + 6 × 20 = 1293
  const ws = SATZ.map(([t]) => breite(t, size, true) + 40);
  let x = (W - ws.reduce((a, b) => a + b, 0) - gap * (SATZ.length - 1)) / 2;
  const parts = [];
  SATZ.forEach(([t, id], i) => {
    parts.push(d.box(x, y, ws[i], h, t, { border: i % 2 ? c.light : c.blue, size, mono: true, width: 3 }));
    // Nummer: hoechstens 5 Ziffern × 32 × 0,6 = 96 < kleinster Kasten 126
    if (step >= 1) parts.push(d.label(x + ws[i] / 2, 0, String(id), { size: 32, color: c.gray, mono: true, anchor: "middle", centerY: y + h + 60 }));
    x += ws[i] + gap;
  });
  return d.svg(W, H, ...parts);
}
function showTokens(slide, step) { if ($("fig-tokens")) $("fig-tokens").innerHTML = figTokens(step || 0); }

/* ------------------------------------------------------------------ */
/* seltene Woerter zerfallen in Stuecke                                 */
/* ------------------------------------------------------------------ */
const WOERTER = [
  ["english", ["tractor"]],
  ["english", ["un", "believ", "able"]],
  ["german", ["Dün", "ge", "bedarf", "s", "ermitt", "lung"]],
];

function figSplit(step) {
  const c = C();
  const W = 1680, H = 470, size = 48, gap = 14, h = 96, x0 = 300;
  const parts = [];
  WOERTER.forEach(([sprache, stuecke], r) => {
    const y = 10 + r * 160;
    parts.push(d.label(x0 - 60, 0, sprache, { size: 32, color: c.gray, anchor: "end", centerY: y + h / 2 }));
    // laengste Zeile: 21 Zeichen × 28,8 + 6 × 40 + 5 × 14 = 915 < 1380
    let x = x0;
    stuecke.forEach((s, i) => {
      const w = breite(s, size, true) + 40;
      parts.push(d.box(x, y, w, h, s, { border: i % 2 ? c.light : c.blue, size, mono: true, keepCase: true, width: 3 }));
      x += w + gap;
    });
    if (step >= 1) parts.push(d.label(x + 30, 0, `${stuecke.length} token${stuecke.length > 1 ? "s" : ""}`, { size: 32, color: c.gray, centerY: y + h / 2 }));
  });
  return d.svg(W, H, ...parts);
}
function showSplit(slide, step) { if ($("fig-split")) $("fig-split").innerHTML = figSplit(step || 0); }

/* ------------------------------------------------------------------ */
/* Wahrscheinlichkeiten fuer das naechste Token                         */
/* ------------------------------------------------------------------ */
const NAECHSTE = [["field", 0.41], ["barn", 0.22], ["yard", 0.09], ["shed", 0.06], ["mud", 0.04]];
const REST = 0.18, REST_N = 1000;

function mitTemperatur(T) {
  if (T === 0) return [...NAECHSTE.map(([t], i) => [t, i === 0 ? 1 : 0]), ["all others", 0]];
  const g = NAECHSTE.map(([t, p]) => [t, Math.pow(p, 1 / T)]);
  const rest = REST_N * Math.pow(REST / REST_N, 1 / T);
  const summe = g.reduce((a, [, v]) => a + v, 0) + rest;
  return [...g.map(([t, v]) => [t, v / summe]), ["all others", rest / summe]];
}

/* Balken waagerecht: Token links (Codeschrift), Balken, Prozent rechts.
   100 % = volle Balkenbreite, auf allen Folien gleich gerechnet. */
function balken(x, y, werte, o) {
  const c = C();
  const { lw, bw, rh, size } = o;
  const parts = [];
  werte.forEach(([t, p], i) => {
    const cy = y + i * rh + rh / 2;
    const rest = t === "all others";
    // o.punkte: der Rest erscheint nur als "…", ohne Balken und ohne Wert (Nicolas, 22.10.2026)
    if (rest && o.punkte) { parts.push(d.label(x + lw - 24, 0, "…", { size, color: c.gray, anchor: "end", centerY: cy })); return; }
    parts.push(d.label(x + lw - 24, 0, t, { size, color: rest ? c.gray : c.white, mono: !rest, anchor: "end", centerY: cy }));
    const len = Math.max(p * bw, p > 0 ? 3 : 0);
    if (len > 0) parts.push(d.box(x + lw, cy - rh * 0.3, len, rh * 0.6, "", { border: null, fill: rest ? c.gray : c.blue, rx: 4 }));
    parts.push(d.label(x + lw + len + (o.wsize || 32) / 2, 0, Math.round(p * 100) + "%", { size: o.wsize || 32, color: c.light, centerY: cy }));
  });
  return parts;
}

// Geometrie der grossen Fassung, gleich auf "field, barn or yard" und "top k and top p"
const GROSS = { lw: 300, bw: 1100, rh: 84, size: 48, punkte: true };
const KONTEXT = "the farmer drove the tractor into the …";

function figProbs(step) {
  const c = C();
  const W = 1680, H = 640;
  const parts = [d.label(0, 0, KONTEXT, { size: 48, mono: true, centerY: 40 })];
  parts.push(...balken(0, 110, mitTemperatur(1), GROSS));
  if (step >= 1) parts.push(d.label(GROSS.lw, 0, "262,000 tokens in the vocabulary, most of them almost zero", { size: 32, color: c.gray, centerY: 110 + 6 * GROSS.rh + 40 }));
  return d.svg(W, H, ...parts);
}
function showProbs(slide, step) { if ($("fig-probs")) $("fig-probs").innerHTML = figProbs(step || 0); }

function figCut(step) {
  const c = C();
  const W = 1680, H = 640;
  const parts = [d.label(0, 0, KONTEXT, { size: 48, mono: true, centerY: 40 })];
  const y0 = 110, werte = mitTemperatur(1);
  // Schnittlinien zwischen den Zeilen: top k = 3 nach "yard", top p = 0.6 nach "barn" (41 + 22 = 63 ≥ 60)
  const schnitt = (zeilen, text, farbe) => {
    const y = y0 + zeilen * GROSS.rh;
    // Linie endet 40 vor dem Label: "top p = 0.6" 11 × 32 × 0,6 ≈ 211, rechtsbuendig an 1676 → beginnt bei 1465
    return [d.line(GROSS.lw - 280, y, 1420, y, { color: farbe, width: 3, dashed: true }),
            d.label(1676, 0, text, { size: 32, color: farbe, mono: true, anchor: "end", centerY: y })];
  };
  // Weiss und Gruen statt Gelb: Gelb heisst in diesen Decks "aktuell"
  if (step >= 1) parts.push(...schnitt(3, "top k = 3", c.white));
  if (step >= 2) parts.push(...schnitt(2, "top p = 0.6", c.green));
  parts.push(...balken(0, y0, werte, GROSS));
  return d.svg(W, H, ...parts);
}
function showCut(slide, step) { if ($("fig-cut")) $("fig-cut").innerHTML = figCut(step || 0); }

/* Temperatur: drei Spalten, je Schritt eine. Spaltenbreite 520, Luecke 60;
   in der Spalte: Token 150, Balken 100 % = 240, Wert "100%" 4 × 32 × 0,6 ≈ 80 → 150 + 240 + 16 + 80 = 486 < 520 */
function figTemp(step) {
  const c = C();
  const W = 1680, H = 620;
  const klein = { lw: 170, bw: 240, rh: 76, size: 32 };
  const parts = [];
  [0, 1, 2].forEach((T, i) => {
    if (step < i) return;
    const x = i * 580;
    parts.push(d.label(x + klein.lw, 0, "temperature " + T, { size: 48, color: c.blue, centerY: 40 }));
    parts.push(...balken(x, 110, mitTemperatur(T), klein));
  });
  return d.svg(W, H, ...parts);
}
function showTemp(slide, step) { if ($("fig-temp")) $("fig-temp").innerHTML = figTemp(step || 0); }

/* ------------------------------------------------------------------ */
/* die Schleife: Kontext → Modell → Wahrscheinlichkeiten → ein Token     */
/* ------------------------------------------------------------------ */
// Bootstrap Icons "question-circle" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_QUESTION_CIRCLE = '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>';
function figLoop(step) {
  const c = C();
  const W = 1680, H = 800;
  // vier Kaesten à 330, Luecken 120: 4 × 330 + 3 × 120 = 1680; laengster Text
  // "pick one token" 14 × 32 × 0,6 = 269 < 330 - 40; Rand 3 Einheiten eingerueckt.
  // Kaesten bei y 200: darueber steht die Verteilung von "the field, the barn or the yard?" in klein.
  const w = 330, h = 120, y = 200, gap = 120;
  const xs = [3, 3 + w + gap, 3 + 2 * (w + gap), W - 3 - w];
  const namen = ["context", "model", "probabilities", "pick one token"];
  const wires = [], boxes = [], labels = [];
  for (let i = 0; i < 3; i++) wires.push(d.arrow(xs[i] + w, y + h / 2, xs[i + 1], y + h / 2, { color: c.light, width: 3 }));
  // Rueckweg: unten herum zurueck zum Kontext, Pfeilspitze an der Unterkante
  const yr = y + h + 90, a = xs[3] + w / 2, b = xs[0] + w / 2;
  wires.push(d.line(a, y + h, a, yr, { color: c.blue, width: 3 }));
  wires.push(d.line(a, yr, b, yr, { color: c.blue, width: 3 }));
  wires.push(d.arrow(b, yr, b, y + h, { color: c.blue, width: 3 }));
  labels.push(d.label((a + b) / 2, 0, "append it and start again", { size: 32, color: c.blue, anchor: "middle", centerY: yr + 40 }));
  namen.forEach((n, i) => boxes.push(d.box(xs[i], y, w, h, n, { border: i === 1 ? c.blue : c.light, size: 32, width: 3 })));
  // kleine Verteilung ueber "probabilities" (Nicolas, 22.10.2026): sechs Zeilen à 28 = 168, von y 14 bis 182,
  // 18 ueber dem Kasten. Token-Spalte 100 ("field" 5 × 20 × 0,6 = 60), 41 % → 176, Wert "41%" ≈ 40: 100 + 176 + 10 + 40 = 326 < 330
  labels.push(...balken(xs[2], 14, mitTemperatur(1), { lw: 100, bw: 430, rh: 28, size: 20, wsize: 20, punkte: true }));

  // die Zeile darunter waechst je Schritt um ein Token; Codeschrift, also Breite = Zeichen × 28,8
  const basis = "the farmer drove the tractor into the";
  const neu = [" field", ",", " where"];
  const zy = 630;
  let text = basis;
  labels.push(d.label(0, 0, basis, { size: 48, mono: true, centerY: zy }));
  for (let s = 1; s <= Math.min(step, 3); s++) {
    // SVG verschluckt fuehrende Leerzeichen: Leerzeichen in die Position rechnen, nicht in den Text
    const t = neu[s - 1], lead = t.length - t.trimStart().length;
    const x = breite(text, 48, true) + lead * 48 * 0.6;
    labels.push(d.label(x, 0, t.trimStart(), { size: 48, mono: true, color: s === Math.min(step, 3) ? c.blue : c.white, centerY: zy }));
    text += t;
  }
  // Schritt 4: nur die Frage an den Raum, die Antwort steht in den Notizen (Nicolas, 22.10.2026).
  // Symbol so gross wie die Schrift (48), in Blau, damit es beim Einblenden auffaellt.
  if (step >= 4) {
    labels.push(d.icon(0, zy + 110 - 24, 48, ICON_QUESTION_CIRCLE, { color: c.blue }));
    labels.push(d.label(76, 0, "when does it stop?", { size: 48, centerY: zy + 110 }));
  }
  return d.svg(W, H, ...d.layers(wires, boxes, labels));
}
function showLoop(slide, step) { if ($("fig-loop")) $("fig-loop").innerHTML = figLoop(step || 0); }

/* ------------------------------------------------------------------ */
/* der Kontext als Stapel, dann drei Aufrufe nebeneinander               */
/* ------------------------------------------------------------------ */
function figStack(step) {
  const c = C();
  const W = 1680, H = 640;
  const parts = [];
  // links: Stapel von unten nach oben, Karten 560 × 96, Luecke 20; laengster Text
  // "the conversation so far" 23 Zeichen × 32 × 0,6 ≈ 442 < 560 - 40
  const karten = ["system prompt", "the conversation so far", "your document", "the answer so far"];
  const kw = 560, kh = 96, unten = 600;
  karten.forEach((k, i) => {
    if (step < i) return;
    const y = unten - (i + 1) * (kh + 20);
    parts.push(d.box(3, y, kw, kh, k, { border: i === 3 ? c.blue : c.light, size: 32, width: 3, rx: 10 }));
  });
  if (step >= 4) {
    // rechts: drei Aufrufe, der Stapel waechst mit jeder Nachricht
    const x0 = 760, sw = 240, sh = 44, sgap = 10, abstand = 320;
    [2, 4, 6].forEach((n, a) => {
      const x = x0 + a * abstand;
      for (let i = 0; i < n; i++) {
        const y = unten - 60 - (i + 1) * (sh + sgap);
        parts.push(d.box(x, y, sw, sh, "", { border: i === 0 ? c.light : c.gray, width: 2, rx: 6 }));
      }
      parts.push(d.label(x + sw / 2, 0, "message " + (a + 1), { size: 32, color: c.gray, anchor: "middle", centerY: unten - 20 }));
    });
    parts.push(d.label(x0, 0, "the program sends everything again,\nbecause the model remembers nothing", { size: 32, color: c.white, centerY: 70 }));
  }
  return d.svg(W, H, ...parts);
}
function showStack(slide, step) { if ($("fig-stack")) $("fig-stack").innerHTML = figStack(step || 0); }

/* ------------------------------------------------------------------ */
/* "it": der Traktor oder das Tor?                                     */
/* ------------------------------------------------------------------ */
function figIt(step) {
  const c = C();
  const W = 1680, H = 520, size = 48, zy = 330;
  const ende = step >= 2 ? "narrow" : "wide";
  const woerter = ["the", "tractor", "did", "not", "fit", "through", "the", "gate", "because", "it", "was", "too", ende];
  // Satz in Arial 48, Woerter einzeln gesetzt, Positionen im Browser gemessen; mittig auf 1680
  const leer = breite(" ", size);
  const ws = woerter.map((w) => breite(w, size));
  const gesamt = breite(woerter.slice(0, -1).join(" ") + " wide", size);
  let x = (W - gesamt) / 2;
  const mitte = {};
  const ziel = step >= 2 ? 7 : 1;           // gate oder tractor
  const labels = [], wires = [];
  woerter.forEach((w, i) => {
    const hell = step >= 1 && (i === 9 || i === ziel || i === 12);
    labels.push(d.label(x, 0, w, { size, color: hell ? c.blue : c.white, centerY: zy }));
    mitte[i] = x + ws[i] / 2;
    x += ws[i] + leer;
  });
  if (step >= 1) {
    // Bogen ueber dem Satz von "it" zum Bezugswort; Hoehe nach Abstand, oben 60 Rand
    const x1 = mitte[9], x2 = mitte[ziel], yb = zy - 40, hoch = Math.min(220, Math.abs(x1 - x2) * 0.35);
    wires.push(`<path d="M${x1},${yb} C${x1},${yb - hoch} ${x2},${yb - hoch} ${x2},${yb}" fill="none" stroke="${c.blue}" stroke-width="4"/>`);
  }
  labels.push(d.label(W / 2, 0, "to predict the next token, a transformer looks at all tokens of the context at once", { size: 32, color: c.gray, anchor: "middle", centerY: zy + 140 }));
  return d.svg(W, H, ...d.layers(wires, labels));
}
function showIt(slide, step) { if ($("fig-it")) $("fig-it").innerHTML = figIt(step || 0); }

/* ------------------------------------------------------------------ */
/* jedes Token mit jedem: die Matrix (Nicolas, 22.10.2026)              */
/* ------------------------------------------------------------------ */
/* Zellen zeigen nur, wie stark ein Wort auf ein anderes zurueckgreift, nicht wie.
   Die Werte sind ausgedacht (Fussnote). Nur die untere Haelfte ist gefuellt:
   ein Token schaut nur auf die Tokens davor; die obere Haelfte bleibt als leere
   Kaestchen stehen, damit man das ganze n × n sieht. */
const SATZ_IT = ["the", "tractor", "did", "not", "fit", "through", "the", "gate", "because", "it", "was", "too", "wide"];
const STARK = { "9,1": 0.95, "12,1": 0.7, "12,9": 0.6, "4,1": 0.55, "7,5": 0.6, "5,4": 0.5, "3,2": 0.6, "11,10": 0.5, "12,11": 0.55, "8,4": 0.45, "1,0": 0.5, "7,6": 0.5 };

function staerke(r, s) {
  if (STARK[`${r},${s}`] !== undefined) return STARK[`${r},${s}`];
  if (r === s) return 0.35;
  return 0.08 + ((r * 7 + s * 13) % 5) * 0.03;      // schwacher, fester Grundton
}

function figMatrix(step) {
  const c = C();
  const W = 1680, H = 720, n = SATZ_IT.length, z = 40;
  // Matrix: Zeilenbeschriftung rechtsbuendig bis x 236, Zellen ab x 260; 13 × 40 = 520 breit.
  // Spaltenbeschriftung um 60° gedreht ueber der Matrix: "through" ≈ 108 breit → ≈ 94 hoch.
  const x0 = 260, y0 = 170;
  const parts = [];
  SATZ_IT.forEach((w, i) => {
    const hell = step >= 1 && i === 9;
    parts.push(d.label(x0 - 24, 0, w, { size: 32, color: hell ? c.yellow : c.light, anchor: "end", centerY: y0 + i * z + z / 2 }));
    const cx = x0 + i * z + z / 2, cy = y0 - 14;
    parts.push(`<text x="${cx}" y="${cy}" transform="rotate(-60 ${cx} ${cy})" font-family="${c.font.replace(/"/g, "'")}" font-size="20" fill="${c.light}">${w}</text>`);
  });
  for (let r = 0; r < n; r++) {
    for (let s = 0; s < n; s++) {
      const x = x0 + s * z, y = y0 + r * z;
      if (s > r) { parts.push(`<rect x="${x + 2}" y="${y + 2}" width="${z - 4}" height="${z - 4}" rx="4" fill="none" stroke="${c.dark}" stroke-width="2"/>`); continue; }
      parts.push(`<rect x="${x + 2}" y="${y + 2}" width="${z - 4}" height="${z - 4}" rx="4" fill="${c.blue}" fill-opacity="${staerke(r, s).toFixed(2)}"/>`);
    }
  }
  // Zeile "it" gelb umrandet: das Token, um das es gerade geht
  if (step >= 1) parts.push(`<rect x="${x0}" y="${y0 + 9 * z}" width="${n * z}" height="${z}" rx="6" fill="none" stroke="${c.yellow}" stroke-width="3"/>`);

  // rechts: wie die Zahl der Zellen waechst; Spalten rechtsbuendig an 1150 und 1676
  // laengste Zahl "17,179,869,184" 14 × 48 × 0,6 ≈ 403 → beginnt bei 1273 > 1150 + 60
  const tx = 1150, cxr = 1676, ty = 260, rh = 110;
  if (step >= 2) {
    parts.push(d.label(tx, 0, "tokens", { size: 32, color: c.gray, anchor: "end", centerY: ty - 70 }));
    parts.push(d.label(cxr, 0, "cells", { size: 32, color: c.gray, anchor: "end", centerY: ty - 70 }));
  }
  [["13", "169"], ["1,000", "1,000,000"], ["131,072", "17,179,869,184"]].forEach(([t, k], i) => {
    if (step < i + 2) return;
    parts.push(d.label(tx, 0, t, { size: 48, mono: true, anchor: "end", centerY: ty + i * rh }));
    parts.push(d.label(cxr, 0, k, { size: 48, mono: true, color: c.blue, anchor: "end", centerY: ty + i * rh }));
  });
  if (step >= 5) parts.push(d.label(cxr, 0, "twice the context means four times the cells.", { size: 32, color: c.white, anchor: "end", centerY: ty + 3 * rh + 20 }));
  return d.svg(W, H, ...parts);
}
function showMatrix(slide, step) { if ($("fig-matrix")) $("fig-matrix").innerHTML = figMatrix(step || 0); }
