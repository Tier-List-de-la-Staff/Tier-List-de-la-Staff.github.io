// Les tier lists affichées sur la page d'accueil, dans cet ordre.
// dossier     : le nom du dossier de la tier list (le plus simple : le même que son "id" dans config.js)
// statut      : petit badge sur la carte, par exemple "Ouvert" ou "Nouveau"
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
  }
];
