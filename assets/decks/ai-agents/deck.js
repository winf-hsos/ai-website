/* Zeichnungen des Decks "AI Agents" (bis 01.10.2026 "What Is an AI Agent?") (Sitzung 2, WS 2026/27).
 *
 * Erlaubte Schriftgroessen: 20, 32, 48, 80. Keine anderen Werte.
 * Leitungen zuerst, dann Kaesten, dann Beschriftungen (d.layers).
 * Folien mit Aufbau zeichnen immer die volle Geometrie; was noch nicht
 * sichtbar sein soll, wird weggelassen, nie verschoben. So wandert nichts.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();

// Bootstrap Icons 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_ARROW_REPEAT = '<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>';
const ICON_FOLDER2_OPEN = '<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>';
const ICON_CLOUD = '<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>';
const ICON_LAPTOP = '<path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>';

/* ------------------------------------------------------------------ */
/* chatbot vs. agent (Folie mit einem Schritt)                          */
/* ------------------------------------------------------------------ */
function figChatAgent(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const bw = 220, bh = 100;

  // oben: der Chatbot. Nach der Antwort ist der Mensch wieder dran.
  const y1 = 40;
  labels.push(d.label(0, 0, "chatbot", { size: 48, color: c.white, centerY: y1 + bh / 2 }));
  const xs1 = [360, 760, 1160];
  ["you", "LLM", "answer"].forEach((t, i) => {
    boxes.push(d.box(xs1[i], y1, bw, bh, t, { border: i === 1 ? c.blue : c.light, color: c.white, keepCase: i === 1 }));
  });
  labels.push(d.label(670, 0, "prompt", { size: 20, color: c.gray, anchor: "middle", centerY: y1 + bh / 2 - 26 }));
  wires.push(d.arrow(xs1[0] + bw, y1 + bh / 2, xs1[1] - 4, y1 + bh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[1] + bw, y1 + bh / 2, xs1[2] - 4, y1 + bh / 2, { color: c.gray, width: 3 }));
  // Rueckweg answer -> you, unten herum: der Mensch traegt den naechsten Schritt
  const ry = y1 + bh + 50;
  wires.push(d.line(xs1[2] + bw / 2, y1 + bh, xs1[2] + bw / 2, ry, { color: c.gray, width: 3 }));
  wires.push(d.line(xs1[2] + bw / 2, ry, xs1[0] + bw / 2, ry, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[0] + bw / 2, ry, xs1[0] + bw / 2, y1 + bh + 4, { color: c.gray, width: 3 }));
  labels.push(d.label(870, 0, "you take the next step", { size: 32, color: c.gray, anchor: "middle", centerY: ry + 32 }));

  if (step < 1) return d.svg(1680, 640, ...d.layers(wires, boxes, labels));

  // unten: der Agent. Die Schleife laeuft zwischen Modell und Werkzeugen.
  const y2 = 400;
  labels.push(d.label(0, 0, "agent", { size: 48, color: c.white, centerY: y2 + bh / 2 }));
  const xs2 = [360, 760, 1160, 1460];
  boxes.push(d.box(xs2[0], y2, bw, bh, "you", { border: c.light, color: c.white }));
  boxes.push(d.box(xs2[1], y2, bw, bh, "LLM", { border: c.blue, color: c.white, keepCase: true }));
  boxes.push(d.box(xs2[2], y2, bw, bh, "tools", { border: c.yellow, color: c.white }));
  labels.push(d.label(670, 0, "goal", { size: 20, color: c.gray, anchor: "middle", centerY: y2 + bh / 2 - 26 }));
  wires.push(d.arrow(xs2[0] + bw, y2 + bh / 2, xs2[1] - 4, y2 + bh / 2, { color: c.gray, width: 3 }));
  // Schleife LLM <-> tools, gelb
  wires.push(d.arrow(xs2[1] + bw, y2 + 30, xs2[2] - 4, y2 + 30, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(xs2[2], y2 + 70, xs2[1] + bw + 4, y2 + 70, { color: c.yellow, width: 3 }));
  labels.push(d.icon(1034, y2 + bh + 16, 64, ICON_ARROW_REPEAT, { color: c.yellow }));
  labels.push(d.label(1066, 0, "until the goal is reached", { size: 32, color: c.yellow, anchor: "middle", centerY: y2 + bh + 124 }));
  // Ergebnis: nur ein Pfeil hinaus, als Text statt Kasten (sonst reicht die Breite nicht)
  wires.push(d.arrow(xs2[2] + bw, y2 + bh / 2, xs2[3] + 20, y2 + bh / 2, { color: c.gray, width: 3 }));
  labels.push(d.label(xs2[3] + 36, 0, "result", { size: 32, color: c.white, centerY: y2 + bh / 2 }));
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}

function showChatAgent(slide, step) { if ($("fig-chat-agent")) $("fig-chat-agent").innerHTML = figChatAgent(step || 0); }

/* ------------------------------------------------------------------ */
/* inside an agent: eine Zeichnung, acht Stufen                         */
/*   0 goal + LLM · 1 tools · 2 loop · 3 context · 4 plan · 5 skills   */
/*   6 sub-agents · 7 alles (grau, nur die Schleife gelb)               */
/* Jede Stufe zeichnet alles Bisherige an derselben Stelle; das Neue    */
/* ist hell, das Bekannte grau. Plan und Skills liegen auf einer Folie  */
/* in zwei Schritten (Stufe 4 + Schritt).                               */
/* ------------------------------------------------------------------ */
function figAnatomy(stage) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const alles = stage >= 7;
  // Farbe eines Elements, das in Stufe s dazukommt
  const col = (s) => (alles ? c.gray : s === stage ? c.white : c.gray);
  const rand = (s) => (alles ? c.dark : s === stage ? c.blue : c.dark);

  // LLM in der Mitte
  const L = { x: 660, y: 190, w: 320, h: 140 };
  // Ziel oben
  labels.push(d.label(L.x + L.w / 2, 0, "goal: “build a knowledge base on the history of AI”",
    { size: 32, color: col(0), anchor: "middle", centerY: 40, keepCase: true }));
  wires.push(d.arrow(L.x + L.w / 2, 70, L.x + L.w / 2, L.y - 4, { color: c.gray, width: 3 }));
  boxes.push(d.box(L.x, L.y, L.w, L.h, "LLM", { border: rand(0), color: col(0), size: 48, keepCase: true, width: 3 }));

  // 1 Werkzeuge rechts, dazu die Dateien
  if (stage >= 1) {
    const tools = ["read", "write", "edit", "bash", "web search", "web fetch"];
    const tx = 1210, tw = 250, th = 64, tg = 18, ty = 110;
    const bus = 1160;
    wires.push(d.line(bus, ty + th / 2, bus, ty + 5 * (th + tg) + th / 2, { color: c.gray, width: 3 }));
    tools.forEach((t, i) => {
      const y = ty + i * (th + tg);
      wires.push(d.line(bus, y + th / 2, tx, y + th / 2, { color: c.gray, width: 3 }));
      boxes.push(d.box(tx, y, tw, th, t, { border: rand(1), color: col(1), mono: true }));
    });
    wires.push(d.arrow(L.x + L.w, 235, bus - 4, 235, { color: stage === 2 || alles ? c.yellow : c.gray, width: 3 }));
    labels.push(d.label(1070, 0, "calls", { size: 20, color: col(1), anchor: "middle", centerY: 212 }));
    labels.push(d.icon(1520, 280, 110, ICON_FOLDER2_OPEN, { color: col(1) }));
    labels.push(d.label(1575, 0, "your files", { size: 32, color: col(1), anchor: "middle", centerY: 430 }));
  }

  // 2 die Schleife: Ergebnisse gehen zurueck ins Modell
  if (stage >= 2) {
    const loopCol = stage === 2 || alles ? c.yellow : c.gray;
    wires.push(d.arrow(1160, 290, L.x + L.w + 4, 290, { color: loopCol, width: 3 }));
    labels.push(d.label(1070, 0, "results", { size: 20, color: loopCol, anchor: "middle", centerY: 313 }));
    labels.push(d.icon(1030, 340, 80, ICON_ARROW_REPEAT, { color: loopCol }));
    labels.push(d.label(L.x + L.w / 2, 0, "think → act → observe", { size: 32, color: loopCol, anchor: "middle", centerY: 385 }));
  }

  // 3 Kontextfenster unter dem Modell, Fuellstand wie in Sitzung 1
  if (stage >= 3) {
    const K = { x: 660, y: 450, w: 320, h: 180 };
    boxes.push(d.box(K.x, K.y, K.w, K.h, "", { border: rand(3) }));
    labels.push(d.label(K.x + K.w / 2, 0, "context window", { size: 32, color: col(3), anchor: "middle", centerY: K.y + 45 }));
    boxes.push(d.box(K.x + 30, K.y + 85, K.w - 60, 36, "", { border: c.gray, rx: 4 }));
    boxes.push(d.box(K.x + 30, K.y + 85, (K.w - 60) * 0.14, 36, "", { border: null, fill: stage === 3 ? c.yellow : c.gray, rx: 4 }));
    labels.push(d.label(K.x + K.w / 2, 0, "14 % of 1M tokens", { size: 20, color: col(3), anchor: "middle", centerY: K.y + 150, keepCase: true }));
  }

  // 4 Plan links oben, weit links, damit Pfeil und Beschriftung Platz haben
  if (stage >= 4) {
    const P = { x: 20, y: 90, w: 400, h: 200 };
    boxes.push(d.box(P.x, P.y, P.w, P.h, "", { border: rand(4) }));
    labels.push(d.label(P.x + 30, 0, "plan", { size: 32, color: col(4), centerY: P.y + 40 }));
    ["☑ read the inputs", "☐ research sources", "☐ write the knowledge base"].forEach((t, i) => {
      labels.push(d.label(P.x + 30, 0, t, { size: 20, color: col(4), centerY: P.y + 90 + i * 36 }));
    });
    wires.push(d.arrow(L.x, 220, P.x + P.w + 4, 220, { color: c.gray, width: 3 }));
    labels.push(d.label(540, 0, "writes", { size: 20, color: col(4), anchor: "middle", centerY: 197 }));
  }

  // 5 Anweisungen in Textdateien, darunter
  if (stage >= 5) {
    const S = { x: 20, y: 320, w: 400, h: 90 };
    boxes.push(d.box(S.x, S.y, S.w, S.h, "skills · agents.md", { border: rand(5), color: col(5), mono: true }));
    wires.push(d.arrow(S.x + S.w, 365, L.x - 4, 300, { color: c.gray, width: 3 }));
    labels.push(d.label(540, 0, "loads", { size: 20, color: col(5), anchor: "middle", centerY: 362 }));
  }

  // 6 Subagenten links unten: acht kleine Kopien mit je eigenem Kontext
  if (stage >= 6) {
    const U = { x: 0, y: 470, w: 580, h: 200 };
    labels.push(d.label(U.x + U.w, 0, "8 sub-agents, each with its own context", { size: 20, color: col(6), anchor: "end", centerY: U.y - 4 }));
    for (let i = 0; i < 8; i++) {
      const x = U.x + 40 + (i % 4) * 135, y = U.y + 30 + Math.floor(i / 4) * 85;
      boxes.push(d.box(x, y, 115, 64, "LLM", { border: rand(6), color: col(6), size: 20, keepCase: true }));
    }
    wires.push(d.arrow(L.x, 320, U.x + U.w + 4, 540, { color: c.gray, width: 3 }));
    labels.push(d.label(600, 0, "task", { size: 20, color: col(6), anchor: "end", centerY: 430, mono: true }));
  }

  return d.svg(1680, 680, ...d.layers(wires, boxes, labels));
}

