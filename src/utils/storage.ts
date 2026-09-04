export type ChapterStatus = 'Non commencé' | 'En cours' | 'Maîtrisé';

export type ChapterProgress = {
  status: ChapterStatus;
  qcmScore?: number; // Score in percentage
};

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const PROGRESS_STORAGE_KEY = 'app_progress';

// --- API Key Management ---

// Nettoie la clé API pour éviter les caractères invalides (ex: guillemets intelligents, espaces insécables)
export const cleanApiKey = (key: string): string => {
  if (!key) return '';
  let clean = key.trim();
  // Supprimer les guillemets simples/doubles ordinaires ou intelligents au début/fin
  clean = clean.replace(/^['"“‘\s]+|['"”’\s]+$/g, '');
  // Filtrer pour ne garder que les caractères ASCII imprimables (évite les erreurs ISO-8859-1 de Headers)
  clean = clean.replace(/[^\x20-\x7E]/g, '');
  return clean.trim();
};

// Sauvegarde la clé API dans le localStorage
export const saveApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, cleanApiKey(key));
};

// Récupère la clé API depuis le localStorage ou les variables d'environnement
export const getApiKey = (): string | null => {
  const key = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (key) return cleanApiKey(key);
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey) return cleanApiKey(envKey);
  return null;
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

// Réinitialise l'ensemble de la progression
export const resetProgress = () => {
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
};
