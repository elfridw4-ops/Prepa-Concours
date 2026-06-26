import { GoogleGenAI, Type } from '@google/genai';
import { getApiKey } from './storage';

// Constante pour le modèle standard (plus rapide pour les QCM et révisions)
const STANDARD_MODEL = 'gemini-3.5-flash';

// Initialise le client Gemini. L'utilisateur fournit sa clé via l'interface, on la récupère du localStorage.
// ATTENTION : Cette architecture "Bring Your Own Key" (BYOK) est exceptionnelle pour ce projet client-side only.
const getGenAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API introuvable.");
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

  const response = await ai.models.generateContent({
    model: STANDARD_MODEL,
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
    const response = await ai.models.generateContent({
      model: STANDARD_MODEL,
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
    throw new Error("Impossible de générer le QCM. Veuillez vérifier votre clé API ou réessayer plus tard.");
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

  const response = await ai.models.generateContent({
    model: STANDARD_MODEL,
    contents: prompt,
  });
  
  const text = response.text || "";
  const parts = text.split('---CORRECTION---');
  
  if (parts.length >= 2) {
    return { exercise: parts[0].trim(), correction: parts[1].trim() };
  } else {
    // Si le modèle n'a pas respecté le séparateur
    return { exercise: text, correction: "La correction a été intégrée dans le texte ci-dessus ou n'a pas pu être séparée correctement." };
  }
};

// Classe utilitaire pour gérer un chat continu
export class ChatSession {
  private chat;

  constructor() {
    const ai = getGenAIClient();
    this.chat = ai.chats.create({
      model: STANDARD_MODEL,
      config: {
        systemInstruction: `Tu es un assistant pédagogique expert en Mathématiques et Physique pour les élèves de Terminale D et C au Bénin et en Afrique.
Une plateforme intelligente et ancrée dans le contexte local africain. 
Tu aides l'élève à comprendre les concepts, corriger ses erreurs, et se préparer à son test d'entrée.
Tu réponds toujours en français, avec des exemples concrets du programme et des réalités africaines.
IMPORTANT : Ne sois pas formel. Ne perds pas de temps avec des salutations ou des formules de politesse du type "Bonjour", "Comment puis-je vous aider", "Voici la réponse", etc. Va directement droit au but et donne la réponse ou l'explication directement.

Si l'étudiant te pose une question de Mathématiques ou de Physique, ou te demande de résoudre un exercice :
- Montre TOUTES les étapes en détail.
- Pour chaque étape : Explique ce qui est fait ET pourquoi.
- Ne saute jamais d'étapes.
- Utilise une structure claire : Étape 1, Étape 2, Étape 3, etc.
- Ajoute une étape de vérification finale.
- Utilise un langage simple d'abord, puis des explications plus avancées.

${LATEX_RULES}

TU PEUX GÉNÉRER DES FICHES PDF : Si l'utilisateur te demande un résumé ou un document PDF de tes explications, informe-le qu'il peut cliquer sur le bouton "Télécharger PDF" qui apparaît directement en bas de chacune de tes réponses dans l'interface de chat pour obtenir une fiche de révision haute qualité.

Tu ne traites pas de sujets hors mathématiques et physique Terminale D/C.`
      }
    });
  }

  async sendMessage(message: string): Promise<string> {
    const response = await this.chat.sendMessage({ message });
    return response.text || "";
  }
}
