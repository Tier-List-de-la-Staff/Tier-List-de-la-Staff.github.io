// Configuration de la tier list « chanson française ».
// Pour créer une nouvelle tier list : copier ce dossier, puis modifier ce fichier (voir README.md).
window.TIERLIST = {
  // Identifiant dans la base de données : minuscules, chiffres et tirets, sans "__".
  // Ne plus le changer une fois que des gens ont voté.
  id: "chanson-francaise",

  titre: "Tier list chanson française",
  consigne: "Glissez chaque artiste dans un tier, ou touchez une photo puis la ligne voulue.",

  // Mots utilisés dans les phrases des pages.
  mots: { un: "un artiste", ce: "cet artiste", pluriel: "artistes" },

  // false : seules les photos s'affichent (les noms restent cachés pendant le vote).
  afficherNoms: false,

  // Nom de la sauvegarde dans le navigateur (garde les classements en cours des visiteurs).
  cleSauvegarde: "tierlist-chanson-fr-v1",

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
    { nom: "Claude François", image: "img/claude-francois.jpg" },
    { nom: "Indochine", image: "img/indochine.jpg" },
    { nom: "Céline Dion", image: "img/celine-dion.jpg" },
    { nom: "Daniel Balavoine", image: "img/daniel-balavoine.jpg" },
    { nom: "Michel Berger", image: "img/michel-berger.jpg" },
    { nom: "France Gall", image: "img/france-gall.jpg" },
    { nom: "Charles Aznavour", image: "img/charles-aznavour.jpg" },
    { nom: "Michel Sardou", image: "img/michel-sardou.jpg" },
    { nom: "Florent Pagny", image: "img/florent-pagny.jpg" },
    { nom: "Serge Gainsbourg", image: "img/serge-gainsbourg.jpg" },
    { nom: "Alain Souchon", image: "img/alain-souchon.jpg" },
    { nom: "Johnny Hallyday", image: "img/johnny-hallyday.jpg" },
    { nom: "Joe Dassin", image: "img/joe-dassin.jpg" },
    { nom: "Renaud", image: "img/renaud.jpg" },
    { nom: "Barbara", image: "img/barbara.jpg" },
    { nom: "Mylène Farmer", image: "img/mylene-farmer.jpg" },
    { nom: "Pierre Bachelet", image: "img/pierre-bachelet.jpg" },
    { nom: "Julien Clerc", image: "img/julien-clerc.jpg" },
    { nom: "Édith Piaf", image: "img/edith-piaf.jpg" },
    { nom: "Georges Brassens", image: "img/georges-brassens.jpg" },
    { nom: "Laurent Voulzy", image: "img/laurent-voulzy.jpg" },
    { nom: "Francis Cabrel", image: "img/francis-cabrel.jpg" },
    { nom: "Jacques Brel", image: "img/jacques-brel.jpg" },
    { nom: "Dalida", image: "img/dalida.jpg" },
    { nom: "Téléphone", image: "img/telephone.jpg" },
    { nom: "Christophe", image: "img/christophe.jpg" },
    { nom: "Jean-Jacques Goldman", image: "img/jean-jacques-goldman.jpg" }
  ]
};
