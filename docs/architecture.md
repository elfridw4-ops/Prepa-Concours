# Architecture Technique et Cartographie du Code — Prépa Concours

Ce guide d'onboarding s'adresse tant aux développeurs juniors qu'aux non-initiés voulant comprendre l'écosystème technique et la structure logique de la plateforme.

---

## 🗺️ VUE D'ENSEMBLE

**Prépa Concours** est une plateforme construite sous forme de Single Page Application (SPA) hautement modulaire. Elle s'orchestre autour d'un pipeline d'apprentissage direct et interactif, stockant localement la progression et requêtant en temps réel les modèles de langage Gemini sans serveurs intermédiaires d'API (BYOK).

```
                            [ index.html ] ──► (Portail CDN MathJax/KaTeX)
                                  │
                            [ src/main.tsx ]
                                  │
                            [ src/App.tsx ]  ◄── (Contrôleur d'état Clé & Routage)
            ┌─────────────────────┴──────────────────────┐
            ▼                                            ▼
   [ ApiKeyScreen.tsx ]                         [ Dashboard.tsx ]  ◄─── (Choix d'onglets)
   (Enregistre la clé                           ┌────────┴────────┐
    dans localStorage)                          ▼                 ▼
                                        [ LandingPage.tsx ]   [ ChapterCard.tsx ]
                                        (Vitrine & FAQ)       (Maths & Physique Modules)
                                                                  │
                                                        ┌─────────┼─────────┐
                                                        ▼         ▼         ▼
                                                    [Rev.Panel] [QCMMode] [Ex.Mode]
                                                    (Synthèse)  (Quiz)    (Socratique)
```

---

## 🗂️ STRUCTURE DES DOSSIERS ET RESPONSABILITÉS

### Dossier Racine `/`
Contient les fichiers de configuration du projet, le fichier d'entrée principal ainsi que la documentation générale.

- **/metadata.json** :
  - **Rôle** : Décrire les métadonnées de l'application consommées par la plateforme d'hébergement.
  - **Pourquoi il existe** : Recommander des permissions au conteneur (accès microphone) et déclarer les capacités majeures de l'IA.
  - **Ce qui casse s'il disparaît** : La plateforme de build/déploiement rejettera le package ou n'accordera pas la permission d'enregistrer la voix de l'élève.
  - **Qui l'utilise** : La structure d'orchestration cloud run.
- **/index.html** :
  - **Rôle** : Page Web maîtresse du projet.
  - **Pourquoi il existe** : Il injecte la balise `<div id="root">`, charge la feuille de styles CDN KaTeX indispensable aux notations de Physique/Mathématiques et lie le point d'entrée JavaScript.
  - **Ce qui casse s'il disparaît** : L'application entière ne peut plus s'afficher dans le navigateur (écran blanc).
  - **Qui l'utilise** : Le navigateur internet de l'élève.
- **/package.json** :
  - **Rôle** : Recette de cuisine des dépendances et scripts d'exécution.
  - **Pourquoi il existe** : Définit d'importantes options de compilation, compile le projet, liste les versions des packages tiers.
  - **Ce qui casse s'il disparaît** : Impossible d'effectuer un build de production (`npm run build`).

---

### Dossier `/src`
Le cœur battant de l'application en TypeScript réactif.

#### 📁 `/src/components` — Les Composants UI réutilisables

1. **`LandingPage.tsx`** :
   - **Rôle** : Vitrine d'accueil commerciale et pédagogique. Elle expose la proposition de valeur, les bénéfices fonctionnels, l'onboarding visuel en 1-2-3, des témoignages réels et la FAQ de notre méthode.
   - **Pourquoi il existe** : Pour donner de la légitimité universitaire au projet et rassurer les élèves/parents avant de débuter les révisions lourdes.
   - **Ce qui casse s'il disparaît** : Les nouveaux visiteurs atterrissent directement sur le programme brut d'exercices sans la FAQ d'accompagnement ou l'explication sur la clé API.
   - **Qui l'utilise** : Les nouveaux utilisateurs et le `Dashboard.tsx`.

2. **`Dashboard.tsx`** :
   - **Rôle** : Centre de contrôle. Il affiche la barre de progression globale, l'onglet programme, le système de recherche des matières, le bouton d'export du bilan d'acquis et l'inverseur de thèmes.
   - **Pourquoi il existe** : Il agrège toute l'arborescence des chapitres de cours disponibles et gère les vues d'onglets (Accueil vs Programme).
   - **Ce qui casse s'il disparaît** : La page principale disparaît, plus aucun élève ne peut naviguer d'un chapitre à l'aide des filtres.
   - **Qui l'utilise** : Le composant principal `App.tsx`.