// Stufe aus data-stage plus Aufbauschritt; die Zeile "what we saw" wechselt
// mit, wenn die Folie eine zweite Fassung in data-saw1 traegt.
function showAnatomy(slide, step) {
  const el = slide.querySelector(".figure[data-stage]");
  if (el) el.innerHTML = figAnatomy(+el.dataset.stage + (step || 0));
  const saw = slide.querySelector(".saw[data-saw1]");
  if (saw) {
    if (!saw.dataset.saw0) saw.dataset.saw0 = saw.innerHTML;
    saw.innerHTML = step ? saw.dataset.saw1 : saw.dataset.saw0;
  }
}

/* ------------------------------------------------------------------ */
/* the harness: alles ausser dem Modell                                 */
/* ------------------------------------------------------------------ */
function figHarness() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // Gleichung oben
  labels.push(d.label(840, 0, "AI agent  =  LLM  +  harness", { size: 48, color: c.white, anchor: "middle", centerY: 40, keepCase: true }));
  // links der Harness als grosser Kasten mit seinen Aufgaben
  const H = { x: 80, y: 130, w: 900, h: 440 };
  boxes.push(d.box(H.x, H.y, H.w, H.h, "", { border: c.yellow, width: 3 }));
  labels.push(d.label(H.x + 40, 0, "harness", { size: 48, color: c.yellow, centerY: H.y + 60 }));
  labels.push(d.label(H.x + H.w - 40, 0, "e.g. Claude Code, Codex, OpenCode", { size: 20, color: c.gray, anchor: "end", centerY: H.y + 60, keepCase: true }));
  ["runs the loop", "carries out the tool calls", "manages the context window", "loads plans, skills and agents.md", "asks you for permission"].forEach((t, i) => {
    labels.push(d.label(H.x + 40, 0, t, { size: 32, color: c.light, centerY: H.y + 140 + i * 60 }));
  });
  // rechts das Modell
  const M = { x: 1260, y: 280, w: 340, h: 140 };
  boxes.push(d.box(M.x, M.y, M.w, M.h, "LLM", { border: c.blue, color: c.white, size: 48, keepCase: true, width: 3 }));
  labels.push(d.label(M.x + M.w / 2, 0, "only turns text into text", { size: 20, color: c.gray, anchor: "middle", centerY: M.y + M.h + 36 }));
  wires.push(d.arrow(H.x + H.w, 320, M.x - 4, 320, { color: c.gray, width: 3 }));
  wires.push(d.arrow(M.x, 380, H.x + H.w + 4, 380, { color: c.gray, width: 3 }));
  labels.push(d.label((H.x + H.w + M.x) / 2, 0, "prompt", { size: 20, color: c.gray, anchor: "middle", centerY: 296 }));
  labels.push(d.label((H.x + H.w + M.x) / 2, 0, "tool call or answer", { size: 20, color: c.gray, anchor: "middle", centerY: 404 }));
  return d.svg(1680, 620, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* workflow or agent? mit je einem Beispiel aus den Fachgebieten        */
/* ------------------------------------------------------------------ */
function figWorkflow() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // links: fester Pfad aus drei Schritten
  labels.push(d.label(380, 0, "workflow", { size: 48, color: c.white, anchor: "middle", centerY: 40 }));
  [0, 1, 2].forEach((i) => {
    const y = 110 + i * 110;
    boxes.push(d.box(230, y, 300, 76, "step " + (i + 1), { border: c.light, color: c.white }));
    if (i) wires.push(d.arrow(380, y - 34, 380, y - 4, { color: c.gray, width: 3 }));
  });
  labels.push(d.label(380, 0, "predefined steps, written by people", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }));

  // rechts: die Schleife
  labels.push(d.label(1250, 0, "agent", { size: 48, color: c.white, anchor: "middle", centerY: 40 }));
  boxes.push(d.box(1000, 200, 220, 100, "LLM", { border: c.blue, color: c.white, keepCase: true }));
  boxes.push(d.box(1300, 200, 220, 100, "tools", { border: c.yellow, color: c.white }));
  wires.push(d.arrow(1220, 230, 1296, 230, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(1300, 270, 1224, 270, { color: c.yellow, width: 3 }));
  labels.push(d.icon(1218, 320, 64, ICON_ARROW_REPEAT, { color: c.yellow }));
  labels.push(d.label(1250, 0, "the model decides the next step", { size: 32, color: c.gray, anchor: "middle", centerY: 470 }));

  // Beispiele aus demselben Geschaeftsbereich (Einkauf), damit der Unterschied
  // an der Aufgabe liegt, nicht am Thema. Auch der Workflow nutzt ein LLM.
  const bsp = [
    { x: 30, t: "each supplier invoice: an LLM reads it\n→ match with the purchase order\n→ book it or flag it", ok: "same steps for every invoice" },
    { x: 900, t: "“our main supplier raised prices by 12 %.\nfind alternatives, compare their offers\nand draft a recommendation.”", ok: "nobody knows the steps in advance" },
  ];
  bsp.forEach((b) => {
    boxes.push(d.box(b.x, 530, 750, 200, "", { border: c.dark }));
    labels.push(d.label(b.x + 30, 0, "example", { size: 20, color: c.gray, centerY: 562 }));
    labels.push(d.label(b.x + 720, 0, b.ok, { size: 20, color: c.yellow, anchor: "end", centerY: 562 }));
    labels.push(d.label(b.x + 30, 0, b.t, { size: 32, color: c.white, centerY: 650, keepCase: true }));   // Text klein geschrieben, nur "LLM" gross
  });
  return d.svg(1680, 750, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* models and apps: zwei Spalten, gleiches Raster, Oberkanten buendig   */
/* Modelle Stand 2026-09-30 (recherchiert), je Anbieter ein Spitzen-   */
/* Mittelklassemodell; bei den offenen je das aktuellste.               */
/* ------------------------------------------------------------------ */
function figLandscape() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const bh = 54, step = 64;
  const M = { x: 0, w: 740 }, A = { x: 1240, w: 420 };
  const g1 = 120, b1 = 150, g2 = b1 + 3 * step + 36, b2 = g2 + 30;
  const vw = 140;                      // Spalte fuer den Anbieter
  const bw2 = (M.w - vw - 20) / 2;     // zwei Kaesten je Anbieter
  // Spalte links: Modelle
  labels.push(d.label(M.x + M.w / 2, 0, "models", { size: 48, color: c.white, anchor: "middle", centerY: 40 }));
  labels.push(d.label(M.x, 0, "companies", { size: 20, color: c.gray, centerY: g1 }));
  labels.push(d.label(M.x + vw + bw2 / 2, 0, "top", { size: 20, color: c.gray, anchor: "middle", centerY: g1 }));
  labels.push(d.label(M.x + vw + 20 + bw2 * 1.5, 0, "mid-range", { size: 20, color: c.gray, anchor: "middle", centerY: g1 }));
  [["OpenAI", "GPT-6.1 Sol", "GPT-6 Luna"], ["Anthropic", "Fable 5.1", "Sonnet 5.5"], ["Google", "Gemini 3.1 Pro", "Gemini 3.6 Flash"]].forEach(([v, top, mid], i) => {
    const y = b1 + i * step;
    labels.push(d.label(M.x, 0, v, { size: 20, color: c.gray, centerY: y + bh / 2, keepCase: true }));
    boxes.push(d.box(M.x + vw, y, bw2, bh, top, { border: c.dark, color: c.light, keepCase: true }));
    boxes.push(d.box(M.x + vw + 20 + bw2, y, bw2, bh, mid, { border: c.dark, color: c.light, keepCase: true }));
  });
  labels.push(d.label(M.x, 0, "open models", { size: 20, color: c.gray, centerY: g2 }));
  [["DeepSeek", "DeepSeek V4.1"], ["Alibaba", "Qwen 3.8"], ["Meta", "Llama 4"], ["Mistral", "Mistral Large 3"], ["Google", "Gemma 4"]].forEach(([v, m], i) => {
    const y = b2 + i * step;
    labels.push(d.label(M.x, 0, v, { size: 20, color: c.gray, centerY: y + bh / 2, keepCase: true }));
    boxes.push(d.box(M.x + vw, y, M.w - vw, bh, m, { border: c.dark, color: c.light, keepCase: true }));
  });

  // Spalte rechts: Apps, gleiches Raster
  labels.push(d.label(A.x + A.w / 2, 0, "apps", { size: 48, color: c.white, anchor: "middle", centerY: 40 }));
  labels.push(d.label(A.x, 0, "chat apps", { size: 20, color: c.gray, centerY: g1 }));
  ["chatgpt.com", "claude.ai", "gemini.google.com"].forEach((t, i) => {
    boxes.push(d.box(A.x, b1 + i * step, A.w, bh, t, { border: c.dark, color: c.light, mono: true }));
  });
  labels.push(d.label(A.x, 0, "agents", { size: 20, color: c.blue, centerY: g2 }));
  ["Claude Code", "Codex", "Antigravity", "OpenCode", "OpenClaw"].forEach((t, i) => {
    boxes.push(d.box(A.x, b2 + i * step, A.w, bh, t, { border: c.blue, color: c.light, keepCase: true }));
  });

  // schlanker Pfeil: ein hohes, schmales Dreieck ueber die ganze Spaltenhoehe,
  // die Spitze zeigt nach links auf die Modelle
  const top = b1, bot = b2 + 4 * step + bh, mid = (top + bot) / 2;
  const bx = A.x - 60, ax = bx - 90;
  wires.push(`<polygon points="${bx},${top} ${bx},${bot} ${ax},${mid}" fill="${c.gray}"/>`);
  labels.push(d.label((M.x + M.w + ax) / 2, 0, "every app\nruns on a model", { size: 20, color: c.gray, anchor: "middle", centerY: mid }));
  return d.svg(1680, b2 + 5 * step + 10, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* where does it run? (ein Schritt: lokales Modell)                     */
/* ------------------------------------------------------------------ */
function figWhere(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // links: der eigene Rechner
  const R = { x: 60, y: 140, w: 640, h: 400 };
  boxes.push(d.box(R.x, R.y, R.w, R.h, "", { border: c.light, fill: "none" }));
  labels.push(d.icon(R.x + 30, R.y - 110, 90, ICON_LAPTOP, { color: c.gray }));
  labels.push(d.label(R.x + 140, 0, "your computer", { size: 32, color: c.white, centerY: R.y - 62 }));
  boxes.push(d.box(R.x + 50, R.y + 60, 250, 100, "your files", { border: c.dark, color: c.light }));
  boxes.push(d.box(R.x + 340, R.y + 60, 250, 100, "harness", { border: c.yellow, color: c.white }));
  // Beschriftung ueber dem Kasten, damit darunter Platz fuer die Pfeile zum lokalen LLM bleibt
  labels.push(d.label(R.x + 465, 0, "e.g. Claude Code", { size: 20, color: c.gray, anchor: "middle", centerY: R.y + 32, keepCase: true }));
  wires.push(d.line(R.x + 300, R.y + 110, R.x + 340, R.y + 110, { color: c.gray, width: 3 }));
  // Schritt 1: ein Modell auf dem eigenen Rechner, Text hin und zurueck wie zur Cloud
  if (step >= 1) {
    boxes.push(d.box(R.x + 50, R.y + 240, 540, 110, "a local LLM", { border: c.yellow, color: c.yellow, dashed: true, keepCase: true }));
    wires.push(d.arrow(R.x + 430, R.y + 160, R.x + 430, R.y + 236, { color: c.yellow, width: 3 }));
    wires.push(d.arrow(R.x + 500, R.y + 240, R.x + 500, R.y + 164, { color: c.yellow, width: 3 }));
  }

  // rechts: der Server in der Cloud
  const Q = { x: 1080, y: 140, w: 540, h: 400 };
  boxes.push(d.box(Q.x, Q.y, Q.w, Q.h, "", { border: c.dark, fill: "none" }));
  labels.push(d.icon(Q.x + 30, Q.y - 110, 90, ICON_CLOUD, { color: c.gray }));
  labels.push(d.label(Q.x + 140, 0, "cloud server", { size: 32, color: c.white, centerY: Q.y - 62 }));
  boxes.push(d.box(Q.x + 120, Q.y + 60, 300, 100, "LLM", { border: c.blue, color: c.white, keepCase: true, size: 48 }));
  labels.push(d.label(Q.x + Q.w / 2, 0, "huge, rented by the token", { size: 20, color: c.gray, anchor: "middle", centerY: Q.y + 200 }));

  // Text hin und zurueck
  wires.push(d.arrow(R.x + 590, R.y + 90, Q.x + 116, R.y + 90, { color: c.gray, width: 3 }));
  wires.push(d.arrow(Q.x + 120, R.y + 130, R.x + 594, R.y + 130, { color: c.gray, width: 3 }));
  labels.push(d.label(890, 0, "text in, text out", { size: 20, color: c.gray, anchor: "middle", centerY: R.y + 60 }));
  return d.svg(1680, 580, ...d.layers(wires, boxes, labels));
}

function showWhere(slide, step) { if ($("fig-where")) $("fig-where").innerHTML = figWhere(step || 0); }

/* ------------------------------------------------------------------ */
/* why now? METR time horizons, lineare Achse in Stunden, Balken einzeln */
/* Werte: 50%-Zeithorizont (Softwareaufgaben, gemessen an der Zeit, die */
/* ein Mensch braucht). Claude 3.7 Sonnet ~50 min (METR, arXiv          */
/* 2503.14499), GPT-5 3 h 34 min, Claude Mythos >= 16 h (METR, laut    */
/* Wikipedia "METR", abgerufen 2026-09-30). 960 / 50 = 19,2 in 14       */
/* Monaten (Feb 2025 bis Apr 2026), wegen ">= 16 h" als "at least".     */
/* ------------------------------------------------------------------ */
function figMetr(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // lineare Achse in Stunden (0 bis 16 h), damit die Laengen verhaeltnisgleich sind
  const x0 = 520, x1 = 1400, hmax = 16;
  const X = (min) => x0 + (min / 60) / hmax * (x1 - x0);
  const rows = [
    { t: "Feb 2025 · Claude 3.7 Sonnet", v: 50, s: "about 50 min" },
    { t: "Aug 2025 · GPT-5", v: 214, s: "about 3.5 h" },
    { t: "Apr 2026 · Claude Mythos", v: 960, s: "16 h or more" },
  ];
  labels.push(d.label(0, 0, "length of tasks a model finishes on its own in half of the cases,\nmeasured by how long they take a human", { size: 32, color: c.gray, centerY: 40 }));
  const ay = 510;
  wires.push(d.line(x0, ay, x1, ay, { color: c.gray, width: 2 }));
  [0, 4, 8, 12, 16].forEach((h) => {
    wires.push(d.line(X(h * 60), ay, X(h * 60), ay + 14, { color: c.gray, width: 2 }));
    labels.push(d.label(X(h * 60), 0, h + " h", { size: 20, color: c.gray, anchor: "middle", centerY: ay + 40 }));
  });
  rows.forEach((r, i) => {
    const y = 170 + i * 110;
    const last = i === rows.length - 1;
    // Beschriftung links steht immer, der Balken kommt mit seinem Schritt
    labels.push(d.label(x0 - 30, 0, r.t, { size: 32, color: i <= step ? c.white : c.dark, anchor: "end", centerY: y + 30, keepCase: true }));
    if (i > step) return;
    boxes.push(d.box(x0, y, X(r.v) - x0, 60, "", { border: null, fill: last ? c.yellow : c.light, rx: 4 }));
    labels.push(d.label(X(r.v) + 24, 0, r.s, { size: 32, color: last ? c.yellow : c.light, centerY: y + 30 }));
  });
  if (step >= 3) {
    labels.push(d.label(1680, 0, "at least 19× longer", { size: 48, color: c.yellow, anchor: "end", centerY: 30 }));
    labels.push(d.label(1680, 0, "in 14 months", { size: 32, color: c.yellow, anchor: "end", centerY: 90 }));
  }
  return d.svg(1680, 580, ...d.layers(wires, boxes, labels));
}

function showMetr(slide, step) { if ($("fig-metr")) $("fig-metr").innerHTML = figMetr(step || 0); }

/* ------------------------------------------------------------------ */
/* Start                                                                */
/* ------------------------------------------------------------------ */
if ($("fig-chat-agent")) {
  $("fig-chat-agent").innerHTML = figChatAgent(0);
  document.querySelectorAll(".figure[data-stage]").forEach((el) => { el.innerHTML = figAnatomy(+el.dataset.stage); });
  $("fig-harness").innerHTML = figHarness();
  $("fig-workflow").innerHTML = figWorkflow();
  $("fig-landscape").innerHTML = figLandscape();
  $("fig-where").innerHTML = figWhere(0);
  $("fig-metr").innerHTML = figMetr(0);
}
