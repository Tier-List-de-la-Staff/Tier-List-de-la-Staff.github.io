# Tier lists

Site statique hébergé sur GitHub Pages. Les votes sont enregistrés dans Firebase (Firestore).

## Organisation

```
index.html              le menu (page d'accueil)
listes.js               la liste des tier lists affichées dans le menu
assets/                 le code commun à toutes les tier lists (ne pas modifier pour une nouvelle liste)
  site.js               réglages Firebase
  tierlist.js/.css      la page où l'on classe
  verdict.js/.css       la page des résultats
  stats.js              les calculs du verdict
chanson-francaise/      une tier list = un dossier
  index.html            page de vote (identique dans tous les dossiers)
  verdict.html          page de résultats (identique dans tous les dossiers)
  config.js             CE QUI CHANGE : titre, tiers, éléments à classer
  votes-origine.js      votes faits avant la mise en ligne (vide pour une nouvelle liste)
  img/                  les images des éléments
```

## Jeux

Un jeu est une page autonome dans son propre dossier (pas de `config.js` ni de verdict).
Dans `listes.js`, son bloc porte `type: "jeu"` : la carte du menu affiche alors « Jouer » (`index.html`)
et « Voir le classement » (`classement.html`).

- `qui-se-cache/` : deviner quel collègue se cache sous chaque fantôme. Chacun joue seul, comme une tier list.
  - `ghosts/01.jpg` à `21.jpg` : les fantômes ; `photos/01.jpg` à `21.jpg` : les vraies photos ;
    `noms.js` : les vrais prénoms, dans le même ordre. Attention : ces fichiers sont publics,
    un joueur malin peut lire les réponses.
  - `index.html` : le joueur écrit son prénom en haut à gauche, puis un fantôme par écran. Il tape un prénom
    dans la case à côté du bouton et valide ;
    le fantôme s'envole, la photo apparaît avec « Vrai » ou « Faux ». Une réponse validée ne se change plus.
    Majuscules, accents et trémas ne comptent pas, le prénom seul suffit. Après le 21e, le score part
    dans Firebase (`submissions`, documents `qui-se-cache__prenom`). Un prénom ne joue qu'une fois.
  - `classement.html` : tous les joueurs par score, et chaque fantôme du plus reconnu au plus mystérieux.
  - `commun.js` (correction des réponses) et `jeu.css` servent aux deux pages.
  - Supprimer un joueur (test, triche) : supprimer son document `qui-se-cache__…` dans la console Firebase.

## Ajouter une tier list

1. Copier le dossier `chanson-francaise` et le renommer, par exemple `fruits-legumes`
   (minuscules, chiffres et tirets, sans accent ni espace, sans `__`).
2. Dans le nouveau dossier, vider `img/` et y mettre les nouvelles images
   (jpg ou png, carrées de préférence, environ 300 px suffisent).
3. Remplacer tout le contenu de `votes-origine.js` par : `window.VOTES_ORIGINE = [];`
4. Modifier `config.js` :
   - `id` : le même nom que le dossier (`"fruits-legumes"`) ;
   - `titre`, `consigne`, `mots` ;
   - `cleSauvegarde` : supprimer la ligne (elle est créée automatiquement) ;
   - `tiers` : garder les mêmes ou en mettre d'autres (2 à 9 tiers) ;
   - `elements` : un nom et un chemin d'image par élément.
5. Ajouter un bloc dans `listes.js` pour que la carte apparaisse dans le menu.
6. Envoyer le dossier et `listes.js` sur GitHub (Add file → Upload files).

Rien d'autre à faire : pas de modification dans Firebase, la même base sert à toutes les listes.

## À ne pas changer après les premiers votes

- L'`id` de la tier list.
- Le `nom` d'un élément et l'`id` d'un tier : ils servent de clés dans la base.
  Les votes déjà envoyés avec l'ancien nom seraient ignorés.
- On peut en revanche ajouter des éléments à la fin de `elements`.

## Gérer les votes

- Voir les votes : console Firebase → Firestore Database → Data → `submissions`.
  Chaque document s'appelle `idDeLaListe__prenom`.
- Supprimer un vote (test, troll) : ouvrir le document puis « Supprimer le document ».
  La personne pourra alors revoter avec ce prénom.

## Règles de sécurité Firestore (déjà en place)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{id} {
      allow read: if true;
      allow create: if request.resource.data.participant is string
        && request.resource.data.participant.size() > 0
        && request.resource.data.participant.size() <= 40
        && request.resource.data.tierlist is string
        && id == request.resource.data.tierlist + '__' + request.resource.data.participant.lower();
      allow update, delete: if false;
    }
  }
}
```

## Limites connues

- N'importe qui peut taper le prénom d'un autre : c'est fait pour un jeu entre amis.
- Le verdict relit tous les votes de sa liste à chaque visite. L'offre gratuite de Firestore
  (50 000 lectures par jour) tient jusqu'à quelques centaines de votes par liste avec beaucoup de visites.
