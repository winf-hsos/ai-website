/* Zeichnungen des Decks "A Brief History of AI — built live with an agent".
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer die volle Geometrie, nur die Farben
 * wechseln; so wandert zwischen zwei Schritten nichts.
 *
 * Seit dem 2026-09-23 benutzt das Deck keine dieser Zeichnungen mehr: Die
 * Erklaerfolien (Schleife, chatbot vs. agent, Token, Training, Regeln vs.
 * Lernen, Repraesentation, Subagenten) sind auf Nicolas' Wunsch entfallen,
 * die Themen stehen nur noch als Fragen am Ende. Die Funktionen bleiben als
 * Vorrat fuer die spaeteren Sitzungen; ohne passende .figure zeichnen sie nichts.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

/* ------------------------------------------------------------------ */
/* chatbot vs. agent                                                    */
/* ------------------------------------------------------------------ */
function figChatbotAgent() {
  const c = C();
  const wires = [], boxes = [], labels = [];

  // links: der Chatbot. Die Schleife laeuft ueber den Menschen.
  labels.push(d.label(410, 0, "chatbot", { size: 48, color: c.white, anchor: "middle", centerY: 90 }));
  const ly = 220, lh = 110, lw = 200;
  [[40, "you"], [310, "model"], [580, "text"]].forEach(([x, t], i) => {
    boxes.push(d.box(x, ly, lw, lh, t, { border: i === 1 ? c.blue : c.light, color: c.white }));
  });
  wires.push(d.arrow(240, ly + lh / 2, 306, ly + lh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(510, ly + lh / 2, 576, ly + lh / 2, { color: c.gray, width: 3 }));
  // Rueckweg: text -> you, unten herum
  wires.push(d.line(680, ly + lh, 680, 430, { color: c.yellow, width: 3 }));
  wires.push(d.line(680, 430, 140, 430, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(140, 430, 140, ly + lh + 4, { color: c.yellow, width: 3 }));
  labels.push(d.label(410, 0, "you carry code, errors\nand files back and forth", { size: 32, color: c.yellow, anchor: "middle", centerY: 520 }));

  // rechts: der Agent. Die Schleife laeuft ohne den Menschen:
  // Modell -> act -> Werkzeuge -> observe -> Modell, bis die Aufgabe erledigt ist.
  labels.push(d.label(1270, 0, "agent", { size: 48, color: c.white, anchor: "middle", centerY: 90 }));
  const mx = 1170, my = 170, mw = 200, mh = 110;
  boxes.push(d.box(mx, my, mw, mh, "model", { border: c.blue, color: c.white }));
  // Kreislauf-Symbol rechts neben dem Modell: Bootstrap Icons "arrow-repeat" (MIT, (c) The Bootstrap Authors)
  labels.push(`<svg x="${mx + mw + 24}" y="${my + mh / 2 - 36}" width="72" height="72" viewBox="0 0 16 16" fill="${c.yellow}">` +
    `<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>` +
    `<path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/></svg>`);
  // GitHub bewusst nicht dabei: das Veroeffentlichen ist die spaetere Ueberraschung.
  // plan ist ein eigenes Werkzeug: einen Plan anlegen und abhaken.
  const tools = ["plan", "files", "terminal", "browser", "web"];
  // fuenf Kaesten, symmetrisch um 1270: 5 * 140 + 4 * 16 = 764 breit
  const tw = 140, th = 80, ty = 440, gap = 16, tx0 = 1270 - 382, bus = 380;
  const ax = 1210, ox = 1330;   // act hinunter, observe hinauf
  wires.push(d.line(tx0 + tw / 2, bus, tx0 + 4 * (tw + gap) + tw / 2, bus, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(ax, my + mh, ax, bus - 4, { color: c.yellow, width: 3, head: 18 }));
  wires.push(d.arrow(ox, bus, ox, my + mh + 4, { color: c.yellow, width: 3, head: 18 }));
  tools.forEach((t, i) => {
    const x = tx0 + i * (tw + gap);
    wires.push(d.line(x + tw / 2, bus, x + tw / 2, ty, { color: c.yellow, width: 3 }));
    boxes.push(d.box(x, ty, tw, th, t, { border: c.light, color: c.light }));
  });
  labels.push(d.label(ax - 20, 0, "act", { size: 32, color: c.yellow, anchor: "end", centerY: 330 }));
  labels.push(d.label(ox + 20, 0, "observe", { size: 32, color: c.yellow, centerY: 330 }));
  labels.push(d.label(1270, 0, "a tool in every step —\nloop until the task is done", { size: 32, color: c.yellow, anchor: "middle", centerY: 620 }));

  return d.svg(1680, 680, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* watch: die Schleife des Agenten                                      */
/* ------------------------------------------------------------------ */
function figLoop() {
  const c = C();
  const cx = 840, cy = 360, r = 270;
  const schritte = ["plan", "read", "write", "run", "look", "fix"];
  const n = schritte.length;
  const wires = [], boxes = [], labels = [];
  // Kreis als Leitung hinter den Kaesten
  wires.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.gray}" stroke-width="3"/>`);
  const winkel = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  schritte.forEach((s, i) => {
    const a = winkel(i);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    // plan ist der Einstieg: blau, der Rest hell
    boxes.push(d.box(x - 95, y - 40, 190, 80, s, { border: i === 0 ? c.blue : c.light, color: c.white }));
    // Pfeilspitze auf dem Kreis zwischen diesem und dem naechsten Schritt, im Uhrzeigersinn
    const m = a + Math.PI / n;
    const px = cx + r * Math.cos(m), py = cy + r * Math.sin(m);
    const tx = -Math.sin(m), ty = Math.cos(m);
    wires.push(d.arrow(px - tx * 30, py - ty * 30, px + tx * 6, py + ty * 6, { color: c.gray, width: 3, head: 20 }));
  });
  labels.push(d.label(cx, 0, "repeat until\nit works", { size: 48, color: c.yellow, anchor: "middle", centerY: cy }));
  return d.svg(1680, 720, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* 1 · how does a language model write?                                 */
/* ------------------------------------------------------------------ */
function figTokens() {
  const c = C();
  // Werte zur Veranschaulichung, keine Messung
  const kandidaten = [
    { t: "app", p: 0.62 },
    { t: "page", p: 0.21 },
    { t: "site", p: 0.09 },
  ];
  const wires = [], boxes = [], labels = [];
  const py = 300;
  labels.push(d.label(40, 0, "build an interactive web", { size: 48, color: c.white, mono: true, centerY: py }));
  kandidaten.forEach((k, i) => {
    const y = 140 + i * 160;
    const gewaehlt = i === 0;
    const col = gewaehlt ? c.yellow : c.gray;
    labels.push(d.label(900, 0, k.t, { size: 48, color: col, mono: true, centerY: y }));
    boxes.push(d.box(1060, y - 28, k.p * 800, 56, "", { border: null, fill: col, rx: 4 }));
    labels.push(d.label(1060 + k.p * 800 + 24, 0, Math.round(k.p * 100) + " %", { size: 32, color: col, centerY: y }));
  });
  labels.push(d.label(900, 0, "next token?", { size: 32, color: c.gray, centerY: 40 }));
  labels.push(d.label(900, 0, "…", { size: 48, color: c.dark, mono: true, centerY: 590 }));
  wires.push(d.arrow(760, py, 860, py, { color: c.gray, width: 3 }));
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* 2 · where did it learn that?                                         */
/* ------------------------------------------------------------------ */
function figTraining() {
  const c = C();
  const stufen = [
    { x: 40, y: 400, t: "pre-training", u: "read a huge amount of text,\npredict the next word" },
    { x: 600, y: 250, t: "fine-tuning", u: "learn from examples\nof good answers" },
    { x: 1160, y: 100, t: "human feedback", u: "learn from people\nrating answers" },
  ];
  const w = 480, h = 200;
  const wires = [], boxes = [], labels = [];
  stufen.forEach((s, i) => {
    if (i > 0) {
      const p = stufen[i - 1];
      // Treppe: aus der rechten Kante der vorigen Stufe waagerecht hinueber, dann hinauf in die Unterkante dieser Stufe
      const ax = s.x + 80, ay = p.y + h / 2;
      wires.push(d.line(p.x + w, ay, ax, ay, { color: c.gray, width: 3 }));
      wires.push(d.arrow(ax, ay, ax, s.y + h + 2, { color: c.gray, width: 3 }));
    }
    boxes.push(d.box(s.x, s.y, w, h, "", { border: i === 2 ? c.blue : c.light }));
    // Titel 48 und Unterzeile 2 x 32: sichtbarer Block 48/2 + 12 + 2*32*1.3 ... gleichmaessig verteilt
    labels.push(d.label(s.x + 40, 0, s.t, { size: 48, color: c.white, centerY: s.y + 58 }));
    labels.push(d.label(s.x + 40, 0, s.u, { size: 32, color: c.gray, centerY: s.y + 140 }));
  });
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* 3 · rules vs. learning                                               */
/* ------------------------------------------------------------------ */
function figRulesLearning() {
  const c = C();
  const spalte = (x, titel, zeilen, col, unter) => {
    const teile = [d.box(x, 60, 760, 540, "", { border: col })];
    teile.push(d.label(x + 60, 0, titel, { size: 48, color: col, centerY: 140 }));
    teile.push(d.label(x + 60, 0, unter, { size: 32, color: c.gray, centerY: 200 }));
    zeilen.forEach((z, i) => {
      teile.push(d.label(x + 60, 0, z, { size: 32, color: c.white, centerY: 300 + i * 70 }));
    });
    return teile;
  };
  return d.svg(1680, 660,
    ...spalte(40, "learned", [
      "read the photo of the pinboard",
      "plan the next step",
      "write code and text",
      "decide which tool to use",
    ], c.blue, "the model — flexible, but can be wrong"),
    ...spalte(880, "rules", [
      "save and change files",
      "run the code, open the browser",
      "search the web",
      "calculate, count, sort",
    ], c.white, "the tools — exact, every time"));
}

/* ------------------------------------------------------------------ */
/* 4 · how did it read our handwriting?                                 */
/* ------------------------------------------------------------------ */
function figRepresentation() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const y = 120, h = 340, w = 420;
  // Foto: Kasten mit Kachelraster
  boxes.push(d.box(40, y, w, h, "", { border: c.light }));
  for (let i = 1; i < 4; i++) boxes.push(d.line(40 + i * w / 4, y, 40 + i * w / 4, y + h, { color: c.dark, width: 2 }));
  for (let j = 1; j < 3; j++) boxes.push(d.line(40, y + j * h / 3, 40 + w, y + j * h / 3, { color: c.dark, width: 2 }));
  // eine Kachel ist die aktuelle
  boxes.push(d.box(40 + w / 4, y + h / 3, w / 4, h / 3, "", { border: c.yellow, fill: "none", width: 4, rx: 0 }));
  // Zahlen: Werte zur Veranschaulichung
  boxes.push(d.box(630, y, w, h, "", { border: c.light }));
  const zahlen = ["0.12  -0.87   0.45", "0.91   0.03  -0.33", "-0.24   0.66   0.08", "…"];
  // linksbuendig im Kasten; laengste Zeile 18 Zeichen * 32 * 0.6 = 346
  const zx = 630 + (w - 18 * 32 * 0.6) / 2;
  zahlen.forEach((z, i) => labels.push(d.label(zx, 0, z, { size: 32, color: i === 0 ? c.yellow : c.white, mono: true, centerY: y + 80 + i * 60 })));
  // Text
  boxes.push(d.box(1220, y, w, h, "", { border: c.light }));
  ["“1956 dartmouth”", "“chatgpt 2022”", "“deep blue”"].forEach((t, i) =>
    labels.push(d.label(1260, 0, t, { size: 32, color: c.white, centerY: y + 100 + i * 70 })));
  wires.push(d.arrow(460, y + h / 2, 626, y + h / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(1050, y + h / 2, 1216, y + h / 2, { color: c.gray, width: 3 }));
  labels.push(d.label(250, 0, "photo, cut into patches", { size: 32, color: c.gray, anchor: "middle", centerY: y + h + 60 }));
  labels.push(d.label(840, 0, "each patch → numbers", { size: 32, color: c.gray, anchor: "middle", centerY: y + h + 60 }));
  labels.push(d.label(1430, 0, "numbers → words", { size: 32, color: c.gray, anchor: "middle", centerY: y + h + 60 }));
  return d.svg(1680, 560, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* behind the scenes: sub-agents (Aufbau in drei Schritten)             */
/* Schritt 0: Aufteilen · 1: Quellen pruefen · 2: Zusammenfuehren        */
/* ------------------------------------------------------------------ */
function figSubagents(step) {
  const c = C();
  const on = (n, col) => (step >= n ? col : c.dark);
  const wires = [], boxes = [], labels = [];
  const ox = 690, oy = 20, ow = 300, oh = 100;
  boxes.push(d.box(ox, oy, ow, oh, "orchestrator", { border: c.blue, color: c.white }));
  const teile = ["1943–1989", "1997–2017", "2018–2024", "2025–2026"];
  // je Subagent drei Quellen: Haken = bestaetigt, Kreuz = Fehler gefunden (Beispielmuster)
  const befunde = [[true, true, false], [true, true, true], [true, false, true], [true, true, false]];
  // vier Kaesten, symmetrisch um die Mitte 840: Mitten bei 210, 630, 1050, 1470
  const sw = 340, sh = 190, sy = 210;
  const mitten = [210, 630, 1050, 1470];
  wires.push(d.line(840, oy + oh, 840, 165, { color: c.gray, width: 3 }));
  wires.push(d.line(210, 165, 1470, 165, { color: c.gray, width: 3 }));
  teile.forEach((t, i) => {
    const cx = mitten[i], x = cx - sw / 2;
    wires.push(d.line(cx, 165, cx, sy, { color: c.gray, width: 3 }));
    // Rueckweg zum Ergebnis erst im letzten Schritt
    wires.push(d.line(cx, sy + sh, cx, 470, { color: on(2, c.gray), width: 3 }));
    boxes.push(d.box(x, sy, sw, sh, "", { border: c.light }));
    labels.push(d.label(cx, 0, "sub-agent\n" + t, { size: 32, color: c.white, anchor: "middle", centerY: sy + 62 }));
    befunde[i].forEach((ok, k) => {
      const mx = cx - 80 + k * 80;
      boxes.push(step >= 1 ? d.mark(mx, sy + 148, ok) : d.mark(mx, sy + 148, ok, { color: c.dark }));
    });
  });
  wires.push(d.line(210, 470, 1470, 470, { color: on(2, c.gray), width: 3 }));
  wires.push(d.arrow(840, 470, 840, 536, { color: on(2, c.gray), width: 3 }));
  boxes.push(d.box(ox, 540, ow, 90, "milestones.md", { border: on(2, c.yellow), color: on(2, c.yellow), mono: true, keepCase: true }));
  labels.push(d.label(840, 0, "4 agents in parallel · every source opened · 8 errors in the previous group's list found",
    { size: 32, color: on(2, c.light), anchor: "middle", centerY: 690 }));
  return d.svg(1680, 730, ...d.layers(wires, boxes, labels));
}

window.drawSubagents = (slide, step) => {
  if ($("fig-subagents")) $("fig-subagents").innerHTML = figSubagents(step || 0);
};

/* ------------------------------------------------------------------ */
/* Statische Zeichnungen einmal schreiben                               */
/* ------------------------------------------------------------------ */
if ($("fig-loop")) $("fig-loop").innerHTML = figLoop();
if ($("fig-chatbot-agent")) $("fig-chatbot-agent").innerHTML = figChatbotAgent();
if ($("fig-tokens")) $("fig-tokens").innerHTML = figTokens();
if ($("fig-training")) $("fig-training").innerHTML = figTraining();
if ($("fig-rules-learning")) $("fig-rules-learning").innerHTML = figRulesLearning();
if ($("fig-representation")) $("fig-representation").innerHTML = figRepresentation();
if ($("fig-subagents")) $("fig-subagents").innerHTML = figSubagents(0);
