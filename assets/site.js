// Réglages communs à tout le site.
// Ces clés Firebase ne sont pas secrètes : la sécurité vient des règles Firestore.
window.SITE = {
  firebase: {
    apiKey: "AIzaSyBNESXJL_f50pJ5Ypn2oVok5y9znGpD4Wk",
    authDomain: "tierlist-de-la-staff.firebaseapp.com",
    projectId: "tierlist-de-la-staff",
    storageBucket: "tierlist-de-la-staff.firebasestorage.app",
    messagingSenderId: "879594463681",
    appId: "1:879594463681:web:d741fd3cd5006a08fc8f40"
  },
  firebaseVersion: "10.12.2",
  collection: "submissions"
};

// Charge Firebase uniquement quand on en a besoin (envoi d'un vote, lecture du verdict).
window.chargerFirebase = (function(){
  let pret = null;
  return function(){
    if(!pret){
      const base = "https://www.gstatic.com/firebasejs/" + window.SITE.firebaseVersion + "/";
      pret = Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")])
        .then(([app, fs]) => ({ fs, db: fs.getFirestore(app.initializeApp(window.SITE.firebase)) }))
        .catch(e => { pret = null; throw e; });
    }
    return pret;
  };
})();
