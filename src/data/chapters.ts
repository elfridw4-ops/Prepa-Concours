export type Chapter = {
  id: string;
  title: string;
  subject: 'Mathématiques' | 'Physique';
};

export const chapters: Chapter[] = [
  // Mathématiques
  { id: 'math-suites', title: 'Suites numériques (arithmétiques, géométriques)', subject: 'Mathématiques' },
  { id: 'math-limites', title: 'Limites et continuité', subject: 'Mathématiques' },
  { id: 'math-derivation', title: 'Dérivation et étude de fonctions', subject: 'Mathématiques' },
  { id: 'math-integration', title: 'Intégration', subject: 'Mathématiques' },
  { id: 'math-log-exp', title: 'Logarithmes et exponentielles', subject: 'Mathématiques' },
  { id: 'math-trigo', title: 'Trigonométrie', subject: 'Mathématiques' },
  { id: 'math-complexes', title: 'Nombres complexes', subject: 'Mathématiques' },
  { id: 'math-geo', title: 'Géométrie dans l\'espace', subject: 'Mathématiques' },
  { id: 'math-probas', title: 'Probabilités et statistiques', subject: 'Mathématiques' },
  { id: 'math-denombrement', title: 'Dénombrement (combinatoire)', subject: 'Mathématiques' },

  // Physique
  { id: 'phys-meca', title: 'Mécanique : cinématique et dynamique du point', subject: 'Physique' },
  { id: 'phys-newton', title: 'Lois de Newton', subject: 'Physique' },
  { id: 'phys-energie', title: 'Travail et énergie (travail d\'une force, énergie cinétique, potentielle)', subject: 'Physique' },
  { id: 'phys-oscillations', title: 'Oscillations mécaniques (pendule, ressort)', subject: 'Physique' },
  { id: 'phys-elec', title: 'Électricité : circuits RC, RL, RLC', subject: 'Physique' },
  { id: 'phys-alternatif', title: 'Courant alternatif sinusoïdal', subject: 'Physique' },
  { id: 'phys-optique', title: 'Optique géométrique (lentilles, miroirs)', subject: 'Physique' },
  { id: 'phys-ondes', title: 'Ondes mécaniques et sonores', subject: 'Physique' },
  { id: 'phys-nucleaire', title: 'Physique nucléaire (radioactivité, fission, fusion)', subject: 'Physique' },
  { id: 'phys-thermo', title: 'Thermodynamique (premier principe, gaz parfaits)', subject: 'Physique' },
];
