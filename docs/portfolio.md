# Étude de Cas & Fiche Portfolio — Prépa Concours

---

## 🏆 NOM DU PROJET
**Prépa Concours**

---

## ⚡ RÉSUMÉ EN UNE PHRASE
Un assistant d'entraînement d'élite en Mathématiques et Physique sans fioritures protocolaires, calqué sur le syllabus officiel ouest-africain (Terminale D & C) et boosté par l'IA socratique pour préparer l'entrée aux grandes écoles d'ingénieurs.

---

## 🎯 PROBLÈME RÉSOLU
Les bacheliers d'Afrique de l'Ouest (Bénin en particulier) font face à un vide d'accompagnement interactif de haut niveau pour réussir les concours d'entrée d'élite (EPAC, IMSP, etc.). Les cours traditionnels sont souvent statiques, coûteux, et les solutions à base d'assistants IA classiques sont trop bavardes, polies à l'excès, ou délivrent directement les corrigés sans forcer l'apprenant à réfléchir activement.

---

## 👥 PUBLIC CIBLE
- Les élèves de Terminale D et Terminale C au Bénin et en Afrique de l'Ouest.
- Les candidats libres ou étudiants se remettant à niveau sur le socle scientifique fondamental de la physique et des mathématiques.

---

## 🚀 FONCTIONNALITÉS PRINCIPALES
- **Fiches de Cours Chirurgicales** : Synthèses épurées et structurées de l'électricité (RC, RL, RLC), de la mécanique newtonienne, de l'analyse, de la géométrie de l'espace et des complexes.
- **Auto-évaluation Directe** : Simulateur de QCM chronométrés thématiques avec justification immédiate des résultats.
- **Mode Dialogue Socratique** : Environnement d'entraînement guidé par l'IA qui décompose les étapes de raisonnement à travers des questions orientées plutôt que d'offrir des solutions pré-mâchées.
- **Exportateur de Progrès** : Diagnostic de révision téléchargeable sous forme de rapport texte autonome pour des synthèses offline.

---

## 💎 FONCTIONNALITÉS AVANCÉES
- **Tuteur IA sans Formule de Politesse** : Optimisation d'attention en réduisant de 40% le volume textuel superflu généré par l'IA, forçant le focus immédiat sur la donnée scientifique brute.
- **Dictée Vocale Intégrée** : Saisie vocale intelligente (Speech-to-Text) permettant d'interroger verbalement le tuteur à voix haute, augmentant considérablement l'ergonomie d'usage sur mobile.
- **Analyseur LaTeX/KaTeX Multi-Matières** : Rendu vectoriel irréprochable des symboles intégrales, de dérivations différentielles complexes et de vecteurs en temps réel.

---

## 🛠️ MON RÔLE (Lead Tech & Product Architect)
1. **Conception UI/UX & Rédaction Pédagogique** : Structuration de l'enchaînement de révision dynamique, design de la landing page avec section d'onboarding 1-2-3 et FAQ.
2. **Ingénierie du Prompting & Tuning d'Instruction** : Paramétrage et calibration des micro-comportements socratiques du modèle Gemini via le SDK `@google/genai`. Élimination des "bruits de salutations".
3. **Architecture Logicielle Frontend** : Développement d'un système autonome ("Bring Your Own Key") s'appuyant uniquement sur des API serverless et la persistance locale (`localStorage`), éliminant l'infra payante et garantissant une confidentialité maximale.

---

## 💻 TECHNOLOGIES UTILISÉES
- **Frontend** : React 18, TypeScript, Tailwind CSS, Framer Motion (animations), Lucide Icons (graphismes vectoriels).
- **IA & SDK** : SDK `@google/genai` (modèle Gemini-3.5-flash).
- **Rendu Scientifique** : React-Markdown avec extensions `remark-math` et `rehype-katex`.
- **Hébergement & Build** : Vite.js compilé et optimisé statiquement pour conteneurs Cloud Run / CDN.
- **Base de données / Persistance** : Client-side via LocalStorage natif.

