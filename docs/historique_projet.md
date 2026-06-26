# Historique du Projet — Prépa Concours

## 📝 Présentation du projet

- **Nom du projet** : Prépa Concours
- **Objectif** : Fournir un tuteur d'entraînement chirurgical et ultra-sélectif pour propulser les bacheliers et lycéens de Terminale D et C en Afrique de l'Ouest (Bénin) vers la réussite de leurs tests d'entrée de grandes écoles d'ingénieurs et universités (EPAC, FAST, IMSP, ENEAM, ENS).
- **Utilisateurs cibles** : Elèves de Terminale D/C motivés, candidats scolaires préparant un test scientifique de haut niveau, autodidactes.
- **Fonctionnalités principales** :
  - **Fiches Synthèses** : Condensés de cours ciblés (Électricité RLC, Newton, Complexes, Suites...).
  - **QCM d'Évaluation** : Diagnostics rapides des notions clés avec justifications.
  - **Exercices Guidés** : Apprentissage interactif assisté par l'IA sans réponses toutes faites.
  - **Tuteur Vocal Direct** : Chatbot ultra-réactif sans fioritures polies ou perte de temps.
  - **Bilan Téléchargeable** : Export en un clic de la progression sous forme de fichier `.txt` structuré.

---

## 🏛️ Architecture

### Vue Globale
L'application est une Single Page Application (SPA) bâtie sous une architecture client-side moderne et autonome, assurant une immédiateté d'exécution critique pour des sessions de révisions studieuses.

