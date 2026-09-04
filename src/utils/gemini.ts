import { GoogleGenAI, Type } from '@google/genai';
import { getApiKey } from './storage';
import { getUserProfile } from './userProfile';

// Modèles officiels supportés par l'API Gemini (Génération 3)
export const MODEL_FLASH = 'gemini-3.8-flash';
export const MODEL_PRO = 'gemini-3.1-pro-preview';

// Listes de secours automatiques en cas de variation de compte
const FLASH_FALLBACKS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
const PRO_FALLBACKS = ['gemini-3.1-pro-preview', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];

// Détermine l'identifiant exact du modèle Gemini selon le choix de l'utilisateur
export const getActiveModelId = (modelName?: string): string => {
  const profile = getUserProfile();
  const chosen = (modelName || profile.model || 'Gemini 3.8 Flash').toLowerCase();
  if (chosen.includes('pro') || chosen.includes('thinking')) {
    return MODEL_PRO;
  }
  return MODEL_FLASH;
};

// Exécute generateContent avec bascule automatique en cas de modèle indisponible (ex: 404)
async function generateContentWithFallback(ai: GoogleGenAI, preferredModel: string, params: any) {
  const baseCandidates = preferredModel.includes('pro') ? PRO_FALLBACKS : FLASH_FALLBACKS;
  const candidates = Array.from(new Set([preferredModel, ...baseCandidates]));
  let lastError: any = null;

  for (const model of candidates) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err);
      if (
        errMsg.includes('404') || 
        errMsg.includes('not found') || 
        errMsg.includes('no longer available') || 
        errMsg.includes('NOT_FOUND')
      ) {
        console.warn(`Modèle ${model} indisponible (404), bascule vers le suivant...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Initialise le client Gemini. L'utilisateur fournit sa clé via l'interface, on la récupère du localStorage.
// Architecture "Bring Your Own Key" (BYOK) client-side.
const getGenAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API introuvable. Veuillez renseigner votre clé API dans les paramètres.");
  return new GoogleGenAI({ apiKey });
};

// Règles strictes de rendu LaTeX pour l'IA
const LATEX_RULES = `
RÈGLES DE RENDU MATHÉMATIQUE (LaTeX OBLIGATOIRE) :
- TOUTES les expressions mathématiques, équations, fonctions, formules, variables isolées (ex: x, t, y, f(x)), et symboles doivent être écrits en LaTeX.
- Pour les formules ou expressions intégrées au texte (en ligne), utilise impérativement un seul dollar : $expression$ (ex: $5x^2 + 3x$ ou la variable $t$).
- Pour les équations complexes, les fractions, ou les formules importantes, utilise des doubles dollars sur leur propre ligne :
$$
\\frac{15t^2+200}{3t^2+t+5}
$$
- Tout tableau de formules, matrice, système d'équations ou environnement multi-lignes (ex: \\begin{array}, \\begin{cases}, \\begin{matrix}, \\begin{align}) doit IMPÉRATIVEMENT être enveloppé dans des doubles dollars $$ de part et d'autre pour forcer sa compilation correcte par KaTeX (ex: $$\\begin{array}...\\end{array}$$). Ne les écris jamais sans dollars.
- Ne jamais écrire d'expressions mathématiques en texte brut ou de manière simplifiée comme "(15t^2+200)/(3t^2+t+5)". Utilise toujours la notation LaTeX exacte (ex: \\frac{15t^2+200}{3t^2+t+5}).
- N'utilise jamais d'Unicode ou de caractères simples de clavier pour les exposants (n'écris jamais x² mais $x^2$), indices, fractions, racines, intégrales, limites, ou lettres grecques. Représente-les TOUJOURS par leur commande LaTeX correspondante (ex: \\sqrt{x}, \\alpha, \\beta, \\Delta, \\lim_{x \\to 0}).
- Assure-toi que chaque balise de dollar ou double dollar ouverte est fermée correctement.
`;

// Génère une fiche de cours structurée
export const generateRevisionSheet = async (subject: string, chapterTitle: string): Promise<string> => {
  const ai = getGenAIClient();
  const mathRules = subject === 'Mathématiques' ? `
Règles strictes pour la résolution mathématique :
- Montre TOUTES les étapes en détail.
- Pour chaque étape : Explique ce qui est fait ET pourquoi.
- Ne saute jamais d'étapes.
- Utilise une structure claire : Étape 1, Étape 2, Étape 3, etc.
- Ajoute une étape de vérification finale.
- Utilise un langage simple d'abord, puis des explications plus avancées.` : '';

  const prompt = `Tu es un professeur expert en ${subject} pour les élèves de Terminale D et C au Bénin et plus largement pour les étudiants africains.
Tes explications, exemples et exercices doivent être ancrés dans les réalités locales et les contextes africains.
Génère une fiche de révision complète du chapitre : ${chapterTitle}.
La fiche doit contenir :
1. Définitions clés (en gras)
2. Formules essentielles (dans des blocs bien visibles)
3. Propriétés importantes
4. Un exemple résolu étape par étape
5. Les erreurs classiques à éviter
6. Un rappel des points les plus souvent évalués aux examens béninois et régionaux
${mathRules}

${LATEX_RULES}

Utilise un langage clair, adapté à un élève de Terminale. Formate avec des titres, sous-titres et listes en Markdown.`;

  const activeModel = getActiveModelId();
  const response = await generateContentWithFallback(ai, activeModel, {
    contents: prompt,
  });
  
  return response.text ?? "Erreur lors de la génération de la fiche.";
};

// Interface attendue pour les questions QCM
export interface QCMQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

// Génère 5 questions QCM au format JSON strict
export const generateQCM = async (subject: string, chapterTitle: string): Promise<QCMQuestion[]> => {
  const ai = getGenAIClient();
  const mathRules = subject === 'Mathématiques' ? `
Pour les explications mathématiques : montre les étapes et explique le pourquoi, de manière claire.` : '';

  const prompt = `Tu es un examinateur pour le test d'entrée d'une école en Terminale D/C au Bénin (adapté au contexte africain).
Génère 5 questions QCM sur le chapitre : ${chapterTitle} en ${subject}. Les énoncés peuvent inclure des éléments de la vie locale pour plus de pertinence.
Pour chaque question :
- Énoncé clair
- EXACTEMENT 4 choix de réponse qui commencent par A., B., C., D. (ex: "A. 42")
- Indique la bonne réponse (juste la lettre A, B, C ou D)
- Une explication courte de la réponse correcte. ${mathRules}

${LATEX_RULES}`;

  try {
    const activeModel = getActiveModelId();
    const response = await generateContentWithFallback(ai, activeModel, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              choices: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['question', 'choices', 'answer', 'explanation']
          }
        }
      }
    });
    
    if (!response.text) throw new Error("Réponse vide");
    return JSON.parse(response.text) as QCMQuestion[];
  } catch (error) {
    console.error("Erreur QCM:", error);
    throw error;
  }
};

