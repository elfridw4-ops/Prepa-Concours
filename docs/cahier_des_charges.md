# Cahier des Charges — Prépa Concours

## 🌟 Vision du Projet
Prépa Concours est une plateforme web d'apprentissage intensive et sur-mesure pour les élèves de Terminale D et C en République du Bénin et Afrique de l'Ouest. Elle combine la clarté d'un syllabus structuré et la puissance adaptative de modèles génératifs de pointe pour maximiser les d'admissions des lycéens aux examens nationaux et concours d'élites scientifiques.

---

## 📥 Invite Initiale à l'Origine du Projet
> "Créer un assistant de révision interactif pour les élèves de Terminale (Mathématiques et Physique) préparant leurs examens et concours d'entrée dans les universités d'excellence (Bénin, programme local)."

---

## 🎯 Exigences Fonctionnelles (Functional Requirements)

1. **Système de Diagnostic des Chapitres**
   - Division claire par matières (Mathématiques et Physique).
   - Module de suivi du statut d'apprentissage par chapitre : *Non commencé*, *En cours*, *Maîtrisé*.

2. **Fiches de Synthèse Pédagogiques**
   - Contenu condensé affichant les théorèmes majeurs, formules indispensables et schémas d'esprit. Heuristique claire basée sur les réalités académiques de la zone ouest-africaine.

3. **Générateur de QCM Interactifs**
   - Création de questions à choix multiples adaptées au niveau requis par les épreuves d'entrée.
   - Système de rétroaction directe (feedback immédiat pour chaque question plutôt qu'en fin de test uniquement).

4. **Entraînement aux Exercices Types**
   - Résolution progressive assistée par l'intelligence artificielle.
   - Méthode socratique : L'IA ne donne pas la réponse finale mais guide l'élève vers elle à l'aide de questions d'orientation et de rappels de cours.

5. **Interface d'Onboarding et Apprentissage (Landing Page)**
   - Une vitrine d'accueil complète et explicative pour rassurer les élèves et parents sur l'adéquation au programme officiel (Terminale D & C).
   - Accès distinct au programme de révision et au panneau de FAQ.

6. **Tuteur IA Vocal Rapide**
   - Assistant conversationnel directement accessible, libéré de toutes formules de politesse protocolaires.
   - Support d'entrée vocale via dictée native (Speech-to-Text).

---

## 🛡️ Exigences Non Fonctionnelles (Non-Functional Requirements)

1. **Performance & Légèreté**
   - Temps d'affichage initial de la landing page inférieur à 1s.
   - Fluidité d'interactions instantanée lors du passage d'un filtre à l'autre ou du déploiement d'une carte de cours.

2. **Sécurité et Respect de la Vie Privée**
   - Stockage local intégral des clés API personnelles Google AI Studio. Aucun serveur tiers n'intercepte la clé.
   - Conservation locale des statistiques de révision (respect du RGPD et protection des données des élèves).

3. **Éco-Conception de l'attention**
   - Les réponses doivent être concises pour réduire l'énergie d'attention nécessaire par session de travail.

---

## 🚧 Contraintes Techniques & Commerciales

- **Dépendance API Externe** : Nécessite une clé d'API valide Google Gemini pour que les fonctionnalités d'IA (exercices socratiques complexes et tuteur vocal) fonctionnent à 100%. L'interface se charge de guider l'élève pour la configurer simplement.
- **Rendu Mathématique** : Limitation aux polices mathématiques légères pour l'affichage de LaTeX sur les navigateurs mobiles des élèves disposant parfois de connexions asymétriques à débit restreint (notamment en mobilité urbaine/rurale au Bénin).
