export type ChapterStatus = 'Non commencé' | 'En cours' | 'Maîtrisé';

export type ChapterProgress = {
  status: ChapterStatus;
  qcmScore?: number; // Score in percentage
};

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const PROGRESS_STORAGE_KEY = 'app_progress';

// --- API Key Management ---

// Sauvegarde la clé API dans le localStorage
export const saveApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

// Récupère la clé API depuis le localStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

// Supprime la clé API
export const clearApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// --- Progress Management ---

// Récupère la progression globale
export const getProgress = (): Record<string, ChapterProgress> => {
  const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

// Met à jour le statut d'un chapitre
export const updateChapterStatus = (chapterId: string, status: ChapterStatus) => {
  const progress = getProgress();
  if (!progress[chapterId]) {
    progress[chapterId] = { status };
  } else {
    progress[chapterId].status = status;
  }
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

// Met à jour le score QCM d'un chapitre
export const updateChapterScore = (chapterId: string, score: number) => {
  const progress = getProgress();
  if (!progress[chapterId]) {
    progress[chapterId] = { status: 'En cours', qcmScore: score };
  } else {
    progress[chapterId].qcmScore = score;
    // Si le score est bon, on peut auto-marquer comme maîtrisé
    if (score >= 80) progress[chapterId].status = 'Maîtrisé';
    else if (progress[chapterId].status === 'Non commencé') progress[chapterId].status = 'En cours';
  }
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};
