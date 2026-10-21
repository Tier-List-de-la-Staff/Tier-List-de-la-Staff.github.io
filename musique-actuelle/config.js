// Configuration de la tier list « musique actuelle ».
window.TIERLIST = {
  // Identifiant dans la base de données : minuscules, chiffres et tirets, sans "__".
  // Ne plus le changer une fois que des gens ont voté.
  id: "musique-actuelle",

  titre: "Tier list musique française actuelle",
  consigne: "Glissez chaque artiste dans un tier, ou touchez une photo puis la ligne voulue.",

  // Mots utilisés dans les phrases des pages.
  mots: { un: "un artiste", ce: "cet artiste", pluriel: "artistes" },

  // false : seules les photos s'affichent (les noms restent cachés pendant le vote).
  afficherNoms: true,

  // Du meilleur au moins bon. Le premier vaut le plus de points, le dernier vaut 1.
  // id : court et sans espace, ne plus le changer après les premiers votes.
  // court : nom affiché dans le verdict. max : nombre de places limité (facultatif).
  tiers: [
    { id: "goat", nom: "Goat parmi les goat", court: "GOAT",              couleur: "#ff7f7f", max: 1, note: "1 seul possible" },
    { id: "leg",  nom: "Légendes vivantes",   court: "Légendes vivantes", couleur: "#ffbf7f" },
    { id: "reg",  nom: "Régale toujours",     court: "Régale toujours",   couleur: "#ffdf7f" },
    { id: "sur",  nom: "Surcôté",             court: "Surcôté",           couleur: "#ffff7f" },
    { id: "guez", nom: "Guez",                court: "Guez",              couleur: "#bfff7f" }
  ],

  // Les éléments à classer, dans l'ordre où ils apparaissent dans le bac.
  // Le nom sert de clé dans la base : ne plus le modifier après les premiers votes.
  // On peut ajouter des éléments à la fin sans rien casser.
  elements: [
    { nom: "Aya Nakamura",              image: "img/aya-nakamura.jpg" },
    { nom: "Christine and the Queens",  image: "img/christine-and-the-queens.jpg" },
    { nom: "M. Pokora",                 image: "img/m-pokora.jpg" },
    { nom: "Stromae",                   image: "img/stromae.jpg" },
    { nom: "Mika",                      image: "img/mika.jpg" },
    { nom: "Gims",                      image: "img/gims.jpg" },
    { nom: "Amir",                      image: "img/amir.jpg" },
    { nom: "Louane",                    image: "img/louane.jpg" },
    { nom: "Juliette Armanet",          image: "img/juliette-armanet.jpg" },
    { nom: "Pomme",                     image: "img/pomme.jpg" },
    { nom: "Zaho de Sagazan",           image: "img/zaho-de-sagazan.jpg" },
    { nom: "Jul",                       image: "img/jul.jpg" },
    { nom: "Angèle",                    image: "img/angele.jpg" },
    { nom: "Clara Luciani",             image: "img/clara-luciani.jpg" },
    { nom: "Indila",                    image: "img/indila.jpg" },
    { nom: "Gazo",                      image: "img/gazo.jpg" },
    { nom: "Adèle Castillon",           image: "img/adele-castillon.jpg" },
    { nom: "Daft Punk",                 image: "img/daft-punk.jpg" },
    { nom: "Superbus",                  image: "img/superbus.jpg" },
    { nom: "Thérapie Taxi",             image: "img/therapie-taxi.jpg" },
    { nom: "Bigflo & Oli",              image: "img/bigflo-oli.jpg" },
    { nom: "Sexion d'Assaut",           image: "img/sexion-d-assaut.jpg" }
  ]
};
