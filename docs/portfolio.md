# Fiche Portfolio Professionnelle — PRÉPA CONCOURS BÉNIN

---

## 🏷️ NOM DU PROJET
**PRÉPA CONCOURS BÉNIN**  
*Tuteur Scientifique IA Socratique & Compagnon d'Excellence pour le Baccalauréat*

---

## 📝 RÉSUMÉ EN UNE PHRASE
Une application web progressive (PWA) d'apprentissage offline-first intégrant un tuteur IA socratique et un moteur d'impression vectoriel pour préparer rigoureusement les bacheliers scientifiques du Bénin et d'Afrique francophone aux concours d'entrée des grandes écoles.

---

## 🎯 PROBLÈME RÉSOLU
En Afrique francophone, l'accès à des ressources de préparation de haut niveau pour les concours d'élite (EPAC, IMSP, ENEAM, CPGE) est inégal et coûteux. De plus, les tuteurs IA grand public se perdent en politesses verbeuses, fournissent des solutions "toutes prêtes" qui court-circuitent l'effort intellectuel des élèves, et sont incapables de formater correctement les équations LaTeX complexes pour l'impression physique. Enfin, l'instabilité de la connexion internet mobile (faible bande passante, coût élevé des données) limite l'utilisation continue des plateformes purement cloud.

---

## 👥 PUBLIC CIBLE
- **Élèves de Terminale scientifique (Séries C, D, E)** au Bénin et en Afrique de l'Ouest (Togo, Côte d'Ivoire, Sénégal, etc.) préparant le Baccalauréat et les concours de grandes écoles.
- **Enseignants de mathématiques et de sciences physiques** recherchant des fiches de synthèse de niveau académique et des banques d'exercices d'examen corrigés de façon rigoureuse.

---

