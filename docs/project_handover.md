# Guide de Transfert du Projet (Handover) — Prépa Concours

Ce guide de transfert technique est conçu pour permettre à un développeur senior ou à une équipe d'ingénierie reprenant le projet d'être immédiatement opérationnel et de poursuivre le développement ou le déploiement en production sans friction.

---

## 📋 RÉSUMÉ DU PROJET
**Prépa Concours** est une plateforme d'entraînement et d'onboarding scientifique assistée par IA, spécifiquement calibrée pour le programme de Terminale D/C du Bénin. Elle contient des fiches de révisions, des modules de QCM dynamiques, un mode de tutorat socratique basé sur l'IA et une assistance vocale facilitant les saisies complexes d'équations.

---

## ⚙️ FONCTIONNALITÉS MAJEURES ET ÉTAT D'AVANCEMENT

### 1. Fonctionnalités Principales (Complètes à 100%)
*   **Vitrine / Landing Page** : Proposition de valeur moderne, FAQ exhaustive, témoignages d'élèves, onboarding didactique et boutons d'action d'installation.
*   **Mon Programme d'Exercices** : Menu principal découpé par matière (Mathématiques et Physique) filtrable par titre de chapitre.
*   **Panneau de Révisions** : Fiches de cours synthétisées avec rendu d'équations physiques grâce au moteur de rendu LaTeX ultra-fluide de KaTeX.
*   **Tuteur IA (Mode Socratique)** : Dialogue d'accompagnement direct et personnalisé pour résoudre des étapes d'explications de cours.
*   **Version Mobile Responsive** : En-tête agile, onglets flexibles adaptatifs pour éliminer le hachage ou débordement sur smartphones étroits.
*   **Intégration d'Application Progressive (PWA)** : Support hors-ligne, icône, manifeste standalone et gestionnaire silencieux de révision de version de production.

### 2. Fonctionnalités Secondaires (Complètes)
*   **Vocal / Synthèse Vocale Web Audio** : Dictée vocale pour poser des questions complexes au tuteur sans clavier scientifique.
*   **Fiches de Bilan PDF/JSON** : Exportation de la progression globale et historique d'étude directement téléchargeable par l'élève.

### 3. Fonctionnalités Incomplètes ou Optionnelles (Futures versions)
*   **Authentification Multi-Terminaux** : Actuellement basé sur `localStorage` de manière sécurisée (BYOK). Un futur couplage avec Firebase Auth permettrait de restaurer la clé sur d'autres supports physiques simultanément.

---

## 🔗 SPÉCIFICATIONS DES INTÉGRATIONS ET APIS

*   **SDK Google GenAI** : Intégration du module `@google/genai` pour initier d'excellents dialogues d'IA avec de robustes filtres paramétriques.
*   **KaTeX CDN & CSS local** : Parser d'équations d'expressions mathématiques et physiques, empêchant toute interférence ou bégaiement visuel. Les balises MathML superflues sont désactivées pour proscrire les duplications textuelles en mobile.

---

## 🛑 DÉPENDANCES ET SYSTÈMES CRITIQUES

Toute mise à jour du projet doit monitorer attentivement les éléments suivants :

1.  **Vite-Plugin-PWA** : Configuration dans `vite.config.ts`. S'assure que le Service Worker est actif, gère les caches d'images et de styles KaTeX pour l'accessibilité hors-ligne.
2.  **`localStorage` et État Contextuel** : La sauvegarde de la clé API personnelle et du taux de progression de l'étudiant est stockée localement. Ne jamais écraser ces variables système sans mécanisme de migration.
3.  **Rendu Markdown** : Assure-toi que les mathématiques imbriquées sont lues de façon équitable tant en inline ($$) qu'en bloc ($$$$).