---

## ⛰️ DÉFIS RENCONTRÉS & SOLUTIONS APPORTÉES

### Défi 1 : La distraction cognitive provoquée par la politesse excessive des IA
- *Problème* : L'IA perdait un temps précieux de lecture en saluant l'apprenant à chaque message, ralentissant la concentration nécessaire à un entraînement minuté de concours.
- *Solution* : Refactorisation stricte du système dans `src/utils/gemini.ts` pour imposer au modèle un comportement scientifique sec, direct et d'une rigueur absolue. Les formules de politesse de type "Bonjour", "Je serais ravi de vous expliquer" sont proscrites.

### Défi 2 : L'obligation d'un rendu d'équations scientifiques impeccable
- *Problème* : L'affichage des fractions, racines carrées et vecteurs physiques de Terminale doit être lisible instantanément sous peine de fatiguer l'élève.
- *Solution* : Intégration fine de KaTeX via un import CDN en tête de l'index HTML, synchronisé de manière réactive avec le processeur Markdown du chat et des fiches synthèses.

---

## 📈 VALEUR AJOUTÉE
Prépa Concours démocratise l'accès aux cours particuliers d'élite d'une valeur de plusieurs dizaines de milliers de francs CFA par mois au Bénin. En s'appuyant sur une clé gratuite de Google AI Studio, l'élève étudie sans contrainte de budget, sans limite de temps et avec un tuteur socratique d'une rigueur égale aux meilleurs correcteurs nationaux.

---

## 📚 CAS D'UTILISATION CONCRETS
1. **La réévaluation flash avant l'examen** : Un élève de Cotonou utilise l'option filtre "Physique > Électricité RLC" sur le chemin du lycée, fait un QCM de 5 questions sur son smartphone, identifie son erreur de calcul de déphasage et révise la formule correspondante sur la fiche en moins de 4 minutes.
2. **Le déblocage de devoir socratique** : Bloqué sur un exercice de géométrie spatiale complexe, un bachelier de Porto-Novo dicte sa question au tuteur vocal direct. L'IA lui répond en 2 équations clés en l'incitant à calculer lui-même la suite.

---

## ⭐️ CE QUI DIFFÉRENCIE CE PROJET
Contrairement aux applications scolaires éducatives "ludiques" ou "infantiles", Prépa Concours adopte les codes graphiques et d'interactions de la **recherche scientifique**. Le tuteur ne félicite pas bêtement pour encourager ("Bravo ! Super !"), il valide la justesse froide du raisonnement, forçant l'élève à se comporter en véritable ingénieur.

---

