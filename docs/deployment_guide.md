# Manuel de Déploiement en Production — Prépa Concours

Ce manuel opérationnel décrit les étapes et les contrôles clés à mener à bien pour héberger, promouvoir et sécuriser la PWA Prépa Concours sur un hébergement de production public (ex: Cloud Run, Vercel, Netlify, Firebase Hosting, etc.).

---

## 🏗️ BUILD ET ASSEMBLAGE DES ACTIFS

Avant tout déploiement, vous devez nettoyer et générer les actifs à l'aide de l'outil de build :

```bash
# Compilation et compression de production
npm run build
```
Cette action rassemble :
*   Les scripts minifiés dans le répertoire `/dist`.
*   Le script de Service Worker auto-généré pour le cache et l'étude hors-ligne.
*   Le manifest d'installabilité mobile (`manifest.webmanifest`).

---

## 🌐 SÉCURISATION ET CONFIGURATION INTERNET (HTTPS & DOMAINE)

Pour activer toutes les capacités de Progressive Web App (PWA), votre environnement d'hébergement **doit** impérativement répondre aux paramètres de sécurité réseau suivants :

1.  **HTTPS Strict Obligatoire (SSL)** :
    *   Le Service Worker **ne démarrera pas** et refusera d'enregistrer les caches ou l'installabilité sur les téléphones si l'URL finale ne débute pas par `https://` (seule exception tolérée en développement sur `http://localhost`).
2.  **Redirection Systématique** : Configurez votre serveur ou CDN pour réacheminer automatiquement l'ensemble du trafic HTTP simple vers HTTPS.

---

## 📈 PARMÈTRES DE PERFORMANCE (PWA & SEO)

*   **PWA Cache** : Le plugin de build applique une stratégie de mise en cache automatique des images et des feuilles de styles des symboles de dérivation vectorielle et trigonométriques.
*   **Balises de Partage Social (Open Graph)** : Les métadonnées de liaison de titre, de résumé d'études et d'icône d'invitation sont nativement ancrées au niveau de l'en-tête pour afficher de magnifiques cartes d'invitations sur WhatsApp, X, Facebook, ou lors de réceptions par SMS.

---

## 📊 ANALYTICS, MONITORING ET SAUVEGARDES

1.  **Monitoring de Disponibilité** : Il est recommandé de coupler un outil de ping silencieux (ex: UptimeRobot) pour détecter d'éventuels temps d'indisponibilité de votre CDN ou de votre hôte d'application.
2.  **Sauvegardes de Configuration** : Les fiches de bilans scolaires des élèves étant gérées de manière décentralisée au sein des terminaux locaux (`localStorage`), aucune sauvegarde de base de données globale n'est de rigueur historique. Pour les mises à jour majeures, le composant de PWA s'assure de sauvegarder l'ensemble de ces états d'études locaux pour éviter toute perte de progression.
