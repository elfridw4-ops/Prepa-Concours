# Protocole de Démarrage Local (Local Setup) — Prépa Concours

Ce guide détaille les étapes pour installer, exécuter, linter et builder l'application sur un poste de développement local (IDE standard de votre choix).

---

## 🛠️ PRÉREQUIS ET VERSIONS DU RUNTIME

Pour exécuter et maintenir ce projet avec succès, assurez-vous de disposer des versions système suivantes :

*   **Node.js** : Version `>= 18.x.x` (Recommandé : Version LTS Active).
*   **npm** : Version `>= 9.x.x` (ou pnpm/yarn).
*   **Navigateur** : Navigateur moderne supportant les fonctionnalités de **Service Worker** et de **Progressive Web App** (Chrome, Firefox, Safari ou Edge).

---

## 🚀 ÉTAPES ET COMMANDES DE DÉVELOPPEMENT

### 1. Cloner le Projet et Installer de Zéro
Dans votre dossier de travail :
```bash
# Installer toutes les dépendances listées dans le package.json
npm install
```

### 2. Démarrer le Serveur de Développement
Pour lancer le serveur de développement local avec rechargement d'actifs :
```bash
# Démarre l'application sur http://localhost:3000
npm run dev
```

### 3. Valider la Cohérence du Code (Linter & Typecheck)
Pour s'assurer qu'aucun bug de typage ou syntaxique important ne brise la PWA :
```bash
# Exécute la compilation TypeScript silencieuse de diagnostic
npm run lint
```

### 4. Compiler l'Application pour la Production
Cette commande effectue de robustes validations de liaison d'actifs et place les optimisations minifiées dans le dossier `/dist` :
```bash
npm run build
```

---

## 🗃️ CHAÎNE DE POINTS D'ENTRÉE DU PROJET

*   **`index.html`** : Point d'ancrage du navigateur qui lie le JS et précharge d'importantes polices et feuilles de style KaTeX.
*   **`src/main.tsx`** : Initialise React 18, injecte les styles globaux et monte le composant racine.
*   **`src/App.tsx`** : Coordonne la présence de la clé API, installe les modules additionnels de PWA et bascule entre l'écran de configuration API et le Dashboard principal d'études.
*   **`src/index.css`** : Centralisation des règles d'importations Tailwind et correction absolue du doublage d'équations LaTeX en masquant le balisage MathML.