3. **`ChapterCard.tsx`** :
   - **Rôle** : Carte visuelle présentant un module du syllabus béninois.
   - **Pourquoi il existe** : Affiche d'un coup d'œil le titre du cours, sa matière et un badge cliquable pour lancer la révision, l'exercice guidé ou le QCM.
   - **Ce qui casse s'il disparaît** : Le programme est illisible, l'étudiant ne peut plus cibler un chapitre en particulier pour s'entraîner.
   - **Qui l'utilise** : Le `Dashboard.tsx`.

4. **`ChatBot.tsx`** :
   - **Rôle** : Tuteur vocal et textuel conversationnel réactif ("Zéro Bla-bla").
   - **Pourquoi il existe** : Il permet aux élèves de poser des colles de dernière minute (questions théoriques, demandes de calculatrice, etc.) en direct, ou de dicter leurs questions de façon fluide au micro.
   - **Ce qui casse s'il disparaît** : Plus aucun canal d'aide conversationnelle instantanée et sans formalisme politique n'est accessible.
   - **Qui l'utilise** : Le composant global `App.tsx`.

5. **`ApiKeyScreen.tsx`** :
   - **Rôle** : Écran d'accueil de configuration pour les utilisateurs n'ayant pas encore renseigné de clé d'API.
   - **Pourquoi il existe** : Il explique pas à pas comment obtenir le code d'accès personnel et gratuit depuis Google AI Studio.
   - **Ce qui casse s'il disparaît** : Bloque l'accès aux fonctions avancées de l'application ou l'appli crashe au lancement si la variable d'environnement de clé n'est pas trouvée.
   - **Qui l'utilise** : `App.tsx` en guise de garde barrière.

6. **`RevisionPanel.tsx`**, **`QCMMode.tsx`** et **`ExerciseMode.tsx`** :
   - **Rôle** : Panneaux d'entraînement immersifs de chaque chapitre.
   - **Pourquoi ils existent** : Ils gèrent respectivement la fiche synthèse textuelle, le simulateur de questionnaires rapides et l'environnement de dialogue socratique guidé par l'IA de chaque matière spécifique.
   - **Ce qui casse s'ils disparaissent** : Les trois piliers pragmatiques d'acquisition des connaissances sont inaccessibles.
   - **Qui l'utilise** : `App.tsx` sous forme de portails modaux.

---

#### 📁 `/src/utils` — Les Cerveaux Utilitaires de l'App

1. **`gemini.ts`** :
   - **Rôle** : Gestionnaire d'appels et configuration d'instructions des modèles d'IA via le SDK officiel de Google.
   - **Pourquoi il existe** : Il implémente la logique d'appel, configure l'instruction système restrictive interdisant les salutations protocolaires polies et structure le mode de dialogue "socratique".
   - **Ce qui casse s'il disparaît** : Tous les appels d'évaluation des exercices, le chat vocal et l'aide personnalisée tombent en panne technique immédiate.
   - **Qui l'utilise** : `QCMMode.tsx`, `ExerciseMode.tsx` et `ChatBot.tsx`.

2. **`storage.ts`** et **`theme.ts`** :
   - **Rôle** : Pilotes de stockage persistant local pour la clé d'API, le choix de thèmes (sombre/clair) et la progression par chapitres.
   - **Pourquoi ils existent** : Garantissent qu'en rechargeant son navigateur, l'élève ne perde pas ses 14 chapitres validés ou sa clé personnelle de révision.
   - **Ce qui casse s'ils disparaissent** : L'appli perd la mémoire et l'élève doit tout ressaisir à chaque session de travail.
   - **Qui l'utilise** : Pratiquement l'intégralité des vues applicatives.

---

## 🎯 POINTS CRITIQUES DU SYSTÈME (Bouteilles à encre)

1. **Le Prompt Système Direct (`src/utils/gemini.ts`)** :
   - C'est l'âme de l'interaction pédagogique. Modifier à la légère ce fichier peut réinjecter du bla-bla, altérer le mode socratique ou forcer l'IA à donner la réponse sans obliger l'étudiant à calculer lui-même, ce qui saboterait l'objectif didactique.
2. **CDN KaTeX (`index.html`)** :
   - Sans le script CSS de KaTeX, l'analyseur des balises mathématiques plante en cours de route ou affiche les symboles d'intégrales circulaires ou de dérivations vectorielles sous forme de texte brut injouable pour l'œil de l'apprenant.

---

## 💡 AMÉLIORATIONS POSSIBLES & ROADMAP TECHNIQUE

- **Service Worker pour Révisions 100% Offline** : Mettre en cache persistante les fiches synthèses de cours et la structure applicative pour permettre aux élèves se déplaçant dans des zones sans réseau mobile d'étudier tout de même leurs fiches.
- **Drizzle DB ou IndexedDB** : Pour remplacer le localStorage si la base de questions QCM ou d'historique s'agrandit, afin de stocker de confortables paquets de données sans limites de taille de 5MB du stockage local standard.
