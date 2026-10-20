# Luméa — galerie du monde

Luméa  est une galerie photo bilingue qui invite à découvrir une destination dans
chacun de 194 pays souverains. Le projet est réalisé en  HTML, CSS et JavaScript
natif, sans framework ni installation de dépendances...

## Lancer le projet en local

1. Ouvrir le dossier du projet dans VS Code.
2. Installer l’extension **Live Server**, si elle n’est pas déjà installée.
3. Ouvrir `index.html`, puis cliquer sur **Go Live** dans la barre d’état.
4. Le navigateur ouvre le site, généralement à l’adresse
   `http://127.0.0.1:5500/`.

La galerie interroge des services externes : une connexion Internet est nécessaire
pour obtenir la liste des pays et les photos. Les drapeaux restent disponibles
comme solution de remplacement pour les photos introuvables.

## Technologies utilisées

| Technologie | Utilisation dans Luméa |
| --- | --- |
| HTML5 | Structure de la page, contenu sémantique, formulaires et commandes. |
| CSS3 | Identité graphique, grilles, mise en page responsive, transitions et animations. |
| JavaScript natif (ES6+) | Traductions, recherche, filtres, pagination, chargement des données et visionneuse. |
| Fetch API | Requêtes HTTP asynchrones vers les services de données et d’images. |
| Wikimedia Commons API | Recherche des photos et des informations de licence et d’attribution. |
| FIRST API | Noms et régions des pays, associés à une liste locale de 194 codes ISO. |
| Intl.DisplayNames | Affichage des noms de pays en français ou en anglais selon la langue choisie. |
| Google Fonts | Polices Playfair Display et DM Sans. |
| Live Server | Serveur local de développement pour prévisualiser la page. |

## Fichiers du projet

- [`index.html`](./index.html) contient la structure sémantique, les libellés
  français initiaux, les filtres, les commandes de langue et la visionneuse.
- [`styles.css`](./styles.css) contient le système visuel, les composants, les
  états interactifs, les adaptations aux écrans et les préférences de mouvement.
- [`script.js`](./script.js) contient les traductions, les données, les événements,
  le rendu de la galerie et les appels aux API.

## Fonctionnement de la galerie

### 1. Chargement des pays

Au chargement de la page, `loadCountries()` appelle FIRST API avec `fetch()`.
Les résultats sont rapprochés de la liste de 194 codes ISO alpha-2 définie dans
`script.js`. Cette liste détermine les pays affichés, tandis que l’API fournit
leur nom anglais et leur région.

Si le service est indisponible ou renvoie une réponse inattendue, la galerie
affiche un message explicite et un bouton permettant de réessayer.

### 2. Recherche, continents et pagination

- Le champ de recherche accepte les noms en français ou en anglais, sans
  distinction entre majuscules et minuscules ni entre lettres accentuées et
  non accentuées. Un code ISO peut aussi être saisi.
- Les boutons filtrent par Afrique, Amériques, Asie, Europe ou Océanie. Les
  sous-régions comme l’Amérique centrale, les Caraïbes et le Moyen-Orient sont
  regroupées dans le continent correspondant.
- Les résultats sont triés dans la langue sélectionnée et présentés par lots
  de 24 avec le bouton **Voir plus de pays** / **Load more countries**.

### 3. Photos et attribution

Les fiches de pays sont créées avec JavaScript. `IntersectionObserver` ne lance
la recherche d’une photo Wikimedia que lorsqu’une fiche s’approche de l’écran.
Une file d’attente limite à quatre le nombre de recherches simultanées, ce qui
évite d’envoyer près de 200 requêtes d’un seul coup.

Quand une photo est trouvée, la visionneuse affiche son titre, sa région et un
lien vers la page Wikimedia Commons avec les informations d’auteur et de licence
fournies par cette page. Si la recherche ou le chargement de l’image échoue, le
drapeau du pays est utilisé à la place et la console signale le problème.

