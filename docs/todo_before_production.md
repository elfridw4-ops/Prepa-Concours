# Checklist de Validation Avant Mise en Production — Prépa Concours

Ce guide d'ingénierie fournit la checklist obligatoire des validations de performance, de sécurité, de SEO, d'accessibilité et de conformité légale à exécuter avant toute mise en ligne officielle de l'application Prépa Concours.

---

## 🎯 CHECKLIST STRATÉGIQUE ET OPÉRATIONNELLE

### 🔒 1. Sécurité et Gestion des Secrets
- [ ] Confirmer que la clé d'API personnelle de secours de déploiement (le cas échéant) n'est pas poussée ou lisible en clair dans le code déployé.
- [ ] Vérifier que le protocole de liaison réseau HTTPS est actif sur l'ensemble de la chaîne d'envoi et de réception pour prémunir des cyberattaques.

### 📈 2. Progressive Web App (PWA) & Intégration Mobile
- [ ] Vérifier que le fichier `manifest.webmanifest` est lu sans erreur d'alignement d'icônes par le validateur système d'audit (ex: Google Lighthouse).
- [ ] Tester de manière empirique l'installabilité de l'application sur un terminal Android et iOS réel.
- [ ] Évaluer l'usage hors-ligne en mode avion : S'assurer que les fiches de cours synthétisées de mathématiques et de physique s'affichent correctement grâce aux caches préalablement mémorisés.

### 🌍 3. SEO, Analyse et Transfert de Marque
- [ ] Valider que les balises Open Graph et Twitter Cards se propagent convenablement sur les outils de debugging de partage social.
- [ ] Inspecter la présence d'une balise d'en-tête maîtresse `<h1>` et de balises secondaires structurantes `<h2>` de façon sémantique et conforme.

### ♿ 4. Accessibilité et Confort Visuel
- [ ] Valider que le ratio de contraste des polices sombres du dark mode est adéquat pour les apprenants déficients visuels ou s'exerçant tard le soir sans éclairage.
- [ ] Assurer des zones de cliquabilité confortables pour les élèves d'au moins `44px` de diamètre tactile sur l'ensemble des boutons de navigation des chapitres de cours.

### ⚖️ 5. Conformité Légale (Code du Numérique Béninois)
- [ ] Ajouter un lien accessible vers la Politique de Confidentialité explicitant le mode d'utilisation entièrement local et sécurisé du stockage d'apprentissage (localStorage).
- [ ] Rédiger les Conditions Générales d'Utilisation rappelant le positionnement d'aide de l'outil d'intelligence artificielle Gemini de Google.