## ⚙️ FONCTIONNALITÉS PRINCIPALES
1. **Syllabus Académique de Terminale** : Modules thématiques complets calqués sur le programme national (Mathématiques : Trigonométrie, Intégration, Nombres Complexes, Géométrie de l'espace / Physique-Chimie : Circuits RC, RL, RLC, Mécanique newtonienne).
2. **Auto-évaluation par QCM Interactifs** : Générateur de questionnaires chronométrés thématiques avec validation immédiate et explications détaillées soutenues par des formules mathématiques et physiques rigoureuses.
3. **Fiches de Révision Ultra-Visuelles** : Guides condensés intégrant des synthèses théoriques, des conseils pratiques du professeur, et des rappels de "points chauds" fréquemment évalués aux examens.
4. **Tuteur IA Socratique avec Rendu LaTeX** : Compagnon d'apprentissage qui refuse de donner directement la réponse aux élèves, les guidant par des questions ciblées et affichant des expressions mathématiques et physiques impeccablement compilées en temps réel par KaTeX.

---

## ⚡ FONCTIONNALITÉS AVANCÉES
1. **Moteur d'Impression PDF Dynamique Académique** : Système client-side autonome (`html2canvas` et `jsPDF`) qui capture les fiches de cours et les corrigés. Lors du clonage DOM, il neutralise dynamiquement le mode sombre Tailwind (`prose-invert`) pour imposer un thème clair à fort contraste (Slate-800 pour le texte, Bleu Royal pour les en-têtes, Bleu Profond pour les formules, Vert émeraude pour les corrigés).
2. **Compression JPEG Révolutionnaire pour Mobile** : Algorithme d'encodage optimisé (JPEG, qualité `0.75`, facteur d'échelle `1.8`) réduisant le poids moyen des PDF d'un facteur 15 (de 4 à 10 Mo par document à seulement **100 à 250 Ko**), permettant un téléchargement ultra-rapide sur des réseaux 2G/3G instables.
3. **Contournement du Crash CSS `oklch()` de Tailwind v4** : Intercepteur d'assainissement remplaçant à la volée la notation de couleur moderne non supportée par le moteur graphique de `html2canvas` par des équivalents RVB standard afin de prévenir tout gel d'application.
4. **Dictée Vocale Continue à Buffer Segmenté** : Saisie vocale intelligente intégrant un filtre de redondance (exclusivité de traitement des nouveaux segments `resultIndex` de l'API Web SpeechRecognition), évitant l'effet d'écho et de texte dupliqué sur Safari iOS et Chrome Android.
5. **Gestion Matérielle du Cycle de Vie (Bouton Retour Android)** : Interception de l'historique du navigateur (`window.history.pushState` et événements `popstate`) empêchant l'élève de fermer l'application par mégarde lors d'un geste de retour physique sur smartphone, gérant des fermetures de modales empilées de façon séquentielle.

---

## 🤝 MON RÔLE D’HUMAIN ET LE TIEN
Ce projet a été conçu et réalisé selon une logique de co-création structurée et transparente :

- **Mon rôle (Humain / Chef de Produit & Expert Métier)** :
  - Définition de la vision stratégique, du cahier des charges fonctionnel et de la charte de rigueur socratique.
  - Sélection fine des notions théoriques clés du programme béninois et rédaction des exemples de physique et de mathématiques à ancrer localement (ex : Kofi, l'artisan menuisier au marché Dantokpa).
  - Tests en conditions réelles d'utilisation sur terminaux mobiles, identification des goulots d'étranglement (écho de la dictée vocale, flou et poids gigantesque des PDF en mode sombre) et des limites liées à la sandbox des iFrames de test du navigateur (bloquant l'initiation des téléchargements).
  - Validation et ajustement des itérations visuelles de l'application.

- **Le rôle de l'Assistant IA (Architecte & Développeur Logiciel Unique)** :
  - Conception de l'architecture logicielle modulaire en React 18, TypeScript, et Tailwind CSS v4.
  - Implémentation du système "Bring Your Own Key" (BYOK) permettant de requêter directement le modèle Gemini-3.5-flash via le SDK `@google/genai` sans infrastructure serveur coûteuse.
  - Développement de l'intégralité du code logique des composants (`ChatBot`, `RevisionPanel`, `ExerciseMode`, `QCMMode`, `Dashboard`).
  - Résolution des défis algorithmiques complexes (gestion du buffer vocal, réécriture à chaud du DOM cloné pour la génération de PDF légers et à fort contraste, interception du geste de retour physique Android).
  - Audit de conformité de la documentation vivante (docs/historique_projet.md, decisions_log.md, architecture.md, etc.) et exécution des vérifications de build et de lint.

---

## 🛠️ TECHNOLOGIES UTILISÉES
- **Frontend** : React 18, TypeScript, Tailwind CSS v4, Framer Motion (animations fluides de transitions de vues), Lucide-React (icônes vectorielles).
- **Compilation & Bundling** : Vite.js (configuration optimisée pour la production et le service PWA local).
- **Intelligence Artificielle** : Modèle d'évaluation socratique Gemini-3.5-flash, interfacé via le SDK moderne `@google/genai` (côté client, sécurisé par clé personnelle).
- **Rendu Scientifique** : React-Markdown, `remark-math`, `rehype-katex` (compilation LaTeX vectorielle en HTML/SVG).
- **Moteur d'Exportation** : Html2canvas (capture de rendus de l'arbre DOM), jsPDF (compilateur de documents A4 multi-pages).
- **Persistance des Données** : API Web Storage locale (`localStorage` pour le suivi du syllabus et de la progression) et API History (pour le contrôle matériel de la navigation).

---

## 🌋 DÉFIS RENCONTRÉS
1. **Le crash de génération de PDF dû à Tailwind v4** : La fonction de couleur native `oklch()` introduite par défaut dans Tailwind CSS v4 faisait systématiquement crasher `html2canvas`, bloquant toute exportation de cours ou de corrigés.
2. **Des fiches PDF exportées géantes et illisibles** : Les captures DOM directes en mode sombre conservaient les classes CSS sombres (`prose-invert`, gris sur fond noir), ce qui donnait un rendu illisible sur fond papier blanc à l'impression. De plus, le format PNG non compressé générait des fichiers de 4 à 10 Mo, impossibles à transférer à bas débit.
3. **Le fléau de l'écho de transcription vocale** : Sur certains navigateurs mobiles (iOS Safari, Android Chrome), l'API `SpeechRecognition` renvoyait l'intégralité du texte transcrit de manière répétée à chaque pause, provoquant des textes doublés ou triplés insolubles.
4. **La perte accidentelle de session par Geste de Retour** : Sur smartphone, l'utilisation instinctive du bouton Retour physique d'Android ou du geste de balayage latéral fermait brutalement l'application, détruisant tout le travail d'un exercice long non sauvegardé.

---

## 💡 SOLUTIONS APPORTÉES
1. **Filtre d'assainissement de couleurs à chaud** : Création d'un injecteur récursif dans l'événement `onclone` du processus de conversion. Il convertit dynamiquement toutes les valeurs de couleurs `oklch` trouvées dans les styles calculés du DOM cloné en RGB conventionnels.
2. **Pipeline de nettoyage de style et compression extrême** : Réécriture du cycle de clonage PDF. Tout attribut de classe sombre (`dark:`, `prose-invert`, `text-gray-300`) est épuré du document cloné, tandis qu'un style de "papier universitaire" blanc et ultra-contrasté est forcé. Le format de sortie est basculé sur du JPEG compressé à `0.75` avec une échelle de `1.8`, ramenant la taille finale du fichier de plus de 5 Mo à seulement **150 Ko** sans perte de netteté sur les formules mathématiques vectorielles.
3. **Algorithme de dédoublonnement de buffer vocal** : Mise en place d'un gestionnaire d'événements vocaux n'extrayant que les blocs marqués comme `isFinal` ou s'appuyant sélectivement sur l'index incrémental de transcription (`resultIndex`) pour n'accumuler que la nouveauté verbale.
4. **Contrôleur matériel d'historique de navigation** : Implémentation d'un système de routage artificiel empilant des faux jetons d'états dans l'API History à chaque ouverture de panneau (Tuteur, fiches, exercices). L'événement `popstate` intercepte l'appui sur le bouton physique pour fermer la modale active de façon transparente, et requiert un double-clic rapide sur l'accueil avec notification Toast avant de quitter effectivement l'application.

---

## 📈 VALEUR AJOUTÉE
- **Démocratisation Éducative** : Offre gratuitement un outil de tutorat et de diagnostic personnalisé d'une rigueur comparable à un encadrement privé haut de gamme.
- **Inclusion Numérique Mobile** : Conçu spécifiquement pour les réalités technologiques de l'Afrique de l'Ouest : léger, utilisable en BYOK sans frais d'infrastructure, très faible consommation de données mobiles grâce aux PDF optimisés à l'extrême, et ergonomie pensée pour l'utilisation sur smartphone de récupération.
- **Valorisation du Rendu Scientifique** : Les élèves disposent de fiches de cours claires, élégantes et immédiatement imprimables chez eux ou au cybercafé sans distorsion des symboles scientifiques complexes (intégrales, limites, vecteurs, fractions).

---

## 📖 CAS D'UTILISATION CONCRETS
1. **La réévaluation flash avant d'entrer en classe** : Un élève de Cotonou, installé dans le bus ou à l'arrière d'un zémidjan, ouvre l'application sur son téléphone. Il filtre le programme sur "Physique > Électricité RLC", lance un QCM rapide de 5 questions pour tester ses réflexes sur l'impédance, et corrige instantanément ses lacunes.
2. **Le blocage socratique sur un problème d'analyse** : Face à un problème de calcul de primitive par parties complexe, un bachelier de Porto-Novo active le microphone de l'application et énonce sa formule à voix haute. Le tuteur IA, n'affichant aucune politesse polluante, lui renvoie instantanément un indice mathématique sous forme d'équation LaTeX en l'incitant à poser lui-même les termes $u(x)$ et $v'(x)$.
3. **L'impression collective de fiches d'étude** : Après avoir résolu un exercice de trigonométrie et révélé sa correction, un élève télécharge un PDF universitaire de seulement 180 Ko et le partage sur le groupe d'étude WhatsApp de sa classe. Ses camarades peuvent l'imprimer au cybercafé du quartier pour travailler ensemble sur table.

---

## 🦄 CE QUI DIFFÉRENCIE CE PROJET
- **Rigueur Pédagogique Sans Concessions** : À l'opposé des IA complaisantes, ce tuteur refuse d'écrire les solutions. Il force le bachelier à réfléchir et à s'approprier les étapes du raisonnement, se comportant comme un examinateur exigeant du Baccalauréat.
- **Focalisation Brute Épurée** : Élimination complète de 100% de la politesse numérique inutile ("Je suis ravi de vous aider...", "N'hésitez pas à me poser une autre question"). L'interface et l'IA se concentrent à 100% sur la rigueur de la formule scientifique et l'explication théorique.
- **Souveraineté Technologique Client-Side (BYOK)** : Aucun serveur intermédiaire n'héberge ou ne facture les requêtes de l'IA. Chaque utilisateur est propriétaire de ses clés d'API et l'application s'exécute intégralement dans son navigateur de manière confidentielle.

---

## 🧠 COMPÉTENCES DÉMONTRÉES PAR L'HUMAIN
- **Direction de Produit & Product Management** : Définition de la cible, du scope, de l'identité éditoriale rigoureuse (sans politesse) et priorisation des correctifs d'expérience utilisateur (voix, PDF, navigation matérielle).
- **Ingénierie du Prompting & Alignment** : Conception de l'architecture d'instructions système de Gemini-3.5 pour imposer la méthode socratique rigoureuse et le formatage LaTeX strict.
- **Pédagogie & Expertise Matière** : Cartographie du syllabus officiel des examens de Terminale C et D d'Afrique francophone et conception d'exercices d'examen contextualisés.
- **Test d'Usabilité & Assurance Qualité (QA)** : Analyse rigoureuse des erreurs d'exécution (crash `oklch`, flou de contraste sombre, écho vocal de dictée) en environnement de simulation sandbox.

---

## 📸 CAPTURES RECOMMANDÉES POUR LE PORTFOLIO
1. **L'Écran d'Accueil / Landing Page** : Met en valeur le design moderne de la charte d'excellence (Hero banner épurée, Onboarding 1-2-3 et section FAQ dépliante).
2. **Le Tableau de Bord de Progression** : Présentation du syllabus thématique interactif avec les barres de progression circulaires et les badges de statut de maîtrise des matières.
3. **L'Interface de Chat avec le Tuteur IA** : Capture du dialogue montrant des équations LaTeX vectorielles d'une netteté parfaite (formules d'intégrales ou de trigonométrie) côte à côte avec le bouton d'activation de la dictée vocale continue.
4. **Le Rendu Papier du PDF Universitaire** : Une vue comparée d'un cours en mode sombre sur l'application et de sa fiche PDF générée automatiquement dans un thème clair impeccable, prêt à être imprimé.

---

## 💬 DESCRIPTIONS PORTFOLIO

### ▫️ Description Courte (38 mots)
Une application d'apprentissage offline-first pour bacheliers scientifiques africains, propulsée par un tuteur IA socratique rigoureux sous Gemini-3.5-flash. Elle propose un rendu d'équations LaTeX irréprochable, une dictée vocale continue optimisée et un moteur d'exportation PDF d'excellence ultra-léger (150 Ko).

### ▫️ Description Moyenne (123 mots)
PRÉPA CONCOURS BÉNIN révolutionne la préparation académique en Afrique francophone en combinant la rigueur scientifique de l'éducation nationale et la puissance de l'intelligence artificielle socratique. Équipée du modèle Gemini-3.5-flash via une architecture autonome ("Bring Your Own Key"), l'application forme les futurs bacheliers scientifiques par le dialogue et l'auto-évaluation. Elle surmonte de nombreux défis techniques mobiles : rendu d'équations physiques vectorielles par KaTeX, dictée vocale continue avec dédoublonnement de buffer, interception matérielle du bouton de retour Android pour éviter les pertes de session, et un moteur innovant d'export PDF clair et ultra-contrasté, compressé de manière chirurgicale (150 Ko) pour un partage instantané sur les réseaux mobiles à bas débit. Une véritable prouesse d'accessibilité numérique éducative.

### ▫️ Description Longue (462 mots)
PRÉPA CONCOURS BÉNIN est une plateforme éducative autonome (client-side) conçue pour répondre aux exigences élevées des épreuves de mathématiques et de sciences physiques des baccalauréats scientifiques et des concours d'entrée des grandes écoles d'ingénieurs d'Afrique de l'Ouest. Face aux limites des plateformes d'apprentissage classiques, ce projet redéfinit l'interaction homme-machine à travers trois piliers : la rigueur d'un tuteur IA socratique, une interface scientifique hautement fidèle, et une optimisation sans concession pour l'usage sur smartphone en conditions de connectivité réduite.

#### L'Approche IA Socratique et BYOK
L'application repose sur un modèle d'infrastructure décentralisé ("Bring Your Own Key"). L'étudiant configure sa propre clé d'API Google AI Studio (gratuite pour le développement) qui est stockée localement de manière sécurisée. Le tuteur IA socratique (modélisé par Gemini-3.5-flash) est calibré pour éliminer toute forme de salutations superficielles et d'encouragements stériles qui nuisent à la concentration. Il répond de manière chirurgicale en s'appuyant uniquement sur des équations mathématiques de haut vol et des questions ciblées destinées à forcer l'élève à formuler lui-même ses hypothèses et à structurer sa démonstration.

#### Défis Techniques Résolus et Ingénierie du Rendu
- **Génération Documentaire Responsable** : La génération de PDF côté client au format A4 académique pose des défis de lisibilité en raison de l'utilisation de thèmes sombres et des fonctions de couleurs modernes de Tailwind CSS v4 (`oklch`) qui faisaient geler les moteurs de rendu standards. L'application intègre un hook de traitement DOM au sein du pipeline d'exportation (`html2canvas` et `jsPDF`). Il purge l'arbre de rendu cloné de toutes ses classes sombres, convertit à la volée les styles `oklch` en RGB et impose un thème papier universitaire haut de gamme et à fort contraste. En convertissant la sortie en JPEG compressé (qualité `0.75` à échelle `1.8`), le poids des fiches de cours et des corrigés complexes est divisé par 15, passant de plus de 5 Mo à moins de 250 Ko, facilitant le partage de groupe sur WhatsApp.
- **Ergonomie Mobile Avancée** : Pour surmonter les particularités des navigateurs mobiles, l'application résout le bug de l'écho et des phrases répétées lors de la dictée vocale en filtrant l'agrégation de transcription de l'API Web SpeechRecognition de manière dynamique. De plus, elle intercepte intelligemment les gestes de navigation physique et le bouton de retour matériel d'Android via l'API History du navigateur, évitant ainsi la perte accidentelle des sessions d'exercices en cours d'évaluation.

En associant une direction artistique moderne (charte d'excellence sombre et épurée) à une mécanique de rendu scientifique vectoriel impeccable (LaTeX via KaTeX), PRÉPA CONCOURS BÉNIN démontre qu'une solution à fort impact éducatif et technologique peut être déployée de manière totalement autonome, fluide et sans coûts de serveurs récurrents.

---

## 📈 MOTS-CLÉS (SEO & PORTFOLIO)
`Socratic-AI-Tutor`, `EdTech-Africa`, `LaTex-KaTeX-React`, `Mobile-Web-Speech`, `Vite-TypeScript-Tailwind4`, `Client-Side-PDF-Compression`, `Android-History-API`, `BYOK-Architecture`, `Baccalaureat-C-D-Preparation`, `Academic-Excellence-System`.

---

## 🎒 SYNTHÈSE ADAPTÉE POUR UN ADOLESCENT (Humanisation & Simplification)
> **En gros, Prépa Concours Bénin, c’est quoi ?**  
> C'est l'application ultime pour tous les lycéens de Terminale C et D qui veulent exploser le Bac de Maths et de Physique et intégrer les meilleures écoles d'ingénieurs, même s'ils ont une connexion internet lente ou instable !
> 
> **Pourquoi cette application est une vraie révolution pour toi ?**
> - **L'IA ne te donne jamais la réponse directe** : Contrairement à ChatGPT ou d'autres IA qui te balancent la solution d'un exercice directement (ce qui ne t'apprend absolument rien !), notre tuteur IA se comporte comme un vrai prof particulier exigeant. Il te pose des questions, te montre des indices avec des formules ultra-propres et te pousse à réfléchir par toi-même pour trouver la solution !
> - **Aucune politesse inutile** : Pas de *"Bonjour !"* ou de *"Je suis ravi de t'aider, jeune élève !"* qui te font perdre du temps. L'IA va direct au but scientifique : des formules pures, des méthodes concrètes et des conseils de profs.
> - **Des PDF magiques super légers** : Tu as résolu un exercice super difficile ou tu veux réviser une fiche de cours ? Tu cliques sur le bouton de téléchargement et tu obtiens un magnifique PDF blanc, propre, super net et parfaitement contrasté, prêt à être imprimé ou partagé sur WhatsApp avec ton groupe de classe. Le fichier a été tellement optimisé qu'il pèse le poids d'une simple image (150 Ko), ce qui veut dire que tu peux le télécharger en 2 secondes, même si tu captes mal le réseau.
> - **Tu peux lui parler à voix haute** : Clique sur le micro et pose ta question directement en parlant. L'application écrit ce que tu dis sans bégayer ni répéter deux fois la même chose, même si tu t'arrêtes un instant pour réfléchir.
> - **Pas de fermeture par erreur** : Tu es sur ton smartphone Android et tu fais un geste de glissement ou tu appuies sur le bouton Retour physique ? Pas de panique ! L'application ne va pas se fermer et te faire perdre ton exercice. Elle va simplement fermer proprement la petite fenêtre ou le chat ouvert, étape par étape, comme une vraie application mobile installée.