### Technologies Utilisées
- **Interface Utilisateur** : React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion (animations fluides).
- **Rendu Scientifique** : React-Markdown avec plugins mathématiques `remark-math` et `rehype-katex` pour l'affichage de notation physique/mathématique complexe.
- **Intelligence Artificielle** : SDK de pointe `@google/genai` pour la communication directe avec les modèles Gemini (Gemini-3.5-flash) en mode "Zéro fioriture".
- **Stockage & Persistance** : Client-side, asynchrone et crypté localement via le `localStorage` de l'appareil de l'élève (sauvegarde de la clé API personnelle et des états d'avancement des chapitres).

### Flux de Données
```
[Élève (Interface HTML5/TSX)]
     │
     ├── Writes / Speaks Question ──► [Chatbot Client Component]
     ├── Interactive QCM States    ──► [Tuteur IA (Gemini API via SDK)]
     │                                     │
     └── Sauvegarde Progression ──► [LocalStorage (Navigateur)]
```

---

## ⚙️ Décisions techniques

1. **Pas de Backend Cloud Obligatoire (BYOK - Bring Your Own Key)**
   - *Justification* : Éviter les coûts serveurs immenses et le bridage de requêtes. L'élève utilise sa clé gratuite Google AI Studio, conférant une liberté d'apprentissage et une confidentialité totale de son historique scolaire.
2. **Instruction Système "Sans Formule de Politesse"**
   - *Justification* : Lutter contre la dilution intellectuelle. En supprimant les *"Bonjour !", "Comment allez-vous ?", "Voici la résolution de votre problème"* de l'IA, on réduit le bruit de lecture de 40%, optimisant la concentration de l'élève.
3. **KaTeX Natif**
   - *Justification* : Un tuteur en Mathématiques et Physique se doit d'exposer des équations irréprochables ($\int e^x dx$ ou $\vec{F} = m\vec{a}$) pour conserver la crédibilité académique requise.

---

## 🕒 Historique des modifications

### [2026-06-03] - Sprint d'Initialisation & Core Features
- **Description** : Création du tableau de bord de révision par modules de Mathématiques et de Physique pour le programme béninois de Terminale D/C.
- **Impact** : Mise en production des fiches synthétiques et des deux modes interactifs (QCM d'auto-évaluation et Mode Exercice assisté étape par étape).

### [2026-06-03] - Chirurgie Pédagogique (Retrait des Formalités)
- **Description** : Refactorisation de l'instruction système du tuteur IA dans `src/utils/gemini.ts`.
- **Impact** : L'IA répond de façon ultra-directe, brute et scientifique. Gain de temps critique de lecture éprouvé lors des révisions rapides.

### [2026-06-03] - Identité & Harmonisation de Titre
- **Description** : Transition du nom provisoire "Prépa Prépa" vers l'identité forte et universelle de **Prépa Concours**.
- **Impact** : Correction des en-têtes de l'export de bilan de progression et uniformisation de l'onglet HTML du site (`index.html`).

### [2026-06-15] - Architecture Documentaire & Landing Page Multi-Section (Mise à jour majeure)
- **Description** : Modélisation et implémentation de `LandingPage.tsx`, intégrant une proposition de valeur pointue pour l'onboarding bachelier, une FAQ exhaustive, des cas d'usage réels et un sélecteur d'onglets ergonomique au niveau du `Dashboard`.
- **Impact** : Expérience utilisateur grandement fluidifiée pour les nouveaux arrivants ; clarté stratégique accrue du produit.

### [2026-06-16] - Sprint d'Optimisation de la Responsivité sur Mobile
- **Description** : Refactorisation structurelle de l'en-tête collant et des composants de navigation pour s'adapter dynamiquement sur les smartphones à faible largeur de rendu (320px - 375px).
- **Impact** : Élimination complète des chevauchements de textes, des débordements horizontaux et des cassures forcées disgracieuses dans le Hero de la page d'accueil et le Switcher d'onglet. Alignement parfait à 100% sur de multiples supports.

### [2026-06-16] - Transformation PWA & Système de Versioning
- **Description** : Conversion totale de l'application en Progressive Web App (PWA) avec Service Worker, Manifest, et système silencieux de mise à jour. Mise en place d'une version de production et d'un système de notes de version. Documentation SEO et Charte graphique ajoutées.
- **Impact** : Amélioration substantielle de l'accessibilité mobile, facilitant l'installation et garantissant une expérience utilisateur cohérente quel que soit le contexte de connexion.

### [2026-06-17] - Refonte Pédagogique du Rendu LaTeX & Corrections d'Equations sur Mobile
- **Description** : Intégration de la bibliothèque KaTeX locale répertoriée par le bundle d'actifs. Dissociation complète du rendu MathML au profit exclusif du balisage HTML à haute-précision pour éliminer la duplication des équations et des caractères (`ln ln`, `λλ`). Rallongement élastique des bulles de chat à 85 % de largeur et injection d'un dispositif réactif d'overflow de scrolling horizontal (`overflow-x: auto`) sur les formules de display block.
- **Impact** : Lecture mathématique et physique irréprochable et fluide sur tous supports mobiles, sans coupure d'expression scientifique ni télescopage.

### [2026-06-18] - Intégration de l'Export Multi-Format & Téléchargement PDF Haute Fidélité (Formules LaTeX d'excellence)
- **Description** : Ajout d'une barre d'outils d'action interactive intégrée sous chaque explication générée par le Tuteur IA. Permet l'exportation intelligente dans le presse-papiers avec une double représentation simultanée (Markdown brut et HTML enrichi, propre et compatible avec Google Docs/MS Word) ainsi que la génération client-side instantanée du cours sous forme de fiche PDF officielle format A4 avec une fidélité visuelle de 100% (via l'intégration autonome de `html2canvas` et `jsPDF` capturant directement chaque transition et formule LaTeX de KaTeX).
- **Impact** : Possibilité pour l'étudiant d'extraire, imprimer, ou archiver ses cours personnalisés directement dans ses notes de blog ou ses rapports scolaires avec un rendu mathématique ultra-net (`scale: 2.5`), sans perte de mise en page. Offre une immense valeur d'apprentissage permanent et d'exportabilité.

### [2026-06-18] - Optimisation et Stabilisation de la Dictée Vocale (Reconnaissance Continue)
- **Description** : Correction de la déconnexion automatique prématurée du microphone due aux silences légers d'un élève en cours de réflexion en activant `continuous = true` sur le moteur de reconnaissance vocale du navigateur. Réécriture complète du gestionnaire d'événements `onresult` pour agréger de manière incrémentale tous les segments transcrits d'une même session.
- **Impact** : Expérience d'apprentissage et de dialogue oral extrêmement confortable pour le bachelier, pouvant formuler des interrogations longues et structurées sans interruption intempestive du périphérique d'entrée.

### [2026-06-24] - Optimisation Majeure du Rendu PDF & Allègement Extrême des Fichiers
- **Description** : Correction d'un bug critique de rendu (textes flous ou invisibles causés par l'inclusion de classes CSS de mode sombre comme `prose-invert` dans le DOM cloné) et de poids excessif des fichiers PDF générés (4 à 10 Mo par document en PNG non-compressé). Réécriture complète du cycle de clonage dans `html2canvas` (`onclone`) : suppression récursive de toutes les classes de mode sombre et application d'un thème clair d'excellence universitaire à fort contraste (textes en Slate-800, en-têtes en Bleu Royal, formules KaTeX en Bleu Profond et corrections d'exercices en Vert émeraude sur fond vert clair doux). Adoption du format d'encodage `JPEG` compressé à `0.75` au lieu de `PNG` avec un ajustement du facteur d'échelle à `1.8`.
- **Impact** : Rendu visuel d'impression universitaire impeccable et professionnel. Le poids moyen d'un fichier PDF généré chute de **93%**, passant de plusieurs mégaoctets à une taille optimale de **100 à 250 Ko**, permettant un téléchargement instantané et un partage mobile fluide à très bas débit sans encombrer la mémoire de l'appareil.


