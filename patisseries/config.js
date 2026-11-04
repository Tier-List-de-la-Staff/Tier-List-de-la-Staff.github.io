// Configuration de la tier list « patisseries ».
window.TIERLIST = {
  id: "patisseries",
  titre: "Tier list des meilleures pâtisseries",
  consigne: "Glissez chaque pâtisserie dans un tier, ou touchez une illustration puis la ligne voulue.",
  mots: { un: "une pâtisserie", ce: "cette pâtisserie", pluriel: "pâtisseries" },
  afficherNoms: true,
  tiers: [
    { id: "meilleure", nom: "La meilleure",                        court: "La meilleure",   couleur: "#ff7f7f", max: 1, note: "1 seule possible" },
    { id: "tresbonne", nom: "Très bonne",                          court: "Très bonne",     couleur: "#ffbf7f" },
    { id: "bonne",     nom: "Bonne",                               court: "Bonne",          couleur: "#ffdf7f" },
    { id: "aucun",     nom: "Aucun plaisir à en manger",           court: "Aucun plaisir",  couleur: "#ffff7f" },
    { id: "pasbonne",  nom: "Pas bonne",                           court: "Pas bonne",      couleur: "#dff2d0" },
    { id: "affame",    nom: "Même affamé, je n'en mange pas",      court: "Même affamé",    couleur: "#bfff7f", max: 1, note: "1 seule possible" }
  ],
  elements: [
    { nom: "Éclair au chocolat", image: "img/eclair-au-chocolat.jpg" },
    { nom: "Paris-Brest", image: "img/paris-brest.jpg" },
    { nom: "Mille-feuille", image: "img/mille-feuille.jpg" },
    { nom: "Tarte au citron meringuée", image: "img/tarte-au-citron-meringuee.jpg" },
    { nom: "Saint-Honoré", image: "img/saint-honore.jpg" },
    { nom: "Opéra", image: "img/opera.jpg" },
    { nom: "Religieuse", image: "img/religieuse.jpg" },
    { nom: "Tarte aux fraises", image: "img/tarte-aux-fraises.jpg" },
    { nom: "Croissant", image: "img/croissant.jpg" },
    { nom: "Pain au chocolat", image: "img/pain-au-chocolat.jpg" },
    { nom: "Chausson aux pommes", image: "img/chausson-aux-pommes.jpg" },
    { nom: "Macaron", image: "img/macaron.jpg" },
    { nom: "Baba au rhum", image: "img/baba-au-rhum.jpg" },
    { nom: "Tarte Tatin", image: "img/tarte-tatin.jpg" },
    { nom: "Chou à la crème", image: "img/chou-a-la-creme.jpg" },
    { nom: "Canelé", image: "img/canele.jpg" },
    { nom: "Flan pâtissier", image: "img/flan-patissier.jpg" },
    { nom: "Kouign-amann", image: "img/kouign-amann.jpg" },
    { nom: "Fraisier", image: "img/fraisier.jpg" },
    { nom: "Forêt-noire", image: "img/foret-noire.jpg" }
  ]
};
