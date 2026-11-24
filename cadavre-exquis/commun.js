// Cadavre exquis : ce qui sert à la fois au jeu et au classement.
window.CE = (function () {
  const NOMS = window.CE_NOMS || [];
  const pad = (i) => String(i + 1).padStart(2, "0");
  // Chaque visage (visages/XX.jpg, 360 x 400 px) est découpé en 4 bandes de hauteur fixe.
  // y = haut de la bande, h = sa hauteur, en pixels de l'image.
  const PARTIES = [
    { nom: "Front", y: 0, h: 120 },
    { nom: "Yeux", y: 120, h: 88 },
    { nom: "Nez", y: 208, h: 68 },
    { nom: "Bouche", y: 276, h: 124 }
  ];
  const HAUT = 400;
  // Les 7 visages recomposés, identiques pour tout le monde : numéro du collègue (1 à 21)
  // pour le front, les yeux, le nez et la bouche. Chacun des 21 apparaît au moins une fois.
  const MONSTRES = [
    [11, 6, 12, 8], [20, 19, 8, 7], [20, 2, 17, 5], [17, 4, 13, 11],
    [7, 21, 18, 14], [9, 21, 15, 3], [15, 1, 16, 10]
  ].map(m => m.map(n => n - 1));
  // Majuscules, accents, trémas et ponctuation ne comptent pas.
  const norm = (t) => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const isCorrect = (guess, answer) => !!norm(guess) && norm(guess) === norm(answer);

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
    ids.forEach((id, k) => { el.children[k].firstChild.src = `visages/${pad(id)}.jpg`; });
    return el;
  }
  return { JEU: "cadavre-exquis", NOMS, PARTIES, MONSTRES, N: MONSTRES.length * 4, isCorrect, visage,
    cle: (f, k) => String(f * 4 + k + 1) };
})();
