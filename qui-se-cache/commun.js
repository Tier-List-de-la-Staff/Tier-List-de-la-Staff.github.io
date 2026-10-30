// Qui se cache ? : ce qui sert à la fois au jeu et au classement.
window.QSC = (function () {
  const NOMS = window.QSC_NOMS || [];
  const pad = (i) => String(i + 1).padStart(2, "0");
  // Majuscules, accents, trémas et ponctuation ne comptent pas. Le prénom seul suffit.
  const norm = (t) => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  function isCorrect(guess, answer) {
    const g = norm(guess), a = norm(answer);
    if (!g || !a) return false;
    return g === a || g.split(" ")[0] === a.split(" ")[0];
  }
  return {
    JEU: "qui-se-cache", // nom du dossier, sert d'identifiant dans Firebase
    N: NOMS.length,
    NOMS,
    ghost: (i) => `ghosts/${pad(i)}.jpg`,
    photo: (i) => `photos/${pad(i)}.jpg`,
    isCorrect
  };
})();
