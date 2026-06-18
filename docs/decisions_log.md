# Registre des Décisions Architecturales (ADR) — Prépa Concours

---

## ADR 1 : Stockage Client-Only et Politique "Bring Your Own Key" (BYOK)

- **Date** : 2026-06-03
- **Contexte** : La mise en place d'un backend centralisateur avec base de données cloud pour stocker les profils utilisateurs et payer les appels d'API s'avère coûteuse, complexe et pose des risques pour la sécurité des clés d'API et la confidentialité des adolescents mineurs préparant leur baccalauréat.
- **Décision** : Utiliser l'architecture "Bring Your Own Key" associée au stockage persistant client-side via le `localStorage` du navigateur de l'élève.
- **Alternatives envisagées** :
  - Centraliser un backend Node/Express connecté à Firestore qui proxyfie les requêtes Gemini et fait de la facturation par abonnement (éliminé pour des raisons d'accessibilité financière pour l'élève ouest-africain).
- **Conséquences** :
  - **Avantages** : L'application est 100% gratuite et hébergée de manière ultra-économique sous forme de fichiers statiques. L'étudiant reste souverain de sa consommation d'API sans limite arbitraire de notre part.
  - **Inconvénients** : L'élève doit générer lui-même une clé API Google AI Studio stable. Un panneau d'onboarding clair et didactique s'avère nécessaire pour encadrer cette étape.

---

## ADR 2 : Restriction stricte des civilités et salutations du Tuteur IA

- **Date** : 2026-06-03
- **Contexte** : Le tuteur IA de base avait tendance à utiliser des salutations et des phrases introductives denses (ex: "Bonjour Cher Apprenant ! J'espère que vous passez une excellente journée. C'est avec plaisir que je vais vous réexpliquer les ondes..."). Ce bruit visuel augmentait de 30% la quantité de texte à lire et ralentissait la dynamique d'apprentissage.
- **Décision** : Injecter une règle système drastique dans l'instruction de base du modèle Gemini, lui ordonnant d'omettre toute marque de politesse ou salutation, et d'entrer immédiatement dans l'aspect mathématique brute du raisonnement.
- **Alternatives envisagées** :
  - Laisser l'IA s'exprimer naturellement (éliminé pour manque de professionnalisme/efficacité).
  - Créer un filtre en Regex côté client pour nettoyer les "Bonjour" (éliminé car trop instable face aux variations de langage du modèle).
- **Conséquences** :
  - **Avantages** : Les explications sont percutantes, directes et scientifiques. L'apprenant gagne un temps de révision précieux.
  - **Inconvénients** : Le ton visuel peut paraître brusque pour un non-initié, d'où l'importance de justifier scientifiquement ce choix d'interface directement au sein d'une FAQ pour éduquer l'utilisateur.

---

## ADR 3 : Architecture à Double Portail (Landing Page & Espace Travail)

- **Date** : 2026-06-15
- **Contexte** : Initialement, la plateforme ouvrait directement sur le tableau de bord des révisions. Les nouveaux bacheliers n'avaient pas de contexte didactique sur la philosophie de la plateforme, ce qui pouvait rebuter ceux moins familiers des démarches académiques autonomes.
- **Décision** : Ajouter un composant de présentation `LandingPage.tsx` et mettre en place une vue d'onglets ergonomique en haut du tableau de bord.
- **Alternatives envisagées** :
  - Créer un site multi-pages séparé sous Next.js (éliminé pour ne pas alourdir l'empreinte technologique et respecter la contrainte Single Page App actuelle).
- **Conséquences** :
  - **Avantages** : Une prise en main professionnelle, un onboarding en 3 étapes extrêmement didactique, une section FAQ qui dissipe les doutes et légitime l'approche directe du tuteur IA.
  - **Inconvénients** : Ajoute une étape d'interaction mineure pour les grands habitués voulant foncer vers leurs exercices (résolu par le fait de mémoriser l'onglet actif ou de mettre des CTA proéminents).

---

## ADR 4 : Intégration KaTeX Directe via CDN en Header

