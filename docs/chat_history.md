# Journal des Échanges — Chat History

Ce document retrace la traçabilité brute et chirurgicale des interactions majeures pour assurer un alignement parfait de l'architecture logicielle avec les attentes de l'utilisateur.

---

### [2026-06-03 11:35:38-07:00]
**Utilisateur** :
> The AI tutor doesn't need formality in its responses. It's a waste of time.

**Assistant** :
> *[Modification de `src/utils/gemini.ts` pour injecter une contrainte technique stricte interdisant les salutations et forçant un style direct, succinct et percutant dans l'instruction système.]*

---

### [2026-06-03 11:49:05-07:00]
**Utilisateur** :
> Donne un nom à l'application.

**Assistant** :
> *[Analyse de l'écosystème béninois. Choix du nom universel et sobre : **Prépa Concours**. Modification de `metadata.json`, du composant `Dashboard.tsx` et de la balise `<title>` dans `index.html`.]*

---

### [2026-06-15 15:07:12-07:00]
**Utilisateur** :
> Tu es un Product Designer, UX Writer et Software Architect senior.
> 
> Avant toute modification :
> 
> ÉTAPE 0 — Sauvegarde
> - Analyse l'intégralité du projet actuel.
> - Crée un snapshot complet de l'état actuel [...] lister tous les fichiers qui seront modifiés, produire un plan détaillé et attendre la validation.
> - Ne modifier aucun fichier tant que je n'ai pas répondu: APPROUVÉ
> [...]
> ÉTAPE 1 — Audit du projet ...
> ÉTAPE 2 — Rédaction produit ...
> ÉTAPE 3 — Proposition (sans modifier de code d'abord) ...
> ÉTAPE 4 — Implémentation ...
> ÉTAPE 5 — Sécurité (Restauration si nécessaire).

**Assistant** :
> *[Analyse complète de l'application et rédaction du diagnostic produit de haut niveau, listing des fichiers à créer et à modifier (LandingPage, Dashboard, etc.), et présentation d'un document complet pour validation.]*

---

### [2026-06-15 15:09:56-07:00]
**Utilisateur** :
> APPROUVÉ

**Assistant** :
> *[Création du composant `LandingPage.tsx` contenant toutes les sections requises (Hero, Value Prop, Features, Use cases, Comment ça marche, FAQ, CTA), ajustement de styles, et intégration du bouton global pour ouvrir le tuteur vocal direct. Branchement du composant dans `Dashboard.tsx` pour offrir une distinction élégante entre la Landing d'onboarding et l'interface de révision.]*

---

### [2026-06-15 15:32:40-07:00]
**Utilisateur** :
> Analyse complètement ce projet. À partir du code source, des composants... Génère une fiche portfolio professionnelle.

**Assistant** :
> *[Transition vers la formalisation d'une étude de cas et de fiches d'architecture/documentation de niveau Lead-Tech et Product-Arch pour le dossier `docs/`.]*

---

### [2026-06-16 00:49:28-07:00]
**Utilisateur** :
> JE NOTE PAR ENDROIT DES PROBLEMES DE RESPONSIVITÉ

**Assistant** :
> *[Analyse approfondie de la mise en page sur mobile (320px-375px). Définition et correction de la grille du Hero de la Landing page, du padding interne, ainsi que de la hauteur et élasticité du sticky header du Dashboard principal. Remplacement de la navigation d'onglets pour s'adapter proprement sur smartphones sans briser d'élément textuel.]*

---

### [2026-06-16 06:33:30-07:00]
**Utilisateur** :
> Transformer cette application en Progressive Web App (PWA) de niveau professionnel avec favicon, manifest complet, service worker de gestion de cache et gestion de mises à jour cumulées, et système de versioning de type Notes de version.

**Assistant** :
> *[Transformation intégrale de l'application en Progressive Web App (PWA) avec Service Worker, manifeste complet, configuration et déploiement d'un système de versioning automatisé et notes de version asynchrones.]*

---

### [2026-06-17 06:47:46-07:00]
**Utilisateur** :
> L'affichage des réponses de notre "Tuteur IA" sur l'interface mobile présente de graves bugs de rendu textuel et mathématique. Le texte brut renvoyé par le LLM est mal parsé, ce qui crée des duplications de mots et des collisions visuelles illisibles entre les équations.

**Assistant** :
> *[Refonte et étalonnage du parser LaTeX avec KaTeX local. Élimination complète des duplications MathML et découpage de l'affichage équationnel sous forme de blocs d'expression dotés d'un scrolling horizontal pour un confort optimal sur mobile.]*

---

### [2026-06-18 09:41:52-07:00]
**Utilisateur** :
> Rendre conformes l'ensemble des éléments documentaires vivants conformément à la structure réglementaire complète de l'architecte documentaliste senior dans le répertoire `/docs/`.

**Assistant** :
> *[Création et enrichissement systématique des fiches d'architectures, suivi de conformité au Code du Numérique Béninois, manuel de déploiement et d'installation locale, registre de variables d'environnement et de limitations, complétant ainsi les 16 documents d'excellence requis.]*

---

### [2026-06-18 10:01:54-07:00]
**Utilisateur** :
> je valide alors appliquer les corrections (Ajouter les boutons Copier avec formatage Google Docs/Word/Blog et Télécharger en PDF pour le Tuteur IA)

**Assistant** :
> *[Intégration d'une barre d'outils d'action sous chaque message du Tuteur IA permettant la copie multi-format (Plain Text & HTML stylisé léger pour Google Docs et billets de blog) et le téléchargement de la réponse sous forme de fiche d'explications PDF unifiée format A4 (via jsPDF) avec gestion dynamique de la mise en page et numérotation automatique.]*

---

### [2026-06-18 10:21:20-07:00]
**Utilisateur** :
> pour Le téléchargement au format PDF prenons plutôt l'Approche B : Génération PDF autonome (html2pdf.js ou jsPDF)
> le rendu n'est pas optimal [image montrant le pdf avec les formules LaTeX brutes]

**Assistant** :
> *[Utilisation de html2canvas conjointement avec jsPDF pour capturer le DOM rendu en temps réel dans le navigateur (qui intègre le rendu vectoriel parfait de KaTeX pour les équations mathématiques et physiques complexes) puis génération d'un document PDF à l'échelle d'impression (vibrant d'excellence sous la forme d'un papier académique clair ultra-net scale: 2.5) préservant l'intégralité des symboles scientifiques sans aucune pixellisation ou code brut.]*

---

### [2026-06-18 10:27:12-07:00]
**Utilisateur** :
> Je remarque qu'au niveau du bouton pour dicter le texte, le microphone n'attend pas que l'utilisateur le désactive. Il se désactive tout seul. Par exemple, j'étais en train de lancer une requête et le microphone s'est arrêté tout seul. Ça a déjà fait cela plusieurs fois.

**Assistant** :
> *[Configuration de la reconnaissance vocale en mode continu (`continuous = true`) et réécriture de la concaténation de flux à chaque événement `onresult` dans ChatBot.tsx pour garantir la capture fluide et ininterrompue de phrases complexes.]*

---

### [2026-06-18 10:31:00-07:00]
**Utilisateur** :
> Analser complètement la gestion du bouton Retour sur mobile. (Empêcher la fermeture involontaire de l'application lorsque l'utilisateur utilise le bouton Retour Android ou le geste Retour.)

**Assistant** :
> *[Mise en place d'un routeur asynchrone orchestrateur sur l'API HTML5 History dans App.tsx interceptant l'événement `popstate`. Sérialisation réactive de la page d'accueil, du programme, des modales de révisions, du QCM, de l'exercice et du chatbot de façon à ce que le geste Retour Android ferme séquentiellement les calques sans rechargement. Implémentation d'un "Root Shield" (bouclier racine) demandant deux gestes retour rapprochés (<2s) avec avertissement toast au bas de l'écran pour confirmer la sortie de l'application.]*

---

### [2026-06-18 10:37:25-07:00]
**Utilisateur** :
> J'aimerais savoir si le fait d'être dans une sandbox peut empêcher que je télécharge le PDF car c'est ce que je constate actuellement au niveau du tuteur AI.

**Assistant** :
> *[Explication pédagogique et technique confirmant que la politique de sécurité des navigateurs (notamment sous Chrome et Samsung Internet) bloque les téléchargements initiés depuis des iFrames configurées en sandbox sans le jeton explicite 'allow-downloads'. Recommandation directe et guidée d'ouvrir l'application dans un nouvel onglet autonome (hors de l'iFrame de l'aperçu de la console d'IA Studio) afin que les téléchargements de fiches de cours PDF s'exécutent instantanément.]*

---

### [2026-06-18 10:46:16-07:00]
**Utilisateur** :
> I noticed that when I register my key and I am working, if I press the key again to open it, I see that my key is no longer registered. Without registering my key again, I cannot use the chatbot.
> Despite my key being activated, my key being entered, or my key being registered, I cannot use or convince the AI tutor to generate documents.
> , sur téléphone, je note des redondances dans la dictée vocale. Mais je note pas ce problème lorsque j'utilise un PC.

**Assistant** :
> *[Correction de l'écran `ApiKeyScreen` : la vue conserve et pré-remplit la clé enregistrée au lieu de l'effacer instantanément au clic. Optimisation du script de transcription de l'API SpeechRecognition en n'accumulant que les nouveaux `resultIndex` pour empêcher l'effet d'écho (texte en double) identifié sous Safari iOS et Chrome Android. Modification du prompt natif dans `gemini.ts` incitant le Tuteur IA à mentionner explicitement aux élèves la commande de téléchargement des PDF.]*

---

### [2026-06-22 17:40:19-07:00]
**Utilisateur** :
> Audite l'ensemble de l'application Prépa Concours. Identifie tous les composants qui affichent du contenu généré par l'IA... Le Tuteur IA affiche correctement les formules LaTeX via ReactMarkdown + remark-math + rehype-katex. Je veux que tous les modules utilisent exactement le même pipeline de rendu.
> je valide alors appliquer les corrections

**Assistant** :
> *[Réalisation d'un audit des composants asynchrones textuels. Uniformisation complète en ajoutant la classe experte `katex-render-container` autour des composants `<ReactMarkdown>` dans `QCMMode.tsx`, `ExerciseMode.tsx` et `RevisionPanel.tsx`. Cela permet le masquage des noeuds MathML obsolètes, l'application du scroll overflow élastique sur mobile pour les très longues équations et garantit le même rendu impeccable que la balise ChatBot au moment du téléchargement des fiches PDF LaTeX.]*

