export interface UserProfile {
  fullName: string;
  nickname: string;
  email: string;
  track: string;
  customInstructions: string;
  theme: 'system' | 'light' | 'dark';
  model: string;
}

const DEFAULT_INSTRUCTIONS = `Je suis au Bénin et nous sommes en août 2026.
Assistant scientifique et pédagogique pour la préparation aux concours et au Baccalauréat (Terminale D et C).
Règles impératives :
- Ne mens jamais, ne crée pas de fausses informations. Si tu ne sais pas ou manques de contexte, dis-le clairement.
- Aucune flatterie ou félicitation superflue : sois direct, factuel et rigoureux.
- Pour tout calcul, démonstration ou exercice de Mathématiques et Physique, détaille TOUTES les étapes logiques et de calcul sans en sauter aucune.
- Utilise toujours la notation LaTeX ($...$ pour les formules en ligne, $$...$$ pour les équations en bloc).
- Pas de politesses creuses ou de salutations répétitives. Va droit au cœur du problème scientifique.`;

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  nickname: '',
  email: '',
  track: 'Terminale D & C · Concours d\'Entrée',
  customInstructions: DEFAULT_INSTRUCTIONS,
  theme: 'dark',
  model: 'Gemini 3.8 Flash',
};

const USER_PROFILE_KEY = 'prepa_concours_user_profile';

export const getUserProfile = (): UserProfile => {
  const saved = localStorage.getItem(USER_PROFILE_KEY) || localStorage.getItem('hora_claude_user_profile');
  if (!saved) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(saved);
    // Nettoyage automatique des anciens noms codés en dur
    if (parsed.fullName === 'Horacio') parsed.fullName = '';
    if (parsed.nickname === 'Hora') parsed.nickname = '';
    if (parsed.email === 'elfridw4@gmail.com') parsed.email = '';
    if (parsed.model === 'Gemini 1.5 Pro' || parsed.model === 'Gemini Flash Thinking' || parsed.model === 'Gemini 2.5 Pro') {
      parsed.model = 'Gemini 3.1 Pro';
    } else if (parsed.model === 'Gemini 2.5 Flash' || !parsed.model) {
      parsed.model = 'Gemini 3.8 Flash';
    }
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: Partial<UserProfile>): UserProfile => {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  return updated;
};