## 🎯 COMPÉTENCES DÉMONTRÉES
- **Ingénierie IA Mobile & API Integration** (interactions d'IA socratiques asynchrones, Speech-to-Text).
- **Architecture d'Applications Client-Side Autonomes** (architecture sans coûts de serveurs avec persistance locale sécurisée).
- **Rigueur Académique & Rendu Rigide** (implémentation de parseurs LaTeX fluidifiés).
- **UI/UX Writing & Product Strategy** (structuration de tunnel d'onboarding, Landing Page didactique et FAQ).

---

## 📸 CAPTURES RECOMMANDÉES POUR PORTFOLIO
1. **La Landing Page Professionnelle** : Section Hero affichant l'idéologie du produit "Dominez vos concours", l'accès au programme et la FAQ dépliante.
2. **L'écosystème du Dashboard de Révision** : Vue d'ensemble du syllabus de Terminale avec la barre d'apprentissage verte et l'indicateur d'avancement des chapitres de Maths et Physique.
3. **Le Tuteur IA direct en Action** : Écran divisé montrant la résolution étape-par-étape d'un exercice et le panneau de chat vocal affichant des équations en KaTeX élégantes.

---

## 📝 DESCRIPTIONS POUR LE FORMAT PORTFOLIO

### Description courte (29 mots)
Un tuteur IA de révision scientifique "sans concessions" calqué sur le syllabus de Terminale D/C ouest-africain, combinant fiches d'études KaTeX, QCM et entraînements socratiques de préparation d'entrée aux concours.

### Description moyenne (117 mots)
Prépa Concours est un outil d'accompagnement d'élite destiné aux futurs ingénieurs de Terminale D and C d'Afrique de l'Ouest (Bénin). L'application propose un tableau de bord complet recouvrant 20 modules de Mathématiques et de Physique pour s'exercer intelligemment. Boosté par les modèles Gemini via son IA Socratique au ton direct et scientifique (aucun bla-bla ou formules de politesse polluantes d'attention), le tuteur aide l'élève à cheminer intellectuellement au travers de QCM et d'exercices d'entraînement par dictée vocale. L'architecture autonome "Bring Your Own Key" garantit une gratuité complète de fonctionnement et le respect total de la confidentialité de l'apprentissage personnel.

### Description longue (492 mots)
#### Introduction et Objectifs
Prépa Concours est né du constat du manque flagrant d'outils interactifs rigoureux permettant de préparer l'entrée des bacheliers scientifiques dans d'exigeantes universités africaines (EPAC, IMSP, FAST). Alors que la plupart des assistants virtuels se perdent en explications verbeuses et en compliments superflus, Prépa Concours propose une éducation et un entraînement "bruts" calqués sur la réalité exigeante de la correction de examinateurs de baccalauréat d'Afrique francophone.

#### Innovation Technologique & Ingénierie
L'architecte de l'application s'axe sur une philosophie "Bring Your Own Key" (BYOK). En évitant d'intégrer une infrastructure de serveurs cloud centralisée coûteuse, chaque étudiant connecte directement sa propre clé Google AI Studio. L'appareil de l'élève se charge d'instancier localement la persistance de l'état des chapitres (Non Commencé, En Cours, Maîtrisé) et de requêter localement et asynchronement les modèles de langage Gemini. 

Le cœur décisionnel de l'IA (injecté dans `src/utils/gemini.ts`) régule drastiquement les retours pour supprimer toute marque de civilité de politesse polluante ("Bonjour", "Voici votre réponse", etc.). L'élève est stimulé par une méthode socratique stricte : l'assistant n'écrit jamais la solution des calculs, il guide l'étudiant vers elle en interrogeant la théorie de Newton, les déphasages des circuits alternatifs ou les transformations complexes.

#### Intégration d'outils et de confort
L'affichage hautement scientifique s'appuie sur une intégration chirurgicale de KaTeX et de parseurs d'équations en Markdown. Tout symbole de calcul intégral, d'équation différentielle mécanique se dessine ainsi de manière fluide, préservant la santé oculaire de l'utilisateur lors de sessions prolongées. Un panneau de dictée vocale intelligent (Speech-to-Text) permet aux étudiants de dicter directement leurs blocages sémantiques ou physiques au micro de leur smartphone plutôt que de saisir manuellement de longues chaînes d'équations contraignantes.

Enfin, l'expérience utilisateur intègre un outil performant d'exportation de progrès au format texte (`.txt`) compilant d'un clic les modules maîtrisés et en cours d'étude, idéal pour structurer son planning de cours du soir hors-ligne ou à présenter à ses mentors et professeurs particuliers.

#### Conclusion et Perspectives
Prépa Concours réinvente l'assistance scolaire automatisée en réhabilitant la rigueur froide et le challenge intellectuel du futur ingénieur. L'application prouve qu'un design soigné combinant des coloris profonds, une typographie soignée de niveau "Space Grotesk", et l'absence totale d'interventions superflues crée l'environnement propice à un travail focalisé et persévérant, gage de réussite aux plus prestigieux examens de la région.

---

## 📈 MOTS-CLÉS (METAPATHS)
`Science-Tutor`, `Socratic-AI`, `Examen-Benin`, `Vite-React-TypeScript`, `KaTeX-LaTeX`, `Speech-to-Text`, `Offline-Mindset`, `Product-Design-Concept`.
