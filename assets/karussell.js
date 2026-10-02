// Karussell für die Karten eines Experiments (Nicolas, 2026-10-02: „so eine
// Art Carousel zum Durchklicken“). Aus einem `.kartenkarussell` mit einer oder
// mehreren `.kartengruppe` (Attribut data-titel) wird eine Ansicht mit einer
// Karte, Pfeilen, Zähler und einem Knopf je Gruppe. Ohne JavaScript bleiben
// die Gruppen ein Raster (`.kartengalerie`). Bedienung: Pfeile, Pfeiltasten,
// Wischen; ein Klick auf die Karte öffnet sie groß (Lightbox von Quarto).
(function () {
  function knopf(text, titel, klasse) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = klasse;
    b.textContent = text;
    b.setAttribute("aria-label", titel);
    b.title = titel;
    return b;
  }

  function baue(wurzel) {
    const gruppen = [...wurzel.querySelectorAll(".kartengruppe")];
    const karten = [];
    gruppen.forEach((g, gi) =>
      g.querySelectorAll("img").forEach((img) =>
        karten.push({ el: img.closest("a") || img, gruppe: gi, alt: img.alt || "" })
      )
    );
    if (!karten.length) return;

    const reiter = document.createElement("div");
    reiter.className = "karussell-reiter";
    const reiterKnoepfe = gruppen.map((g, gi) => {
      const b = knopf(g.dataset.titel || "Group " + (gi + 1), "Jump to " + (g.dataset.titel || "group"), "");
      b.addEventListener("click", () => zeige(karten.findIndex((k) => k.gruppe === gi)));
      reiter.appendChild(b);
      return b;
    });

    const buehne = document.createElement("div");
    buehne.className = "karussell-buehne";
    karten.forEach((k) => {
      k.fach = document.createElement("div");
      k.fach.className = "karussell-fach";
      k.fach.appendChild(k.el);
      buehne.appendChild(k.fach);
    });

    const zurueck = knopf("‹", "Previous card", "karussell-pfeil");
    const vor = knopf("›", "Next card", "karussell-pfeil");
    const rahmen = document.createElement("div");
    rahmen.className = "karussell-rahmen";
    rahmen.append(zurueck, buehne, vor);

    const zaehler = document.createElement("div");
    zaehler.className = "karussell-zaehler";
    zaehler.setAttribute("aria-live", "polite");

    wurzel.replaceChildren(reiter, rahmen, zaehler);
    wurzel.classList.add("aktiv");
    wurzel.tabIndex = 0;

    let jetzt = 0;
    function zeige(i) {
      jetzt = Math.max(0, Math.min(karten.length - 1, i));
      karten.forEach((k, j) => k.fach.classList.toggle("sichtbar", j === jetzt));
      reiterKnoepfe.forEach((b, gi) => b.classList.toggle("aktiv", gi === karten[jetzt].gruppe));
      zurueck.disabled = jetzt === 0;
      vor.disabled = jetzt === karten.length - 1;
      zaehler.textContent = karten[jetzt].alt + " · " + (jetzt + 1) + " / " + karten.length;
    }

    zurueck.addEventListener("click", () => zeige(jetzt - 1));
    vor.addEventListener("click", () => zeige(jetzt + 1));
    wurzel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { zeige(jetzt - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { zeige(jetzt + 1); e.preventDefault(); }
    });
    let startX = null;
    buehne.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    buehne.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) zeige(jetzt + (dx < 0 ? 1 : -1));
      startX = null;
    });

    zeige(0);
  }

  function start() {
    document.querySelectorAll(".kartenkarussell").forEach(baue);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
