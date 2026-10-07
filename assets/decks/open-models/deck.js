/* Zeichnungen des Decks "Open Models" (Experiment "An AI on Your Laptop", 2026-10-07).
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer dieselbe Leinwand; was noch nicht sichtbar
 * sein soll, wird weggelassen, nie verschoben.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

/* ------------------------------------------------------------------ */
/* a file full of numbers: 0 Datei · 1 Zahlen · 2 Parameter            */
/* ------------------------------------------------------------------ */
function figFile(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 1680, H = 620;

  // Datei links: "gemma-3-4b … .gguf" sind 18 Zeichen, 18 × 32 × 0,6 = 346 < 520 - 40
  const fx = 40, fy = 160, fw = 520, fh = 200;
  boxes.push(d.box(fx, fy, fw, fh, "gemma-3-4b … .gguf", { border: c.blue, size: 32, mono: true, width: 4 }));
  labels.push(d.label(fx + fw / 2, 0, "2.4 GB", { size: 32, color: c.gray, anchor: "middle", keepCase: true, centerY: fy + fh + 50 }));

  if (step >= 1) {
    wires.push(d.arrow(fx + fw + 20, fy + fh / 2, 740, fy + fh / 2, { color: c.gray, width: 3 }));
    // vier Zeilen Zahlen; SVG schluckt Leerzeichen, deshalb jede Zahl einzeln,
    // rechtsbuendig an vier Spaltenkanten. Laengste Zahl 7 Zeichen: 7 × 32 × 0,6 = 134 < 180 Spaltenabstand
    const zeilen = [
      ["0.0213", "-1.4020", "0.8710", "-0.3361"],
      ["-0.7745", "0.0091", "1.2203", "0.5518"],
      ["0.3302", "-0.0687", "-0.9154", "0.1240"],
      ["-1.1067", "0.4432", "0.0025", "-0.6619"],
    ];
    const kanten = [920, 1100, 1280, 1460];
    zeilen.forEach((z, i) => z.forEach((zahl, j) =>
      labels.push(d.label(kanten[j], 0, zahl, { size: 32, mono: true, color: c.white, anchor: "end", centerY: fy + 10 + i * 60 }))));
    labels.push(d.label(780, 0, "… and so on, about 4 billion times", { size: 32, color: c.gray, centerY: fy + 10 + 4 * 60 }));
  }

  if (step >= 2) {
    labels.push(d.label(W / 2, 0, "4 billion parameters, also called weights", { size: 48, color: c.blue, anchor: "middle", centerY: 570 }));
  }

  return d.svg(W, H, ...d.layers(wires, boxes, labels));
}
function showFile(slide, step) { if ($("fig-file")) $("fig-file").innerHTML = figFile(step || 0); }

/* ------------------------------------------------------------------ */
/* rounding one weight: 0 16 bits · 1 4 bits · 2 drei Werte · 3 1 bit   */
/* Zahlenstrahl von -1 bis +1, erlaubte Werte als Striche, das Gewicht  */
/* 0.8710 als rosa Marke, der gerundete Wert als weisser Punkt.         */
/* ------------------------------------------------------------------ */
function figQuant(step) {
  const c = C();
  const wires = [], marks = [], labels = [];
  const W = 1680, H = 640;
  const x0 = 340, x1 = 1340;                     // -1 bei 340, +1 bei 1340
  const xv = (v) => x0 + (v + 1) / 2 * (x1 - x0);
  const gewicht = 0.871;
  const stufen = (n) => Array.from({ length: n }, (_, k) => -1 + 2 * k / (n - 1));
  const runden = (n) => stufen(n).reduce((a, b) => (Math.abs(b - gewicht) < Math.abs(a - gewicht) ? b : a));
  const zeilen = [
    { name: "16 bits", n: 65536, wert: "0.8710" },
    { name: "4 bits", n: 16, wert: "0.867" },
    { name: "3 values", n: 3, wert: "1" },
    { name: "1 bit", n: 2, wert: "1" },
  ];

  // Achse oben: -1, 0, +1
  [[-1, "−1"], [0, "0"], [1, "+1"]].forEach(([v, s]) =>
    labels.push(d.label(xv(v), 0, s, { size: 32, color: c.gray, anchor: "middle", mono: true, centerY: 40 })));

  zeilen.forEach((z, i) => {
    if (step < i) return;
    const y = 150 + i * 135;
    labels.push(d.label(x0 - 50, 0, z.name, { size: 32, color: c.white, anchor: "end", centerY: y }));
    wires.push(d.line(x0, y, x1, y, { color: c.gray, width: 2 }));
    if (z.n > 64) {
      // zu viele Stufen zum Zeichnen: ein durchgehender Balken steht fuer "fast stufenlos"
      wires.push(d.line(x0, y, x1, y, { color: c.light, width: 8 }));
    } else {
      stufen(z.n).forEach((v) => wires.push(d.line(xv(v), y - 18, xv(v), y + 18, { color: c.light, width: 3 })));
    }
    // das Gewicht (rosa Strich ueber der Linie) und sein gerundeter Wert (weisser Punkt)
    marks.push(d.line(xv(gewicht), y - 44, xv(gewicht), y - 14, { color: c.blue, width: 5 }));
    marks.push(`<circle cx="${xv(z.n > 64 ? gewicht : runden(z.n))}" cy="${y}" r="11" fill="${c.white}" />`);
    // Wert rechts: "0.8710" sind 6 Zeichen, 6 × 32 × 0,6 = 115; 1400 + 115 < 1680
    labels.push(d.label(1400, 0, z.wert, { size: 32, color: c.white, mono: true, centerY: y }));
  });
  labels.push(d.label(xv(gewicht), 0, "0.8710", { size: 20, color: c.blue, anchor: "middle", mono: true, centerY: 92 }));

  return d.svg(W, H, ...d.layers(wires, marks, labels));
}
function showQuant(slide, step) { if ($("fig-quant")) $("fig-quant").innerHTML = figQuant(step || 0); }

