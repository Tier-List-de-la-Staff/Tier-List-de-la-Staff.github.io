// Configuration de la tier list « emissions-tv ».
window.TIERLIST = {
  id: "emissions-tv",
  titre: "Tier list des émissions de TV",
  consigne: "Glissez chaque émission dans un tier, ou touchez une image puis la ligne voulue.",
  mots: { un: "une émission", ce: "cette émission", pluriel: "émissions" },
  afficherNoms: true,
  tiers: [
    { id: "inratable", nom: "Inratable",                                  court: "Inratable",   couleur: "#ff7f7f", note: "j'annule mon verre pour regarder" },
    { id: "prime",     nom: "Le prime du divertissement",                 court: "Le prime",    couleur: "#ffbf7f" },
    { id: "darons",    nom: "Ça se regarde chez les darons le dimanche",  court: "Chez les darons", couleur: "#ffdf7f" },
    { id: "bifbof",    nom: "Bif bof",                                    court: "Bif bof",     couleur: "#ffff7f" },
    { id: "guez",      nom: "Guez",                                       court: "Guez",        couleur: "#bfff7f" }
  ],
  elements: [
    { nom: "Le 20h de France 2", image: "img/le-20h-de-france-2.jpg" },
    { nom: "Affaire conclue", image: "img/affaire-conclue.jpg" },
    { nom: "D&CO", image: "img/d-co.jpg" },
    { nom: "Koh-Lanta", image: "img/koh-lanta.jpg" },
    { nom: "L'Heure des Pros", image: "img/l-heure-des-pros.jpg" },
    { nom: "Téléshopping", image: "img/teleshopping.jpg" },
    { nom: "Top Chef", image: "img/top-chef.jpg" },
    { nom: "C'est pas sorcier", image: "img/c-est-pas-sorcier.jpg" },
    { nom: "Faites entrer l'accusé", image: "img/faites-entrer-l-accuse.jpg" },
    { nom: "Les Anges", image: "img/les-anges.jpg" },
    { nom: "On n'est pas couché", image: "img/on-n-est-pas-couche.jpg" },
    { nom: "Question pour un champion", image: "img/question-pour-un-champion.jpg" },
    { nom: "Quotidien", image: "img/quotidien.jpg" },
    { nom: "Recherche appartement ou maison", image: "img/recherche-appartement-ou-maison.jpg" },
    { nom: "Secret Story", image: "img/secret-story.jpg" },
    { nom: "Touche pas à mon poste", image: "img/touche-pas-a-mon-poste.jpg" },
    { nom: "Vendredi tout est permis", image: "img/vendredi-tout-est-permis.jpg" }
  ]
};
