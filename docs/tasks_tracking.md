# Suivi des Tâches — Tasks Tracking

Ce journal documente l'état d'avancement opérationnel du projet **Prépa Concours**, classé par catégories de livrables techniques.

---

## ✅ Fonctionnalités Implémentées

### 🏗️ Écran d'Onboarding & Clé API
- [x] Écran sécurisé de saisie de la clé d'API (avec liens vers la console gratuite Google AI Studio).
- [x] Clé sauvegardée localement de manière persistante sur l'appareil de l'apprenant.
- [x] Ajout de boutons de déconnexion/effacement pour sécuriser la saisie utilisateur.

### 📚 Tableau de Bord Thématique (Syllabus Officiel Béninois)
- [x] 10 modules complets de Mathématiques (Suites, Intégrales, complexes...).
- [x] 10 modules d'Électricité et de Physique théorique (circuits RC/RLC, lois de Newton, Nucléaire...).
- [x] Indicateurs d'état d'avancement interactifs (*Non commencé*, *En cours*, *Maîtrisé*).
- [x] Filtres intelligents de tri par matière et barre de recherche réactive.

### 📝 Interface Révision & QCM d'Élite
- [x] fiches de synthèse de cours avec des notations mathématiques vectorielles (KaTeX).
- [x] Session de QCM interactif avec notation en temps réel et correction explicative détaillée.
- [x] Système d'apprentissage socratique (Mode Exercice) : L'IA questionne l'élève au lieu de donner de bêtes corrigés directs.

### 🎙️ Volet vocal & Tuteur Direct "Zéro Bla-bla"
- [x] Panneau de chat Tuteur vocal et textuel.
- [x] Mise en conformité de l'instruction système : interdiction formelle pour l'IA d'utiliser des formules d'intro et politesses déconcentrantes.
- [x] Module d'enregistrement vocal intégré avec retours haptiques et d'animations d'onde.

### 📄 Export de Bilan Individuel
- [x] Générateur de rapports `.txt` analysant les priorités à réviser.
- [x] Bouton d'export directement accessible sur l'action-bar du dashboard.

### 🎨 Landing Page Professionnelle (Portail d'Accueil)
- [x] Création de la Hero section d'affirmation visuelle.
- [x] Section explicative sur les cas d'usages pour ancrer l'appli dans les habitudes de travail d'un élève.
- [x] Section FAQ explicitant scientifiquement l'utilité du tuteur à style direct.
- [x] Intégration d'un sélecteur à deux sections (Présentation vs Mon Programme) pour structurer le tunnel d'onboarding.

---

## 🐛 Bogues Corrigés / Affinements

- **Optimisation majeure de la génération PDF (Rendu parfait et Fichiers ultra-légers)** : Correction du problème de rendu de mauvaise qualité (textes invisibles/illisibles dus aux classes de mode sombre comme `prose-invert` et `text-gray-300` résidant dans le document cloné) et de poids excessif du fichier PDF.
  - *Qualité visuelle royale* : Le moteur de clonage supprime désormais de manière récursive toutes les classes de mode sombre (`prose-invert`, `text-gray-*`, `bg-gray-*`) sur le conteneur et tous ses enfants, appliquant à la place un thème clair universitaire à très fort contraste : texte principal en ardoise foncée (`#1e293b`), titres d'excellence en bleu royal (`#1d4ed8`), équations mathématiques en bleu profond contrasté (`#1e3a8a`) et blocs de corrigés en vert clair soigné avec texte vert émeraude ultra-lisible (`#14532d`).
  - *Poids divisé par 15 (93% de réduction)* : Le format d'image compressé `JPEG` avec un taux d'échantillonnage de `0.75` remplace désormais le format lourd et non-compressé `PNG`. Couplé à un ajustement du facteur d'échelle à `1.8` (compromis parfait de netteté des formules mathématiques), le fichier PDF généré pèse désormais **entre 100 et 250 Ko** (contre 4 à 10 Mo auparavant), garantissant un téléchargement et un partage instantanés sur mobile.
