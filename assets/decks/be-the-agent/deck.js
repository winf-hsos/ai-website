/* Zeichnungen des Decks "Be the Agent" (Experiment, 2026-10-02).
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer dieselbe Leinwand; was noch nicht sichtbar
 * sein soll, wird weggelassen, nie verschoben. So wandert nichts.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

/* ------------------------------------------------------------------ */
/* seven roles: 0 Model · 1 Werkzeuge · 2 Harness · 3 Observer          */
/* ------------------------------------------------------------------ */
function figRoles(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 1680, H = 720;

  // Werkzeugtische oben in einer Reihe
  const tw = 300, th = 110, ty = 30;
  const tools = ["search", "web", "files", "calculator"];
  const txs = [90, 490, 890, 1290];

  // Tisch des Models in der Mitte unten
  const mx = 640, my = 430, mw = 400, mh = 150;
  const mcx = mx + mw / 2;

  if (step >= 2) {
    // der Weg des Harness: vom Model zu jedem Werkzeug, gestrichelt
    txs.forEach((x) => wires.push(d.line(mcx, my, x + tw / 2, ty + th, { color: c.gray, width: 3, dashed: true })));
    // Beschriftung links neben dem Model, unterhalb der Wege, damit keine Linie sie kreuzt
    labels.push(d.label(60, 0, "harness: carries every card\nand brings the result back", { size: 32, color: c.light, centerY: my + mh / 2 }));
  }

  boxes.push(d.box(mx, my, mw, mh, "model", { border: c.blue, color: c.white, size: 48, width: 4 }));
  labels.push(d.label(mcx, 0, "sees only its stack of cards", { size: 32, color: c.gray, anchor: "middle", centerY: my + mh + 45 }));

  if (step >= 1) {
    tools.forEach((t, i) => boxes.push(d.box(txs[i], ty, tw, th, t, { border: c.light, color: c.white, size: 32 })));
  }

  if (step >= 3) {
    boxes.push(d.box(1290, 470, 300, 110, "observer", { border: c.gray, color: c.light, size: 32, dashed: true }));
    labels.push(d.label(1440, 0, "keeps the log", { size: 32, color: c.gray, anchor: "middle", centerY: 625 }));
  }

  return d.svg(W, H, ...d.layers(wires, boxes, labels));
}

function showRoles(slide, step) { if ($("fig-roles")) $("fig-roles").innerHTML = figRoles(step || 0); }

/* ------------------------------------------------------------------ */
/* four kinds of cards: eine Karte je Schritt                           */
/* ------------------------------------------------------------------ */
function karte(x, y, w, h, wort, zeilen, farbe, mono) {
  const c = C();
  const teile = [];
  // Karte mit farbigem Band oben, wie die gedruckten Spielkarten
  teile.push(d.box(x, y, w, h, "", { border: c.light, width: 2, rx: 10 }));
  teile.push(d.box(x, y, w, 64, "", { border: farbe, fill: farbe, rx: 10 }));
  teile.push(d.box(x, y + 40, w, 24, "", { border: farbe, fill: farbe, rounded: false }));
  teile.push(d.label(x + 24, 0, wort, { size: 32, color: c.bg, mono: true, keepCase: true, centerY: y + 32 }));
  // Zeilen linksbuendig an einer gemeinsamen Kante, mit Abstand zum Rand
  zeilen.forEach((z, i) => teile.push(d.label(x + 24, 0, z, { size: 32, color: c.white, mono: !!mono, keepCase: !!mono, centerY: y + 120 + i * 48 })));
  return teile;
}

function figCards(step) {
  // Folge aus Aufgabe 1: erst nachsehen, welche Dateien es gibt (die Namen stehen nicht
  // auf der Systemkarte), dann ... (read_file und sein Ergebnis), dann die Antwort.
  // Breiten: 4 × 360 + 2 × 40 + 160 (Luecke mit "…") = 1680. Laengste Zeile
  // "stock, weather": 14 × 32 × 0,6 = 269 < 360 - 2 × 24.
  const c = C();
  const W = 1680, H = 330, w = 360, h = 300, gap = 40, luecke = 160, y = 10;
  const parts = [];
  const xs = [0, w + gap, 2 * (w + gap), 3 * w + 2 * gap + luecke];
  parts.push(...karte(xs[0], y, w, h, "THINK:", ["which files", "are there?"], c.blue, false));
  if (step >= 1) parts.push(...karte(xs[1], y, w, h, "TOOL:", ["list_files()"], c.blue, true));
  if (step >= 2) parts.push(...karte(xs[2], y, w, h, "RESULT:", ["fields,", "soil_tests,", "stock, weather"], c.gray, false));
  if (step >= 3) {
    parts.push(d.label(xs[2] + w + luecke / 2, 0, "…", { size: 48, color: c.gray, anchor: "middle", centerY: y + h / 2 }));
    parts.push(...karte(xs[3], y, w, h, "ANSWER:", ["4.5 ha,", "winter wheat"], c.blue, false));
  }
  return d.svg(W, H, ...parts);
}

function showCards(slide, step) { if ($("fig-cards")) $("fig-cards").innerHTML = figCards(step || 0); }
