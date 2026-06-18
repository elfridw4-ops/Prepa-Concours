# Registre des Variables d'Environnement — Prépa Concours

Ce fichier liste de manière unifiée toutes les variables de configuration réseau ou de clés de chiffrement et d'IA consommées par l'application pour des usages spécifiques.

---

## 🔑 VARIABLES DISPONIBLES ET USAGES

### 1. `GEMINI_API_KEY` (Saisie Client / BYOK facultative au Runtime)
*   **Description** : Clé privée confidentielle permettant d'accéder aux capacités cognitives des LLM de Google.
*   **Emplacement recommandé** : Saisie sécurisée par l'utilisateur directement depuis l'interface d'authentification et sauvegardée chiffrée ou en clair dans son stockage de navigateur local (`localStorage.setItem('gemini_api_key', value)`).
*   **Option de Secours** : Elle peut être définie dans un fichier système de variables d'environnement confidentiel si vous déployez une version d'école publique béninoise centralisée sans clé individuelle.
*   **Caractère Obligatoire** : Oui, indispensable pour poser des questions de cours physiques ou lancer des entraînements conversationnels interactifs de haut niveau.

---

## 🛡️ RÈGLES DE SÉCURITÉ CONCERNANT LES SECRETS

1.  **Ne Jamais Archiver Vos Clés** : Il est formellement interdit d'ajouter en clair une clé d'API personnelle ou de production dans ce dépôt de code (ne pas en ajouter dans les scripts, codes sources, ou dans les fiches d'architecture de `/docs`).
2.  **Ignorer les Fichiers Personnels** : Veillez à ce que le fichier local `.env` soit correctement listé dans votre fichier bloquant de référentiel `.gitignore` afin d'éviter les poussées accidentelles sur des hébergements publics de code (ex: GitHub).