/* ------------------------------------------------------------------ */
/* what happens when you press enter: 0 Datei · 1 laden · 2 je Token    */
/* ------------------------------------------------------------------ */
function figInference(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 1680, H = 520;
  const y = 200, h = 140, cy = y + h / 2;
  const datei = { x: 40, w: 360 }, speicher = { x: 560, w: 440 }, token = { x: 1200, w: 420 };

  boxes.push(d.box(datei.x, y, datei.w, h, "model file", { border: c.light, size: 48 }));
  labels.push(d.label(datei.x + datei.w / 2, 0, "on disk", { size: 32, color: c.gray, anchor: "middle", centerY: y + h + 45 }));

  if (step >= 1) {
    wires.push(d.arrow(datei.x + datei.w, cy, speicher.x, cy, { color: c.gray, width: 3 }));
    labels.push(d.label((datei.x + datei.w + speicher.x) / 2, 0, "load once", { size: 32, color: c.gray, anchor: "middle", centerY: y - 50 }));
    boxes.push(d.box(speicher.x, y, speicher.w, h, "memory", { border: c.white, size: 48, width: 3 }));
    labels.push(d.label(speicher.x + speicher.w / 2, 0, "RAM or GPU", { size: 32, color: c.gray, anchor: "middle", keepCase: true, centerY: y + h + 45 }));
  }

  if (step >= 2) {
    wires.push(d.arrow(speicher.x + speicher.w, cy, token.x, cy, { color: c.blue, width: 4 }));
    // "every token: all the numbers" sind 28 Zeichen, 28 × 32 × 0,6 = 538, mittig ueber dem Pfeil (1000–1200), reicht von 831 bis 1369
    labels.push(d.label((speicher.x + speicher.w + token.x) / 2, 0, "every token: all the numbers", { size: 32, color: c.blue, anchor: "middle", centerY: y - 50 }));
    boxes.push(d.box(token.x, y, token.w, h, "next token", { border: c.blue, size: 48, width: 4 }));
    // Rueckweg unter den Kaesten: vom Token zurueck in den Speicher
    const unten = y + h + 110;
    wires.push(d.line(token.x + token.w / 2, y + h, token.x + token.w / 2, unten, { color: c.gray, width: 3, dashed: true }));
    // zurueck in den Speicher rechts neben "RAM or GPU" (Label reicht bis x 876), bei x 940
    const rx = speicher.x + speicher.w - 60;
    wires.push(d.line(token.x + token.w / 2, unten, rx, unten, { color: c.gray, width: 3, dashed: true }));
    wires.push(d.arrow(rx, unten, rx, y + h, { color: c.gray, width: 3 }));
    // "and again for the next one": 26 Zeichen, 26 × 32 × 0,6 = 499, mittig zwischen 940 und 1410
    labels.push(d.label((rx + token.x + token.w / 2) / 2, 0, "and again for the next one", { size: 32, color: c.gray, anchor: "middle", centerY: unten + 40 }));
  }

  return d.svg(W, H, ...d.layers(wires, boxes, labels));
}
function showInference(slide, step) { if ($("fig-inference")) $("fig-inference").innerHTML = figInference(step || 0); }

/* ------------------------------------------------------------------ */
/* how big is big? logarithmische Balken: 0 Laptop · 1 gross · 2 zu     */
/* ------------------------------------------------------------------ */
function figSizes(step) {
  const c = C();
  const parts = [];
  const W = 1680, H = 640;
  const x0 = 460;                                // Balken beginnen hier
  const breite = (mrd) => 60 + Math.log10(mrd) * 300;   // 1 → 60, 1600 → 1021
  const zeilen = [
    { name: "gemma 3 1b", mrd: 1, wert: "1", farbe: c.blue, ab: 0 },
    { name: "gemma 3 4b", mrd: 4, wert: "4", farbe: c.blue, ab: 0 },
    { name: "gemma 3 27b", mrd: 27, wert: "27", farbe: c.light, ab: 1 },
    { name: "deepseek v4 pro", mrd: 1600, wert: "1,600", farbe: c.light, ab: 1 },
  ];
  parts.push(d.label(x0, 0, "billion parameters", { size: 32, color: c.gray, centerY: 30 }));
  zeilen.forEach((z, i) => {
    if (step < z.ab) return;
    const cy = 120 + i * 110;
    parts.push(d.label(x0 - 40, 0, z.name, { size: 32, color: c.white, anchor: "end", centerY: cy }));
    parts.push(d.box(x0, cy - 30, breite(z.mrd), 60, "", { border: z.farbe, fill: z.farbe, rx: 4 }));
    // Wert hinter dem Balken: "1,600" sind 5 Zeichen, 5 × 32 × 0,6 = 96; 460 + 1021 + 20 + 96 = 1597 < 1680
    parts.push(d.label(x0 + breite(z.mrd) + 20, 0, z.wert, { size: 32, color: c.white, mono: true, centerY: cy }));
  });
  if (step >= 2) {
    const cy = 120 + 4 * 110;
    parts.push(d.label(x0 - 40, 0, "gpt, claude, gemini", { size: 32, color: c.white, anchor: "end", centerY: cy }));
    parts.push(d.box(x0, cy - 30, breite(1600), 60, "not published", { border: c.gray, dashed: true, size: 32, color: c.gray, rx: 4 }));
  }
  return d.svg(W, H, ...parts);
}
function showSizes(slide, step) { if ($("fig-sizes")) $("fig-sizes").innerHTML = figSizes(step || 0); }
