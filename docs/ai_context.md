# Mémoire Stratégique et Contexte IA — Prépa Concours

Ce document sert de source unique de vérité quant à la stratégie de modélisation de l'intelligence artificielle, des prompts directifs, des choix ergonomiques et des hypothèses de conception du projet.

---

## 🎯 PROMPTS MAJEURS ET STRATÉGIES DE CONTEXTUALISATION

### 1. Le Tuteur IA Socratique (Mode Exercice Guidé)
Le tuteur ne doit jamais donner la réponse directement à l'élève. Il doit le guider par le questionnement (méthode socratique).

*   **Prompt système de base (`src/utils/gemini.ts`)** :
    ```text
    Tu es un tuteur d'élite spécialisé dans le programme officiel de Terminale D et C du Bénin (Mathématiques et Physique-Chimie).
    Ton objectif absolu est de guider l'élève sans JAMAIS lui donner la solution directement.
    Tu dois utiliser la méthode socratique : pose des questions courtes, pousse l'élève à réfléchir sur ses formules, valide ou corrige chaque étape de son raisonnement de manière constructive.
    ```
*   **Justification du choix** : Les élèves ont tendance à solliciter l'IA uniquement pour obtenir des réponses toutes faites sans effort intellectuel. La méthode de maïeutique socratique garantit un apprentissage actif et durable.

### 2. Le Mode QCM Interactif (Validation Active)
L'IA évalue les réponses textuelles ou à choix multiples fournies par l'élève de manière rigoureuse, en expliquant le calcul physique ou mathématique étape par étape sous forme logique.

---

## 🔬 CHOIX ET ARCHITECTURE IA

### Modèle Sélectionné : `models/gemini-3.5-flash`
*   **Pourquoi ce choix ?** Offre le meilleur compromis entre la rapidité de réponse (essentielle pour un tuteur interactif sur terminal mobile), le faible coût de traitement de jetons, et de remarquables aptitudes de raisonnement logique/mathématique par rapport aux anciennes générations.
*   **Alternatives rejetées** :
    *   *Gemini Pro* : Jugé trop lent pour les dialogues interactifs rapides et nécessitant trop de ressources sur les connexions mobiles bas de gamme en zone rurale.
    *   *Modèles locaux de petite taille (ex: Gemma en WebGPU)* : Trop gourmands en termes de batterie de téléphone et incompatibles avec de multiples modèles d'Android plus anciens.

---

## 🎨 SYSTÈME D’EXPÉRIENCE UTILISATEUR (UX)

### 1. Clé API Personnelle (BYOK — Bring Your Own Key)
*   **Pourquoi ?** Permet à l'application de s'exécuter de façon entièrement gratuite pour l'éditeur du produit, tout en responsabilisant l'apprenant qui maîtrise sa propre consommation d'API sans coûts d'abonnements opaques.
*   **Choix d'interface** : Un écran d'onboarding clair et guidé en français montrant l'obtention de la clé.

### 2. Saisie Vocale Directe (Audio API)
*   **Pourquoi ?** Les élèves éprouvent de grandes difficultés à écrire de longues équations mathématiques complexes au clavier tactile. La synthèse ou dictée vocale résout ce frein d'usage.

---

## 🌍 STRATÉGIE SEO & BRANDING

*   **Identité textuelle** : Utiliser la terminologie rigoureuse du programme éducatif béninois (ex: Terminale D/C, syllabi officiels, épreuves de baccalauréat type Bénin).
*   **Branding** : Éviter les dénominations hyper-futuristes ou techniques froides. Préférer "Prépa Concours", chaleureux et inspirant l'excellence académique pour les bacheliers.

---

## ⚠️ HYPOTHÈSES DE CONCEPTION ET LIMITES REJETÉES

- **Base de données cloud globale multi-utilisateur** : Rejetée au profit du stockage persistant local exclusif (`localStorage`). Cela préserve entièrement la vie privée du bachelier, n'exige aucun compte ou mot de passe fastidieux à configurer, et évite les failles de base de données volumineuses.