Les résultats de recherche photo sont basés sur le nom du pays et le terme
« landscape ». Ils peuvent parfois montrer une image qui représente mal la
destination : les métadonnées et le lien source doivent être vérifiés avant
toute réutilisation des images.

### 4. Visionneuse

Un bouton sur chaque photo ouvre une boîte de dialogue. On peut passer à l’image
précédente ou suivante avec les boutons ou les flèches du clavier, puis fermer
avec **Échap** ou le bouton de fermeture. À la fermeture, le focus revient au
bouton qui avait ouvert la visionneuse.

### 5. Langues

Le sélecteur **FR / EN** traduit les textes de l’interface, les noms de pays,
les catégories, les états de chargement, les erreurs, les textes alternatifs et
les libellés destinés aux lecteurs d’écran. Le choix est enregistré dans
`localStorage` sous la clé `lumea-language`.

## Concepts frontend mis en pratique

### Structure et sémantique HTML

La page sépare l’en-tête, le contenu principal, les sections de galerie et le
pied de page. Les titres suivent une hiérarchie, les filtres et commandes sont
de vrais boutons, et le champ de recherche possède un libellé accessible.

### CSS et système visuel

Les variables CSS définissent les couleurs et les familles typographiques.
CSS Grid construit la mosaïque ; Flexbox aligne les barres d’outils et les
métadonnées. Les pseudo-classes `:hover`, `:focus-visible` et `:focus-within`
rendent les états interactifs visibles.

Les media queries adaptent l’interface aux écrans larges, tablettes et mobiles.
La règle `prefers-reduced-motion` réduit les animations lorsque l’utilisateur
a demandé moins de mouvement dans son système.

### JavaScript et DOM

Les événements utilisateur déclenchent les fonctions de filtrage, de recherche,
de traduction et d’ouverture de la visionneuse. `renderGallery()` construit les
fiches avec les API DOM (`createElement`, `textContent`,
`DocumentFragment` et `replaceChildren`).

### Asynchronisme et états

Les appels réseau utilisent `async` / `await`, `fetch()` et la gestion des
erreurs. L’interface distingue le chargement, l’absence de résultat, l’échec
et l’affichage réussi d’une photo. Le chargement différé des images HTML et
`IntersectionObserver` évitent de traiter toutes les destinations immédiatement.

### Accessibilité et UX

- Les commandes sont utilisables au clavier et disposent d’un focus visible.
- Les filtres exposent leur état avec `aria-pressed`.
- Les annonces de chargement et le nombre de résultats utilisent des régions
  `aria-live`.
- Les images ont un texte alternatif et les commandes des libellés adaptés à
  la langue active.
- La visionneuse utilise `role="dialog"`, `aria-modal`, `aria-hidden` et `inert`
  pour contrôler son exposition aux technologies d’assistance.
- La mise en page responsive, les états de chargement et les messages d’erreur
  visent à garder la navigation compréhensible sur mobile comme sur ordinateur.

### Sécurité côté interface

Les noms de pays, titres d’images et textes issus des API sont insérés avec
`textContent`, et non interprétés comme du HTML. Les traductions qui utilisent
du HTML sont des constantes contrôlées par le projet. Le lien d’attribution
externe de la visionneuse utilise `rel="noopener noreferrer"`.

## Limites et pistes d’évolution

- La galerie dépend de FIRST API, Wikimedia Commons, FlagCDN et d’une connexion
  Internet. Les services externes peuvent être indisponibles ou limiter les
  requêtes.
- Les images sont sélectionnées à partir d’une recherche automatique ; une
  vérification éditoriale manuelle améliorerait la pertinence.
- Les API sont appelées directement par le navigateur ; un backend ou un cache
  pourrait améliorer la fiabilité, la mise en cache et le contrôle des erreurs.
- Les tests décrits pendant le développement sont des vérifications manuelles
  dans le navigateur. Le projet ne comporte pas encore de suite de tests
  automatisés ni d’outil de build.
- La liste correspond aux 194 codes ISO retenus dans le projet pour les États
  souverains ; ce choix est une convention de contenu, pas une définition
  universelle du statut d’un territoire.
