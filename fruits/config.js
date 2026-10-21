// Configuration de la tier list « fruits ».
window.TIERLIST = {
  id: "fruits",
  titre: "Tier list des meilleurs fruits",
  consigne: "Glissez chaque fruit dans un tier, ou touchez une photo puis la ligne voulue.",
  mots: { un: "un fruit", ce: "ce fruit", pluriel: "fruits" },
  afficherNoms: true,
  tiers: [
    { id: "meilleur", nom: "Meilleur fruit",                court: "Meilleur fruit",   couleur: "#ff7f7f", max: 1, note: "1 seul possible" },
    { id: "tresbon",  nom: "Très bon",                      court: "Très bon",         couleur: "#ffbf7f" },
    { id: "bon",      nom: "Bon",                           court: "Bon",              couleur: "#ffdf7f" },
    { id: "aucun",    nom: "Aucun plaisir à en manger",     court: "Aucun plaisir",    couleur: "#ffff7f" },
    { id: "pasbon",   nom: "Pas bon",                       court: "Pas bon",          couleur: "#dff2d0" },
    { id: "affame",   nom: "Même affamé, je n'en mange pas", court: "Même affamé",     couleur: "#bfff7f", max: 1, note: "1 seul possible" }
  ],
  elements: [
    { nom: "Pomme", image: "img/pomme.jpg" },
    { nom: "Banane", image: "img/banane.jpg" },
    { nom: "Orange", image: "img/orange.jpg" },
    { nom: "Fraise", image: "img/fraise.jpg" },
    { nom: "Poire", image: "img/poire.jpg" },
    { nom: "Raisin", image: "img/raisin.jpg" },
    { nom: "Clémentine", image: "img/clementine.jpg" },
    { nom: "Pêche", image: "img/peche.jpg" },
    { nom: "Abricot", image: "img/abricot.jpg" },
    { nom: "Cerise", image: "img/cerise.jpg" },
    { nom: "Ananas", image: "img/ananas.jpg" },
    { nom: "Kiwi", image: "img/kiwi.jpg" },
    { nom: "Melon", image: "img/melon.jpg" },
    { nom: "Pastèque", image: "img/pasteque.jpg" },
    { nom: "Framboise", image: "img/framboise.jpg" },
    { nom: "Mangue", image: "img/mangue.jpg" },
    { nom: "Nectarine", image: "img/nectarine.jpg" },
    { nom: "Pamplemousse", image: "img/pamplemousse.jpg" },
    { nom: "Myrtille", image: "img/myrtille.jpg" },
    { nom: "Mûre", image: "img/mure.jpg" },
    { nom: "Figue", image: "img/figue.jpg" },
    { nom: "Litchi", image: "img/litchi.jpg" },
    { nom: "Noix de coco", image: "img/noix-de-coco.jpg" },
    { nom: "Citron", image: "img/citron.jpg" },
    { nom: "Kaki", image: "img/kaki.jpg" }
  ]
};
