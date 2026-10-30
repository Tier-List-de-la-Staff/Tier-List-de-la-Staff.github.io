// Les tier lists affichées sur la page d'accueil, dans cet ordre.
// dossier     : le nom du dossier de la tier list (le plus simple : le même que son "id" dans config.js)
// statut      : petit badge sur la carte, par exemple "Ouvert" ou "Nouveau"
// type        : "jeu" pour un jeu (boutons « Jouer » et « Voir le classement » vers classement.html) ; à omettre pour une tier list
// actif       : true = visible dans le menu, false = masqué (la ligne peut être omise : visible par défaut)
window.LISTES = [
  {
    dossier: "chanson-francaise",
    titre: "Chanson française",
    description: "Les artistes d'ici, des légendes vivantes aux surcôtés. Glisse les photos dans le bon tier.",
    statut: "Ouvert",
    actif: true
  },
  {
    dossier: "musique-actuelle",
    titre: "Musique actuelle",
    description: "Pop, rap, électro : les têtes d'affiche françaises des années 2000 à aujourd'hui.",
    statut: "Nouveau",
    actif: false
  },
  {
    dossier: "fruits",
    titre: "Meilleurs fruits",
    description: "De la fraise à la noix de coco : quel fruit mérite la première place ? Un seul peut gagner.",
    statut: "Nouveau",
    actif: true
  },
  {
    dossier: "fraude-detournement",
    titre: "Fraude et détournement de fonds",
    description: "Du génie de l'escroquerie au petit joueur : qui mérite la première place ? Un seul Goat.",
    statut: "Nouveau",
    actif: true
  },
  {
    dossier: "arrondissements-paris",
    titre: "Arrondissements de Paris",
    description: "Du 1er au 20e : lequel est le meilleur, et lequel tu fuis ? Un seul gagnant, un seul à éviter.",
    statut: "Nouveau",
    actif: true
  },
  {
    dossier: "villes-france",
    titre: "Villes de France",
    description: "De Paris à Basse-sur-le-Rupt : quelle ville mérite le S, et laquelle tu fuis ?",
    statut: "Nouveau",
    actif: true
  },
  {
    dossier: "qui-se-cache",
    type: "jeu",
    titre: "Qui se cache ?",
    description: "Jeu d'Halloween : devine quel collègue se cache sous chaque fantôme.",
    statut: "Halloween",
    actif: true
  }
];
