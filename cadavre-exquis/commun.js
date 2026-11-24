// Cadavre exquis : la découpe des visages.
window.CE = (function () {
  const NOMS = window.CE_NOMS || [];
  const pad = (i) => String(i + 1).padStart(2, "0");
  // Chaque visage (visages/XX.jpg, 360 x 400 px, calé sur un visage moyen : même place pour les yeux, le nez et la bouche) est découpé en 4 bandes de hauteur fixe.
  // y = haut de la bande, h = sa hauteur, en pixels de l'image.
  const PARTIES = [
    { nom: "Front", y: 0, h: 108 },
    { nom: "Yeux", y: 108, h: 88 },
    { nom: "Nez", y: 196, h: 62 },
    { nom: "Bouche", y: 258, h: 142 }
  ];
  const LARGE = 360, HAUT = 400;
  const src = (id) => `visages/${pad(id)}.jpg`;

  // Construit un visage dans `el` : pour chaque bande, le numéro (0 à 20) du collègue.
  function visage(el, ids) {
    el.classList.add("face");
    if (!el.children.length) {
      PARTIES.forEach((p, k) => {
        const b = document.createElement("div");
        b.className = "band"; b.dataset.k = k;
        b.style.height = (100 * p.h / HAUT) + "%";
        const img = document.createElement("img");
        img.alt = ""; img.draggable = false;
        img.style.top = (-100 * p.y / p.h) + "%";
        img.style.height = (100 * HAUT / p.h) + "%";
        b.appendChild(img); el.appendChild(b);
      });
    }
    ids.forEach((id, k) => { const img = el.children[k].firstChild; if (img.dataset.id !== String(id)) { img.src = src(id); img.dataset.id = id; } });
    return el;
  }

  // Le nom du monstre : un morceau du prénom de chacun (début, milieu, milieu, fin).
  function surnom(ids) {
    if (ids.every(id => id === ids[0])) return NOMS[ids[0]];
    const n = ids.map(id => NOMS[id].toLowerCase());
    const mid = (s, len) => s.slice(Math.max(0, Math.floor((s.length - len) / 2)), Math.max(0, Math.floor((s.length - len) / 2)) + len);
    const w = n[0].slice(0, 3) + mid(n[1], 2) + mid(n[2], 2) + n[3].slice(-3);
    return w.charAt(0).toUpperCase() + w.slice(1);
  }
  return { NOMS, PARTIES, LARGE, HAUT, src, visage, surnom };
})();
