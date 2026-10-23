// Configuration de la tier list « arrondissements de Paris ».
window.TIERLIST = {
  id: "arrondissements-paris",
  titre: "Tier list des arrondissements de Paris",
  consigne: "Glissez chaque arrondissement dans un tier, ou touchez une vignette puis la ligne voulue.",
  mots: { un: "un arrondissement", ce: "cet arrondissement", pluriel: "arrondissements" },
  // Le numéro est déjà écrit sur l'image : pas besoin d'afficher le nom en plus.
  afficherNoms: false,
  tiers: [
    { id: "meilleur", nom: "Le meilleur",                         court: "Le meilleur",    couleur: "#ff7f7f", max: 1, note: "1 seul possible" },
    { id: "trescool", nom: "Très cool",                           court: "Très cool",      couleur: "#ffbf7f" },
    { id: "cool",     nom: "Cool",                                court: "Cool",           couleur: "#ffdf7f" },
    { id: "aucun",    nom: "Aucun plaisir à y aller",             court: "Aucun plaisir",  couleur: "#ffff7f" },
    { id: "pasfou",   nom: "Pas fou",                             court: "Pas fou",        couleur: "#dff2d0" },
    { id: "mourir",   nom: "Je préfère mourir qu'y mettre un pied", court: "Plutôt mourir", couleur: "#bfff7f", max: 1, note: "1 seul possible" }
  ],
  elements: [
    { nom: "1er", image: "img/01.jpg" },
    { nom: "2e", image: "img/02.jpg" },
    { nom: "3e", image: "img/03.jpg" },
    { nom: "4e", image: "img/04.jpg" },
    { nom: "5e", image: "img/05.jpg" },
    { nom: "6e", image: "img/06.jpg" },
    { nom: "7e", image: "img/07.jpg" },
    { nom: "8e", image: "img/08.jpg" },
    { nom: "9e", image: "img/09.jpg" },
    { nom: "10e", image: "img/10.jpg" },
    { nom: "11e", image: "img/11.jpg" },
    { nom: "12e", image: "img/12.jpg" },
    { nom: "13e", image: "img/13.jpg" },
    { nom: "14e", image: "img/14.jpg" },
    { nom: "15e", image: "img/15.jpg" },
    { nom: "16e", image: "img/16.jpg" },
    { nom: "17e", image: "img/17.jpg" },
    { nom: "18e", image: "img/18.jpg" },
    { nom: "19e", image: "img/19.jpg" },
    { nom: "20e", image: "img/20.jpg" }
  ]
};
