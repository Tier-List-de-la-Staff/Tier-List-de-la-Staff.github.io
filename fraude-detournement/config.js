// Configuration de la tier list « fraude et détournement de fonds ».
window.TIERLIST = {
  id: "fraude-detournement",
  titre: "Tier list fraude et détournement de fonds",
  consigne: "Glissez chaque protagoniste dans un tier, ou touchez une photo puis la ligne voulue.",
  mots: { un: "un protagoniste", ce: "ce protagoniste", pluriel: "protagonistes" },
  afficherNoms: true,
  tiers: [
    { id: "goat",      nom: "Goat",         court: "Goat",         couleur: "#ff7f7f", max: 1, note: "1 seul possible" },
    { id: "pro",       nom: "Professionnels", court: "Professionnels", couleur: "#ffbf7f" },
    { id: "amateur",   nom: "Amateurs",     court: "Amateurs",     couleur: "#ffdf7f" },
    { id: "petit",     nom: "Petit joueur", court: "Petit joueur", couleur: "#ffff7f" },
    { id: "innocent",  nom: "Innocent",     court: "Innocent",     couleur: "#bfff7f" }
  ],
  elements: [
    { nom: "Bernard Madoff", image: "img/bernard-madoff.jpg" },
    { nom: "Jérôme Cahuzac", image: "img/jerome-cahuzac.jpg" },
    { nom: "Ronaldinho", image: "img/ronaldinho.jpg" },
    { nom: "Marco Mouly", image: "img/marco-mouly.jpg" },
    { nom: "Carlos Ghosn", image: "img/carlos-ghosn.jpg" },
    { nom: "Couple Fillon", image: "img/couple-fillon.jpg" },
    { nom: "Christophe Rocancourt", image: "img/christophe-rocancourt.jpg" },
    { nom: "Claude Guéant", image: "img/claude-gueant.jpg" },
    { nom: "Nicolas Sarkozy", image: "img/nicolas-sarkozy.jpg" },
    { nom: "Patrick Balkany", image: "img/patrick-balkany.jpg" },
    { nom: "Bernard Tapie", image: "img/bernard-tapie.jpg" },
    { nom: "Marine Le Pen", image: "img/marine-le-pen.jpg" },
    { nom: "Sepp Blatter", image: "img/sepp-blatter.jpg" },
    { nom: "Jérôme Kerviel", image: "img/jerome-kerviel.jpg" }
  ]
};