// Génère un exercice ouvert et sa correction
export const generateExercise = async (subject: string, chapterTitle: string): Promise<{ exercise: string, correction: string }> => {
  const ai = getGenAIClient();
  const mathRules = subject === 'Mathématiques' ? `
Lors de la rédaction de la correction pour cet exercice de mathématiques, tu dois OBLIGATOIREMENT respecter les règles suivantes :
- Montre TOUTES les étapes en détail.
- Pour chaque étape : Explique ce qui est fait ET pourquoi.
- Ne saute jamais d'étapes.
- Utilise une structure claire : Étape 1, Étape 2, Étape 3, etc.
- Ajoute une étape de vérification finale à la fin de la correction.
- Utilise un langage simple d'abord, puis des explications plus avancées.` : '';

  const prompt = `Tu es un professeur de ${subject} en Terminale D/C au Bénin et pour tous les élèves africains.
Génère un exercice de difficulté progressive sur le chapitre : ${chapterTitle}. Intègre des éléments pertinents du contexte africain dans l'énoncé si possible (ex: agriculture, économie locale, géographie).
L'exercice doit avoir 3 parties (questions a, b, c de difficulté croissante).
Retourne l'exercice, puis sur une nouvelle ligne écris strictement "---CORRECTION---", puis fournis la correction complète étape par étape de l'exercice. ${mathRules}

${LATEX_RULES}

Format général en Markdown.`;

  const activeModel = getActiveModelId();
  const response = await generateContentWithFallback(ai, activeModel, {
    contents: prompt,
  });
  
  const text = response.text || "";
  const parts = text.split('---CORRECTION---');
  
  if (parts.length >= 2) {
    return { exercise: parts[0].trim(), correction: parts[1].trim() };
  } else {
    return { exercise: text, correction: "La correction a été intégrée dans le texte ci-dessus ou n'a pas pu être séparée correctement." };
  }
};