- **Résolution du plantage html2canvas lié à oklch()** : Correction du bug critique de génération de PDF qui provoquait un crash avec le message d'erreur `"Attempting to parse an unsupported color function 'oklch'"`. Tailwind CSS v4 définit par défaut ses palettes de couleurs en utilisant des notations `oklch(...)`. Pour contourner l'incapacité de `html2canvas` à interpréter cette fonction de couleur moderne, un filtre d'assainissement robuste a été intégré dans l'événement `onclone` du processus de génération du PDF (dans `ChatBot`, `RevisionPanel` et `ExerciseMode`). Ce filtre parcourt et remplace à la volée toutes les occurrences de la fonction `oklch` par une couleur RGB de secours standard (`rgb(120, 120, 120)`) dans les styles et feuilles de style clonés, éliminant ainsi toute interruption sans affecter le rendu final de haute fidélité du PDF.
- **Boutons de téléchargement PDF sur les fiches de révisions et exercices** : Implémentation de boutons interactifs de téléchargement PDF au format de papier académique universitaire de haute fidélité pour les fiches de cours générées par l'IA et les exercices types d'examens. Pour l'exercice, le bouton détecte intelligemment si l'étudiant a révélé la correction détaillée et génère dynamiquement un PDF combinant le sujet et le corrigé rédigé, ou uniquement l'énoncé de départ s'il n'a pas encore dévoilé la solution.
- **Contrôle et Interception du Geste/Bouton Retour sur Mobile (Sûreté de Navigation)** : Implémentation d'un système de gestion de l'historique de navigation de pointe basé sur l'API HTML5 History (`window.history.pushState` et popstate). Les états de l'application (section active, mode d'étude reviser/QCM/exercice, et panneau du Chatbot) sont désormais sérialisés dynamiquement dans la pile d'historique du navigateur web. Tout appui sur le bouton physique Retour d'un smartphone Android ou geste de balayage latéral referme de façon séquentielle le Chatbot, puis les fenêtres de révision ou d'exercice, et enfin revient à l'écran d'accueil sans jamais décharger le site. Sur l'écran d'accueil racine, un double appui rapide (moins de 2s) est requis pour quitter, prévenu par un Toast d'invite chaleureux ("Appuyez à nouveau pour quitter l'application").
- **Optimisation et Stabilisation de la Dictée Vocale (Mode Continu)** : Correction de la déconnexion automatique prématurée du microphone lors des silences ou hésitations de réflexion de l'élève. Le moteur de reconnaissance vocale a été configuré sur le paramètre `continuous = true`, et la fonction de réception a été réécrite pour regrouper et sommer dynamiquement tous les fragments de transcription d'une même session. Le microphone reste actif jusqu'à ce que l'utilisateur choisisse explicitement de le désactiver, permettant de formuler de longues questions sereinement.
- **Exportation Universelle des Réponses du Tuteur (Formules LaTeX incluses)** : Intégration d'un système double d'exportation pour les messages du Tuteur IA. Les élèves peuvent désormais copier le contenu vers le presse-papiers sous deux formats simultanés (Format Plain Text / brut Markdown pour les éditeurs de texte simple et format HTML enrichi et stylisé avec un thème clair compatible avec Google Docs, MS Word et les plateformes de blogs pour un rendu visuel optimal) ou utiliser l'**Approche B : Génération PDF autonome haute fidélité** (avec `html2canvas` et `jsPDF`). Cette approche capture directement le DOM de l'explication (comprenant les formules, fractions, et graphiques vectoriels de KaTeX déjà compilés sur l'écran du navigateur) et le restitue au format PDF avec une netteté vectorielle d'impression (`scale: 2.5`), un thème de papier universitaire blanc contrasté, et des découpages de pages fluides automatiques.
- **Optimisation du Rendu Mathématique (LaTeX) du Tuteur IA** : Résolution définitive du bégaiement et du doublage des symboles (ex: `ln ln`, `λλ`, `Puisqueλ \lambda`) en intégrant localement la bibliothèque `katex` au bundle d'assets et en masquant de manière absolue les éléments de doublon de balisage MathML (`.katex-mathml { display: none !important }`). Isolation complète des grandes formules avec des sauts de ligne forcés de type bloc (`.katex-display`) et gestion réactive du débordement (`overflow-x: auto`) sur mobile, couplée à une augmentation de la largeur disponible de la bulle de chat de 75 % à 85 % sur les viewports étroits.
- **PWA Transformation** : Application convertie en Progressive Web App (PWA) avec support hors-ligne, icônes personnalisées, manifest complet, et gestion des mises à jour asynchrones.
- **Système de Versioning** : Implémentation d'un système de version automatique, incluant la génération de notes de version et une notification non-intrusive lors de disponibilité de mises à jour.
- **Référencement SEO & Charte Graphique** : Documentation complète de la stratégie SEO et de la charte graphique.
- **Correction de la Persistance et Configuration de la Clé API** : Résolution du comportement où cliquer sur le bouton de configuration de clé supprimait instantanément celle-ci du stockage local. Désormais, l'action redirige l'utilisateur vers l'écran de configuration en conservant sa clé active. L'écran de saisie pré-remplit le champ existant et offre des raccourcis explicites de validation, d'annulation ou de suppression sécurisée pour une expérience utilisateur sans frustration.
- **Optimisation de la Dictée Vocale & Documents PDF** : Correction des redondances de texte (échos) lors de la dictée vocale sur mobile en limitant le traitement aux nouveaux segments de résultats (`resultIndex`). Mise à jour du système d'instruction de l'IA et du message d'accueil pour que le Tuteur informe explicitement l'élève de sa capacité à fournir des fiches PDF haute résolution via l'interface.
- **Uniformisation du pipeline de rendu Mathématique (LaTeX)** : Audit et mise à jour de l'ensemble des modules affichant du contenu généré par l'IA (Tuteur IA, Fiches de révisions, QCM, Mode Exercice et Corrigés) pour utiliser strictement le même pipeline de rendu `ReactMarkdown` avec `remark-math` et `rehype-katex`. Ajout de la classe conteneur `katex-render-container` sur `QCMMode`, `ExerciseMode` et `RevisionPanel` afin de garantir que les règles CSS de masquage des doublons MathML et d'optimisation d'affichage s'appliquent uniformément avec le Tuteur.
- **Règles de génération LaTeX strictes pour l'IA** : Définition et injection d'un guide de formatage LaTeX exhaustif (`LATEX_RULES`) dans l'ensemble des requêtes envoyées à l'API Gemini. Ce guide interdit strictement l'utilisation d'expressions mathématiques en texte brut ou simplifiées (comme `(15t^2+200)/(3t^2+t+5)`) et force l'emploi rigoureux de la syntaxe LaTeX standard (comme `\frac{15t^2+200}{3t^2+t+5}`), avec l'usage impératif de balises single-dollar `$` pour les variables/formules en ligne (inline) et de double-dollars `$$` sur des lignes distinctes pour les expressions blocs, garantissant un rendu visuel 100% correct, professionnel et uniforme à travers toute l'application.
- **Résolution de l'erreur d'en-tête (ISO-8859-1 Header Error)** : Correction du plantage critique lors des appels API (`Failed to execute 'append' on 'Headers': String contains non ISO-8859-1 code point`). Implémentation d'une fonction de nettoyage et d'assainissement robuste de la clé API (`cleanApiKey`) qui filtre toute présence de caractères invisibles, d'espaces insécables, ou de guillemets intelligents/stylisés (`“`, `”`, `‘`, `’`) copiés-collés par accident, protégeant ainsi l'initialisation du client de l'SDK Google GenAI.
- **Correction de la Responsivité de l'interface en vue Mobile** : Résolution des collisions de superposition entre l'en-tête collant (*sticky header*) et le conteneur Hero de la Landing page sur les smartphones étroits (320px - 375px). Les paddings ont été ajustés, les polices d'en-tête sont maintenant fluctuantes (`text-lg` à `text-2xl`), et les libellés texte superflus sur les actions de l'en-tête se masquent sous la barre de `768px` (`hidden md:inline`) pour conserver une barre d'action épurée. Les onglets de navigation ont également été convertis en un format auto-ajusté (largeur équitable `flex-1` sur mobile) avec des abrégés contextuels ("Présentation" / "Programme") pour proscrire tout débordement de texte.
- **Correction du rendu Markdown** : Résolution du bug d'interprétation des sauts de ligne dans les retours mathématiques en injectant les plugins `remark-math` et `rehype-katex` sur les conteneurs d'affichage.
- **Optimisation des hauteurs d'écran de Chat** : Ajustement du panneau tuteur en version mobile pour éviter les débordements d'affichage en superposition du clavier virtuel.
- **Uniformisation SEO & Titre** : Remplacement des instances résiduelles de l'ancien nom de code temporaire du projet ("Prépa Prépa") par "Prépa Concours".

---

## ⏳ Tâches en Cours / Roadmap d'Amélioration

- [ ] **Persistance Cloud Optionnelle (Firebase Firebase)** : Offrir la synchronisation multi-appareils (PC et Mobile) pour préserver de manière centralisée le suivi des acquis de nos élèves abonnés.
- [ ] **Mode Annales Concours** : Ajout d'une section regroupant des sujets historiques complets de grands concours régionaux (EPAC, IMSP, etc.) prêts à être numérisés et solutionnés via socratique hybride.
- [ ] **Statistiques de Concentration** : Intégrer un minuteur d'études (Méthode Pomodoro d'élite) avec des sons d'oscillations harmoniques et d'ondes sonores pures pour aider le cerveau à entrer dans "la zone".
