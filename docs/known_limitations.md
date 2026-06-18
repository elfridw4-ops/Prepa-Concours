# Journal des Limitations Connues et Dettes Techniques — Prépa Concours

Ce journal recense de manière lucide et transparente les limites applicatives, les compromis de conception consentis et les plans d'atténuation correspondants.

---

## 🛑 BUGS ET LIMITATIONS MOBILES IDENTIFIÉS ET ATTÉNUÉS

### 1. Rendu d'équations LaTeX imbriquées (KaTeX)
*   **Limitation historique** : Certains jetons de retour des modèles LLM présentaient des duplications et bégaiements inesthétiques (ex: duplication du texte entourant la formule, genre `ln ln` ou `λλ`).
*   **Action corrective menée** : Utilisation d'un ciblage CSS ultra-précis désactivant le balisage MathML superflu généré par KaTeX (`.katex-mathml { display: none !important }`), et restriction de la bulle de chat à une largeur réactive plus confortable de 85% de l'écran.
*   **Résultat** : Un affichage d'équations mathématiques net sans aucune duplication ou télescopage.

### 2. Téléchargement de fichiers bloqué au sein des cadres iFrames (Sandbox)
*   **Limitation intrinsèque** : La génération de documents PDF complexes côté client (avec `jsPDF` et `html2canvas`) initiée depuis un site embarqué dans une `iframe` sécurisée/sandboxée peut être bloquée ou rendue silencieuse par la politique de sécurité du navigateur de l'hôte (absence de la directive `allow-downloads` dans l'attribut `sandbox` de l'iFrame parente).
*   **Contournement utilisateur** : L'étudiant doit simplement ouvrir l'application en dehors de la sandbox (en plein écran) dans un onglet autonome du navigateur en cliquant sur le bouton de défilement de lien direct en haut à droite de l'iFrame, ou via son URL de production partagée. Les téléchargements de fiches de révisions s'exécutent alors instantanément et à 100% de performance.

---

## 🔩 DETTE TECHNIQUE ET ARCHITECTURALE

### 1. Utilisation exclusive de `localStorage` pour les données d'études
*   **Compromis** : Ce choix technologique de stockage local évite d'orchestrer d'encombrantes infrastructures de bases de données cloud, simplifiant l'architecture et préservant à 100% la vie privée des étudiants.
*   **Limitation associée** : Si un élève change de terminal mobile (ex: passage d'un smartphone Android à une tablette Windows locale), son historique d'avancement d'études de terminale ne se synchronisera pas automatiquement, sauf s'il recourt à l'outil système d'exportation de bilan que nous avons implémenté.
*   **Amélioration future possible** : Ajouter un connecteur de synchronisation décentralisé optionnel (IndexedDB couplé à un import/export crypté de fichier de sauvegarde).