// Traduit les erreurs de l'API Gemini en messages clairs pour l'élève
export const formatGeminiError = (error: any): string => {
  if (!error) return "Une erreur inattendue est survenue lors de la communication avec l'assistant IA.";
  
  const msg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
  
  if (msg.includes('Clé API introuvable') || msg.includes('API key not found')) {
    return "Clé API Gemini introuvable. Veuillez renseigner votre clé API dans les Paramètres (icône roue crantée).";
  }
  
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || (msg.includes('400') && msg.includes('API key'))) {
    return "Votre clé API Google Gemini est invalide. Rendez-vous dans les Paramètres pour vérifier ou saisir une nouvelle clé valide.";
  }
  
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota') || msg.includes('Quota exceeded')) {
    return "Le quota gratuit de requêtes de votre clé Gemini a été temporairement dépassé (Erreur 429). Patientez 1 à 2 minutes ou utilisez une autre clé API.";
  }

  if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
    return "Accès refusé par Google (Erreur 403). Assurez-vous que votre clé API est bien active sur Google AI Studio.";
  }

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('network') || msg.includes('Load failed')) {
    return "Impossible de joindre les serveurs de Google (Erreur réseau ou extension bloqueuse de requêtes). Vérifiez votre connexion Internet.";
  }

  return `Impossible de joindre le service d'IA : ${msg.slice(0, 160)}`;
};

// Classe utilitaire pour gérer un chat continu
export class ChatSession {
  private chat: any = null;
  private modelName?: string;
  private customInstructions?: string;
  private currentModelIndex = 0;

  constructor(modelName?: string, customInstructions?: string) {
    this.modelName = modelName;
    this.customInstructions = customInstructions;
    try {
      this.initChat();
    } catch (e) {
      console.warn("Initialisation différée du chat (en attente de clé API):", e);
    }
  }

  private getCandidateModels(): string[] {
    const activeModel = getActiveModelId(this.modelName);
    const fallbacks = activeModel.includes('pro') ? PRO_FALLBACKS : FLASH_FALLBACKS;
    return Array.from(new Set([activeModel, ...fallbacks]));
  }

  private initChat(modelOverride?: string) {
    const ai = getGenAIClient();
    const profile = getUserProfile();
    const userDirectives = this.customInstructions || profile.customInstructions || '';
    const candidates = this.getCandidateModels();
    const targetModel = modelOverride || candidates[this.currentModelIndex] || MODEL_FLASH;

    this.chat = ai.chats.create({
      model: targetModel,
      config: {
        systemInstruction: `Tu es un assistant scientifique de haut niveau, expert, direct et rigoureux pour élèves de Terminale D/C et candidats aux concours d'entrée universitaires (Bénin / UEMOA).
${userDirectives ? `Directives personnalisées de l'utilisateur :\n${userDirectives}\n` : ''}
Règles mathématiques et pédagogiques :
- Montre TOUTES les étapes logiques et de calculs avec rigueur et précision.
- Pour chaque étape : Explique ce qui est fait ET pourquoi sans verbiage superflu.
- Ne saute jamais d'étapes.
- Utilise une structure claire : Étape 1, Étape 2, Étape 3, etc.
- Ajoute une étape de vérification finale.
- Ne perds pas de temps avec des civilités inutiles ou des formules de politesse répétitives ("bonjour", "comment puis-je vous aider"). Va directement droit au but scientifique.

${LATEX_RULES}

TU PEUX GÉNÉRER DES FICHES PDF : Si l'utilisateur te demande un résumé ou un document PDF de tes explications, informe-le qu'il peut cliquer sur le bouton "Télécharger PDF" qui apparaît directement en bas de chacune de tes réponses pour obtenir une fiche de révision haute qualité.`
      }
    });
  }

  async sendMessage(message: string): Promise<string> {
    const candidates = this.getCandidateModels();
    let lastError: any = null;

    for (let i = this.currentModelIndex; i < candidates.length; i++) {
      try {
        if (!this.chat || this.currentModelIndex !== i) {
          this.currentModelIndex = i;
          this.initChat(candidates[i]);
        }
        const response = await this.chat.sendMessage({ message });
        return response.text || "";
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        if (
          errMsg.includes('404') || 
          errMsg.includes('not found') || 
          errMsg.includes('no longer available') || 
          errMsg.includes('NOT_FOUND')
        ) {
          console.warn(`Modèle ${candidates[i]} indisponible dans le chat, bascule automatique...`);
          this.chat = null;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }
}