- **Date** : 2026-06-03
- **Contexte** : Les formules mathématiques brutes en format texte standard ou Unicode sont illisibles et déprofessionnalisent l'apprentissage scientifique.
- **Décision** : Charger une feuille de styles KaTeX via CDN dans `index.html` et coupler le parseur `react-markdown` avec les extensions du catalogue scientifique (`remark-math` et `rehype-katex`).
- **Alternatives envisagées** :
  - Embarquer d'autres bibliothèques de calcul vectoriel lourdes à la volée.
- **Conséquences** :
  - **Avantages** : Rendu vectoriel ultra-précis, fluide, compatible Mobile, préservant la fidélité des formules d'intégration trigonométrique complexes ou d'équations différentielles physiques.
  - **Inconvénients** : Nécessite une clé d'accès réseau performante pour charger les polices KaTeX au premier démarrage (résolu par la mise en cache par le navigateur).

---

## ADR 5 : Stratégie de Responsivité Fluide et Condensation d'En-tête Mobile

- **Date** : 2026-06-16
- **Contexte** : Lorsque l'application est consultée sur des téléphones très étroits (320px - 375px de largeur, ex. iPhone SE, petits smartphones Android d'entrée de gamme ou fenêtres imbriquées d'iframe d'évaluation), l'en-tête collant (*sticky header*) et les sélecteurs de menu collisionnaient avec le Hero de la page d'accueil ou provoquaient des retours à la ligne inesthétiques pénalisant la proposition de valeur visuelle "Élite".
- **Décision** : Mettre en œuvre trois règles de mise en page réactives basées sur les breakpoints standards de Tailwind :
  1. **En-tête conditionnel** : Masquer les textes secondaires des boutons d'actions système (Bilan, Modifier Clé) sur les supports de taille inférieure à `md` (768px), réduisant l'en-tête à des icônes minimalistes et légères.
  2. **Contraction de l'affichage Hero** : Réduire le rembourrage interne (*padding*) du Hero de `p-8` à `p-5` sur mobile pour élargir la zone de texte, et adapter la taille de police de `4xl` à `2xl` pour éviter le hachage des mots scientifiques comme "Mathématiques/Physique".
  3. **Division d'onglets équitables** : Configurer la zone d'onglets de navigation en `flex w-full` avec des boutons à largeur égale (`flex-1`), couplé à une substitution textuelle dynamique (e.g., remplacer le texte long "Mon Programme d'Exercices" par le label allégé "Programme" sous le point de rupture `sm`).
- **Alternatives envisagées** :
  - Créer des menus de tiroir coulissant (*Sidebar/Drawer*) (éliminés car encombrants pour une UI simple et directe et violant l'idéal du single-view constraints).
  - Utiliser des barres de défilement horizontal (*horizontal scroll*) sur l'en-tête (éliminées pour cause de dégradation d'usage ergonomique).
- **Conséquences** :
  - **Avantages** : Rendu irréprochable et professionnel sur l'ensemble du spectre de terminaux (du vieux smartphone au moniteur 4K). Une densité de l'information parfaitement lissée et sans gaspillage de pixel d'attention.
  - **Inconvénients** : Légère augmentation de la verbosité des classes CSS directes de l'en-tête, entièrement justifiée par l'élégance du résultat obtenu.

---

## ADR 6 : Transformation en Progressive Web App (PWA)

- **Date** : 2026-06-16
- **Contexte** : Nécessité d'offrir une expérience proche du natif pour les étudiants se connectant principalement depuis des smartphones mobile, souvent avec une connectivité intermittente.
- **Décision** : Utilisation du plugin `vite-plugin-pwa` pour transformer l'application SPA en PWA.
  - Implémentation d'un Service Worker (stratégie `autoUpdate` pour une mise à jour silencieuse).
  - Génération d'un `manifest.webmanifest`.
  - Intégration de composants de gestion d'installation (`InstallPrompt`) et de notification de mise à jour (`UpdateNotification`).
  - Implémentation d'un système de versioning (`version.json`) et affichage des notes de version.
- **Alternatives envisagées** :
  - Utilisation de React Native (écarté, car nécessite une réécriture complète pour un projet initié en React Web simple et robuste).
- **Conséquences** :
  - **Avantages** : Accès hors-ligne, installabilité, chargement quasi instantané suite au premier accès, meilleure fidélisation utilisateur par les notifications de mise à jour.
  - **Inconvénients** : Légère complexité accrue au démarrage de l'application due au cycle de vie du Service Worker (géré automatiquement par le plugin).
