# Charte Graphique — PRÉPA CONCOURS BÉNIN
> Un système de design d'excellence, rigoureux et autonome pour les futurs bacheliers scientifiques africains.

**Version :** 1.1  
**Thème :** Multi-thème (Dark par défaut / Light / High Contrast)  
**Dernière mise à jour :** 1er Juillet 2026  

---

## 📌 Table des matières
1. [Vision & Philosophie Artistique](#1-vision--philosophie-artistique)
2. [Palette de Couleurs (Thématisation)](#2-palette-de-couleurs-thématisation)
3. [Typographie & Échelle de Texte](#3-typographie--échelle-de-texte)
4. [Système d'Espacement & Densité](#4-système-despacement--densité)
5. [Bordures & Coins Arrondis (Border Radius)](#5-bordures--coins-arrondis-border-radius)
6. [Composants UI & États Interactifs](#6-composants-ui--états-interactifs)
7. [Directives du Logo](#7-directives-du-logo)
8. [Iconographie & Symbolisme](#8-iconographie--symbolisme)
9. [Surfaces & Élévation (Z-index)](#9-surfaces--élévation-z-index)
10. [Traitement de l'Imagerie & Particules](#10-traitement-de-limagerie--particules)
11. [Layout & Comportements Responsive](#11-layout--comportements-responsive)
12. [Do's & Don'ts (Règles d'Or)](#12-dos--donts-règles-dor)
13. [Accessibilité & Inclusion Numérique](#13-accessibilité--inclusion-numérique)
14. [Éléments à Définir (Feuille de Route)](#14-éléments-à-définir-feuille-de-route)
15. [Tokens CSS — Quick Start](#15-tokens-css--quick-start)

---

## 1. Vision & Philosophie Artistique

L'identité de **PRÉPA CONCOURS BÉNIN** repose sur l'**Élite, l'Énergie Scientifique et la Rigueur**. Contrairement aux applications éducatives classiques qui utilisent des couleurs enfantines ou des illustrations génériques, notre système adopte une direction sobre, inspirée des environnements de développement professionnels et des publications universitaires de haut niveau.

### Les 3 Piliers du Design :
- **Clarté Brute (Anti-bruit)** : Aucun artifice visuel inutile, aucune formule de politesse superflue. La mise en page met immédiatement en avant les données scientifiques brutes et les équations.
- **Contraste & Éco-Conception** : Une base sombre profonde (`Dark Slate`) par défaut pour réduire la fatigue oculaire lors des sessions de révision nocturnes, combinée à une thématisation fluide pour l'apprentissage en plein soleil ou l'impression noir et blanc (thème `Light` et `High Contrast`).
- **Netteté Mathématique** : Les formules physiques et équations mathématiques complexes restent fluides et vectorielles grâce au rendu de KaTeX et à un moteur d'exportation PDF d'excellence.

---

## 2. Palette de Couleurs (Thématisation)

Le système de couleurs est dynamique et gère trois thèmes natifs : **Dark** (par défaut), **Light** (scolaire / d'impression), et **High Contrast** (accessibilité).

### A. Thème Sombre : "Dark Abyss" (Par Défaut)
Le thème par défaut est optimisé pour les écrans OLED et la révision nocturne intensive.

| Nom Sémantique | Valeur HEX | Token CSS | Rôle Primaire | Restrictions | Niveau d'Autorité |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Abyss Base** | `#020617` | `--color-gray-950` | Fond d'écran global (Canvas) | Ne jamais appliquer sur les cartes | Principale (Fond) |
| **Slate Surface** | `#0f172a` | `--color-gray-900` | Fond des cartes et panneaux | Ne pas surélever sans bordure | Principale (Surface) |
| **Slate Border** | `#1e293b` | `--color-gray-800` | Bordures de division et séparation | Ne pas utiliser comme texte | Secondaire |
| **Slate Muted** | `#334155` | `--color-gray-700` | États inactifs, icônes décoratives | Contraste insuffisant pour texte standard | Secondaire |
| **Pure White** | `#ffffff` | `--color-gray-50` | Titres majeurs, textes à fort focus | Ne pas appliquer sur de longs paragraphes | Principale (Texte) |
| **Electric Blue** | `#2563eb` | `--color-blue-600` | Actions principales (CTA), boutons actifs | Ne pas utiliser pour du texte informatif | Décorative / Action |
| **Teal Breeze** | `#10b981` | `--color-green-500` | Statut "Maîtrisé", scores excellents (>80%) | Ne pas utiliser pour des boutons primaires | Sémantique |
| **Amber Warning** | `#f59e0b` | `--color-yellow-500`| Score moyen (50% - 80%), attention | Ne pas utiliser sur fond blanc | Sémantique |
| **Crimson Error** | `#ef4444` | `--color-red-500` | Score faible (<50%), alertes critiques | Ne pas appliquer en dehors des erreurs | Sémantique |

### B. Thème Clair : "Academic Paper" (Thème d'Impression)
Sélectionné par le bouton thème ou injecté à la volée par le moteur d'impression PDF pour garantir un rendu d'encre irréprochable au cybercafé.

| Nom Sémantique | Valeur HEX | Rôle Primaire | Niveau d'Autorité |
| :--- | :--- | :--- | :--- |
| **Paper Canvas** | `#f8fafc` | Fond d'écran et arrière-plan global | Principale |
| **Paper Card** | `#ffffff` | Fond des fiches de cours et des questions | Principale |
| **Paper Divider** | `#e2e8f0` | Bordures et lignes de séparation de cours | Secondaire |
| **Ink Text** | `#0f172a` | Texte des cours et équations LaTeX (Noir d'encre) | Principale (Texte) |
| **Royal Blue** | `#1e3a8a` | Titres des sections et en-têtes d'excellence | Sémantique / Accent |
| **Emerald Correct**| `#047857` | Formules correctes, corrigés détaillés imprimés | Sémantique |

### C. Thème Haute Visibilité : "High Contrast" (Accessibilité)
Pour les bacheliers malvoyants ou les conditions lumineuses extérieures extrêmes.

| Nom Sémantique | Valeur HEX | Rôle Primaire | Niveau d'Autorité |
| :--- | :--- | :--- | :--- |
| **Solid Black** | `#000000` | Fond global et surfaces uniques | Principale |
| **Pure White** | `#ffffff` | Textes standards, bordures de composants | Principale (Texte) |
| **Neon Yellow** | `#ffff00` | Mises en valeur, termes d'équations clés | Sémantique / Accent |

---

## 3. Typographie & Échelle de Texte

Le système utilise la police **DM Sans** importée via Google Fonts pour son équilibre parfait entre modernité géométrique et haute lisibilité sur terminal mobile d'entrée de gamme.

- **Police Primaire :** `DM Sans` (Google Fonts)
- **Substituts de Secours :** `ui-sans-serif`, `system-ui`, `sans-serif`
- **Police Monospace (Sciences & TeX) :** `JetBrains Mono` / `SFMono-Regular` (pour le rendu du code de configuration, des scores mathématiques et l'isolation des variables d'équations).

### Poids de Police utilisés :
1. **Regular (400)** : Pour le corps de texte des fiches de cours de physique et mathématiques.
2. **Medium (500)** : Pour les textes d'interface utilisateur, labels et prompts du chatbot.
3. **Bold (700)** : Pour les sous-titres, les titres de cartes et les badges de progression.
4. **Black (900)** : Exclusivement réservé aux en-têtes de sections et au slogan de la page d'accueil (Hero Title).

### Échelle Typographique (Tokens) :

| Rôle | Taille (px) | Line-height | Letter-spacing | Token CSS | Règle de Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `3.75rem` (60px) | `1.1` | `-0.025em` | `text-6xl font-black` | Resserrement fort pour éviter le flottement |
| **Section Title**| `1.875rem` (30px) | `1.2` | `-0.02em` | `text-3xl font-bold` | Resserrement moyen |
| **Card Title** | `1.125rem` (18px) | `1.3` | `-0.01em` | `text-lg font-semibold`| Équilibre lisibilité / compacité |
| **Body text** | `0.875rem` (14px) | `1.5` | `0` | `text-sm font-normal` | Espacement standard pour de longs paragraphes |
| **Helper Label**| `0.75rem` (12px) | `1.4` | `0.025em` | `text-xs font-medium` | Légèrement aéré pour lisibilité |
| **Micro Caption**| `0.625rem` (10px) | `1.4` | `0.05em` | `text-[10px]` | Uniquement pour métadonnées techniques |

---

## 4. Système d'Espacement & Densité

Notre système est conçu selon une grille de base de **4px** (`0.25rem`). Cela permet une adaptabilité chirurgicale sur de petits écrans (smartphones de 5 pouces).

- **Densité Globale :** *Comfortable* sur tablette/ordinateur, basculant automatiquement sur *Compact* sur mobile via des paddings conditionnels (ex : `p-3 sm:p-5 sm:p-12`).

### Échelle d'Espacement :

| Token Tailwind | Valeur Rem | Valeur Pixels | Usage Recommandé |
| :--- | :--- | :--- | :--- |
| `space-1` | `0.25rem` | 4px | Espacement interne très serré (Badge, micro-icône) |
| `space-2` | `0.5rem` | 8px | Écart entre l'icône et le texte d'un bouton |
| `space-3` | `0.75rem` | 12px | Espacement interne sur mobile (Cards, inputs compacts) |
| `space-4` | `1rem` | 16px | Padding standard d'éléments, écarts entre boutons de cartes |
| `space-6` | `1.5rem` | 24px | Padding des cartes principales de chapitre |
| `space-8` | `2rem` | 32px | Écart vertical entre les sections du tableau de bord |
| `space-12`| `3rem` | 48px | Espacement entre les modules du syllabus officiel |
| `space-16`| `4rem` | 64px | Écart externe de la section Hero de la page de garde |

---

## 5. Bordures & Coins Arrondis (Border Radius)

La rigueur de la structure scientifique est renforcée par des bords arrondis généreux mais géométriques.

- **Règle Globale :** Les angles des cartes et des boutons sont harmonisés pour créer des îlots de contenu compacts.
- **Exceptions :** Les inputs textuels ont un arrondi plus fin pour marquer visuellement la zone de saisie.

| Élément | Valeur (px) | Token Tailwind | Rationale de Design |
| :--- | :--- | :--- | :--- |
| **Bouton Principal** | `12px` | `rounded-xl` | Sensation d'interaction moderne, agréable sous le pouce |
| **Carte Chapitre** | `12px` | `rounded-xl` | Encadrement parfait et solide des matières |
| **Boîte de Saisie / Input** | `8px` | `rounded-lg` | Rigueur et précision technique de saisie de texte |
| **Badge Statut** | `6px` | `rounded-md` | Ultra-compact, ne doit pas ressembler à un bouton |
| **Panneau Flottant (Modal)** | `24px` | `rounded-3xl` | Isole visuellement le contenu au premier plan |

---

## 6. Composants UI & États Interactifs

### A. Bouton Principal (Primary Action)
Bouton d'appel à l'action majeur de l'application (ex : "Accéder au Programme", "Soumettre").

- **Background :** `#2563eb` (`--color-blue-600`)
- **Couleur Texte :** `#ffffff` (`--color-gray-50`)
- **Taille & Poids Police :** `14px` (`text-sm font-semibold`)
- **Padding :** `14px top/bottom, 24px left/right` (`py-3.5 px-6`)
- **Radius / Ombre :** `rounded-xl` / Ombre portée douce : `shadow-lg shadow-blue-900/30`
- **Comportement des États :**
  - **Default :** S'affiche avec une transition fluide de 150ms.
  - **Hover / Focus :** `#3b82f6` (éclaircissement bleu, translation négative de 1px `-translate-y-0.5`).
  - **Active :** Réduction de taille de 2% (`scale-98`) pour simuler un bouton physique enfoncé.
  - **Disabled :** Fond `#1e293b` (Slate-800), texte `#64748b` (Slate-500), curseur `not-allowed`.
  - **Loading :** Remplacement du texte par un spinner SVG vectoriel tournant blanc.

### B. Bouton Secondaire (Secondary Action / Réviser)
Bouton d'action complémentaire de navigation ou de consultation (ex : "Réviser").

- **Background :** `#1e293b` (`--color-gray-800`)
- **Couleur Texte :** `#cbd5e1` (`--color-gray-600` / Gray-200)
- **Taille & Poids Police :** `14px` (`text-sm font-medium`)
- **Padding :** `10px top/bottom, 12px left/right` (`py-2.5 px-3`)
- **Bordure :** Aucun contour en mode sombre, contour léger en mode clair.
- **Comportement des États :**
  - **Default :** Intégration neutre dans la carte.
  - **Hover / Focus :** `#334155` (Slate-700), texte plus vif `#f1f5f9`.
  - **Active :** `scale-98` instantané.
  - **Disabled :** Opacité réduite à `0.4`, curseur interdit.

### C. Carte de Chapitre (Chapter Card)
Le bloc d'affichage central qui présente un module d'apprentissage du programme.

- **Background :** `#0f172a` (`--color-gray-900`)
- **Bordure :** `1px border-gray-800`
- **Padding :** `20px` (`p-5`)
- **Radius :** `rounded-xl`
- **Comportement des États :**
  - **Default :** Rendu mat, contrasté.
  - **Hover :** La bordure passe à `border-gray-700` pour attirer le regard lors du survol.
  - **Active / Selected :** Contour d'action d'accent bleu.

### D. Boîte de Recherche / Zone de Clé API
- **Background :** `#020617` (`--color-gray-950` / Fond sombre)
- **Bordure :** `1px border-gray-800`
- **Couleur Texte :** `#ffffff` (`placeholder-gray-500`)
- **Radius :** `rounded-lg`
- **Comportement des États :**
  - **Focus-visible :** Bordure lumineuse `border-blue-500` et anneau d'accent interne `ring-1 ring-blue-500`.

---

## 7. Directives du Logo

Le logo **PRÉPA CONCOURS** incarne l'élitisme et la réussite académique. Il est composé d'une marque textuelle et d'un emblème vectoriel intégré.

```
[ EMBLEME : Chapeau Universitaire en forme de flèche ascendante d'Excellence ]
    🎓 PREPA CONCOURS (Titre, font-sans font-bold)
```

### Règles d'Usage :
- **Variante Standard :** Gradient horizontal de gauche à droite de `Bleu Électrique` à `Teal Breeze` (`from-blue-400 to-green-400`).
- **Variante Iconique (Favicon) :** Un chapeau universitaire stylisé bleu et émeraude sur fond noir circulaire.
- **Zone de Protection :** Un espace libre minimal équivalent à la hauteur du logo (24px) doit l'isoler de tout autre texte de navigation.
- **Interdictions Majeures :**
  - ❌ Ne jamais déformer le ratio largeur/hauteur du logo.
  - ❌ Ne jamais ajouter d'ombres portées multicolores ou de reflets 3D.
  - ❌ Ne jamais inclure le slogan en sous-titre si l'espace du header est inférieur à 640px.

---

## 8. Iconographie & Symbolisme

Toutes les icônes de l'application proviennent exclusivement de la bibliothèque **Lucide-React** pour garantir une cohérence parfaite et un poids de chargement minimal.

- **Style :** Traits géométriques fins (*Outline*).
- **Épaisseur de trait (Stroke Width) :** Toujours fixée à `1.5px` ou `2px` maximum pour une netteté cristalline sur écran Retina.
- **Sémantique d'Usage des Icônes :**
  - `GraduationCap` / `BookOpen` : Symbolise le savoir académique, le cours théorique.
  - `Brain` / `Target` : Désigne le tuteur socratique, la réflexion autonome.
  - `Mic` / `MicOff` : Contrôle de la dictée vocale instantanée.
  - `Zap` : Représente la vitesse de calcul, l'entraînement chronométré.
  - `Download` / `FileText` : Exportations et documents PDF téléchargeables.
  - `CheckCircle` (Émeraude) : Validation et maîtrise absolue d'une matière.

---

## 9. Surfaces & Élévation (Z-index)

La hiérarchie visuelle est construite sur un empilement tridimensionnel strict. L'élévation n'est pas simulée par des ombres portées floues mais par des **teintes de fond contrastées et des bordures**.

| Niveau de Surface | Rôle | Couleur de Fond (Dark) | Bordure | Z-Index |
| :--- | :--- | :--- | :--- | :--- |
| **Surface 0 (Canvas)**| Fond d'application complet | `#020617` (Gray-950) | Aucune | `z-0` |
| **Surface 1 (Cards)** | Îlots de contenu, chapitres | `#0f172a` (Gray-900) | `1px border-gray-800`| `z-10` |
| **Surface 2 (Header)**| Barre de navigation collante | `#0f172a/50` + flou | `1px border-gray-800`| `z-30` |
| **Surface 3 (Modal)** | Modales de QCM ou d'Exercice | `#0f172a` (Gray-900) | `1px border-gray-800`| `z-40` |
| **Surface 4 (Toasts)** | Invitations matérielles, Toast | `#1e293b` (Gray-800) | `1px border-blue-500`| `z-50` |

---

## 10. Traitement de l'Imagerie & Particules

Conformément à nos principes d'éco-conception et d'anti-slop technologique, l'imagerie décorative lourde est interdite.

- **Fonds Ambiants :** Utilisation exclusive de gradients radiaux cachés à opacité ultra-faible (ex : `bg-blue-500/10 rounded-full blur-3xl`) pour simuler une diffusion de lumière en arrière-plan sans perturber la lisibilité du texte.
- **Rendu Vectoriel Mathématique :** L'unique élément graphique majeur réside dans la compilation KaTeX. Les formules de mathématiques et de physique sont traitées comme de véritables illustrations à valoriser.

---

## 11. Layout & Comportements Responsive

L'application s'adapte de manière transparente d'un écran de smartphone d'entrée de gamme à un écran d'ordinateur ultra-large de bureau.

- **Largeur Maximale (Max-Width) :** `max-w-7xl mx-auto` (1280px) pour éviter que le contenu ne s'étire indéfiniment.
- **Grille Adaptative (Bento Grid) :**
  - **Mobile (< 640px) :** 1 colonne pour les chapitres de cours afin d'offrir des cibles tactiles minimales de 44px de hauteur.
  - **Tablette (640px - 1024px) :** 2 colonnes avec paddings réduits.
  - **Desktop (> 1024px) :** 3 colonnes, révélant le bento grid complet avec barres de progression circulaires latérales.

---

## 12. Do's & Don'ts (Règles d'Or)

### ✅ Do's :
1. **Utiliser KaTeX pour toute expression scientifique** : Toujours encapsuler les variables mathématiques ou physiques dans des délimiteurs dollar (ex : `$x^2$`) pour forcer un rendu vectoriel irréprochable.
2. **Maintenir la dictée vocale continue** : S'assurer que le micro ne se coupe pas lors de silences inférieurs à 5 secondes pour laisser l'élève réfléchir.
3. **Tester les exports PDF hors iFrame** : Ouvrir l'application dans un onglet autonome pour contourner les politiques de sécurité des iFrames de test du navigateur.
4. **Vider le buffer socratique** : Supprimer toute forme de salutations de l'IA (bonjour, cordialement) pour focaliser 100% de l'attention de l'étudiant.
5. **Préserver le bouton Retour Android** : Empiler les panneaux ouverts dans l'historique HTML5 pour qu'un balayage tactile ferme la fenêtre active plutôt que de quitter l'application.
6. **Imposer un thème clair sur le clone DOM PDF** : Garantir que les fiches de révision soient téléchargeables en format blanc ultra-contrasté, évitant le gouffre d'encre noire lors de l'impression au cybercafé.
7. **Fournir des alternatives textuelles aux formules** : Compléter les formules KaTeX par des explications verbales claires pour les élèves lisant via un synthétiseur vocal.

### ❌ Don'ts :
1. **Ne jamais utiliser d'images d'illustration de stock** : Préférer de simples icônes Lucide précises pour éviter d'alourdir l'application.
2. **Ne jamais faire clignoter l'interface lors de modifications** : Éliminer les rechargements d'HMR inutiles lors des transitions de révision.
3. **Ne jamais utiliser de styles de couleur OKLCH v4 pour le moteur de PDF** : Éviter le crash irrémédiable de l'exportation sur mobile en forçant des codes couleurs HEX ou RGB conventionnels.
4. **Ne jamais laisser de textes doublés lors de la saisie vocale** : Filtrer le buffer de transcription avec rigueur pour écarter l'écho de Safari iOS.
5. **Ne jamais afficher de données de diagnostic système brutes** : Supprimer les logs de ports, containers ou d'état de ping dans les marges pour préserver la dignité académique de l'interface.
6. **Ne jamais écraser l'historique d'apprentissage de l'étudiant** : Utiliser un stockage `localStorage` robuste et persistant pour ne jamais décourager l'élève.
7. **Ne jamais donner la solution d'un exercice dès le premier message** : L'IA doit poser des questions de cours pour guider l'élève vers la découverte de la formule.

---

## 13. Accessibilité & Inclusion Numérique

Le système applique scrupuleusement les exigences de niveau **WCAG 2.1 AA** pour garantir l'inclusion de tous les étudiants.

### 📊 Contrastes calculés :
- **Texte Standard sur fond Abyss Base (Dark) :** `#ffffff` sur `#020617` = **19.8:1** (Dépasse largement le ratio AAA de 7:1).
- **Texte Standard en mode Light (Academic) :** `#0f172a` sur `#f8fafc` = **15.6:1** (Excellent pour l'impression papier).
- **Bouton d'Action Bleu sur fond Abyss Base :** Contraste renforcé par une bordure d'accent et une lueur douce de focalisation.

### ♿ Règles de Navigation :
- **Focus Ring visible :** Tout bouton ou champ de saisie actif reçoit un anneau d'accent bleu de `2px` d'épaisseur avec un décalage (*offset*) de `2px` pour rester repérable au clavier.
- **Anti-stuttering KaTeX :** La classe `.katex-mathml` est strictement masquée (`display: none !important`) pour empêcher les lecteurs d'écran et les navigateurs d'énoncer ou d'afficher deux fois de suite les mêmes expressions physiques.

---

## 14. Éléments à Définir (Feuille de Route)

Les aspects suivants de la charte de design restent à stabiliser avec l'équipe produit lors des prochaines itérations :

- [ ] **Couleur Sémantique Spécifique pour les Quiz de Chimie Organique** (Actuellement partagée avec la Physique).
- [ ] **Variante de Chapeau Universitaire en format SVG Pur Native** (Pour s'affranchir de la dépendance de l'icône Lucide `GraduationCap` dans les documents imprimés).
- [ ] **Animation de pulsation socratique** : Définir la courbe de transition exacte de Framer Motion pour la bulle d'attente de réflexion de l'IA.
- [ ] **Poids de police exact pour les exposants KaTeX** (Ajuster la taille relative des indices pour les terminaux à très faible densité de pixels).

---

## 15. Tokens CSS — Quick Start

Voici la configuration des variables globales à copier-coller dans votre fichier de variables ou à intégrer dans le fichier de thème global :

```css
:root {
  /* Échelle de Couleurs Sombre d'Origine (Dark Abyss) */
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  
  --color-gray-950: #020617;
  --color-gray-900: #0f172a;
  --color-gray-800: #1e293b;
  --color-gray-700: #334155;
  --color-gray-600: #cbd5e1;
  --color-gray-500: #64748b;
  --color-gray-400: #475569;
  --color-gray-300: #334155;
  --color-gray-200: #1e293b;
  --color-gray-100: #f8fafc;
  --color-gray-5: #ffffff;

  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-green-400: #4ade80;
  --color-green-500: #10b981;
  
  /* Paramètres physiques des conteneurs */
  --radius-button: 12px;
  --radius-card: 12px;
  --radius-panel: 24px;
}

/* Thème d'Impression & Scolaire */
.theme-light {
  --color-gray-950: #f8fafc;
  --color-gray-900: #ffffff;
  --color-gray-800: #f1f5f9;
  --color-gray-700: #e2e8f0;
  --color-gray-600: #cbd5e1;
  --color-gray-500: #64748b;
  --color-gray-400: #475569;
  --color-gray-300: #334155;
  --color-gray-200: #1e293b;
  --color-gray-100: #0f172a;
  --color-gray-5: #020617;
  
  --color-blue-600: #1e3a8a; /* Bleu royal d'encre */
}

/* Thème Haute Visibilité Extérieure */
.theme-hc {
  --color-gray-950: #000000;
  --color-gray-900: #000000;
  --color-gray-800: #000000;
  --color-gray-700: #ffffff;
  --color-gray-600: #ffffff;
  --color-gray-500: #ffff00;
  --color-gray-400: #ffff00;
  --color-gray-300: #ffff00;
  --color-gray-200: #ffffff;
  --color-gray-100: #ffffff;
  
  --color-blue-600: #0055ff;
}
```
