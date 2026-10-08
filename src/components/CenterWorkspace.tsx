import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { 
  Send, 
  Mic, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Loader2, 
  Plus,
  BookOpen,
  Calculator,
  FileText,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { ChatSession, formatGeminiError } from '../utils/gemini';
import { getUserProfile, saveUserProfile } from '../utils/userProfile';
import { exportElementToA4PDF } from '../utils/pdfExport';
import { AppLogo } from './AppLogo';

// Nettoie le Markdown pour une copie presse-papier propre
const cleanMarkdownForClipboard = (text: string): string => {
  return text
    .replace(/\$\$(.*?)\$\$/gs, '$1')
    .replace(/\$(.*?)\$/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();
};

const copyMessageToClipboard = async (text: string): Promise<boolean> => {
  try {
    const cleanText = cleanMarkdownForClipboard(text);
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(cleanText);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = cleanText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Erreur copie:', err);
    return false;
  }
};

interface CenterWorkspaceProps {
  onOpenSettings: () => void;
  onOpenApiKey: () => void;
  onSelectChapterModal: (chapterId: string, action: 'revise' | 'qcm' | 'exercise') => void;
  activePromptTemplate?: string | null;
  onClearActivePromptTemplate?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const CenterWorkspace: React.FC<CenterWorkspaceProps> = ({
  onOpenSettings,
  onOpenApiKey,
  onSelectChapterModal,
  activePromptTemplate,
  onClearActivePromptTemplate,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const profile = getUserProfile();
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; timestamp: Date }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<'Gemini 3.8 Flash' | 'Gemini 3.1 Pro'>(
    profile.model?.includes('Pro') ? 'Gemini 3.1 Pro' : 'Gemini 3.8 Flash'
  );
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'Tuteur' | 'Examen' | 'Synthèse'>('Tuteur');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const recognitionRef = useRef<any>(null);

  const availableModels: ('Gemini 3.8 Flash' | 'Gemini 3.1 Pro')[] = [
    'Gemini 3.8 Flash',
    'Gemini 3.1 Pro'
  ];

  // Reçoit un prompt template depuis la sidebar
  useEffect(() => {
    if (activePromptTemplate) {
      setInput(activePromptTemplate);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
      if (onClearActivePromptTemplate) {
        onClearActivePromptTemplate();
      }
    }
  }, [activePromptTemplate, onClearActivePromptTemplate]);

  // Initialisation session de chat avec le modèle réellement sélectionné
  const getOrCreateChatSession = () => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = new ChatSession(selectedModel, profile.customInstructions);
    }
    return chatSessionRef.current;
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Envoi de message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newMessages = [
      ...messages,
      { role: 'user' as const, text: userText, timestamp: new Date() }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const session = getOrCreateChatSession();
      let promptToSend = userText;
      if (activeMode === 'Examen') {
        promptToSend = `[Cadre: Problème d'entraînement type Concours/Baccalauréat Terminale D/C Bénin] ${userText}`;
      } else if (activeMode === 'Synthèse') {
        promptToSend = `[Cadre: Fiche de synthèse synthétique avec formules LaTeX et démonstrations requises] ${userText}`;
      }

      const responseText = await session.sendMessage(promptToSend);
      setMessages([
        ...newMessages,
        { role: 'model' as const, text: responseText, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error("Erreur Gemini:", err);
      const friendlyError = formatGeminiError(err);
      setMessages([
        ...newMessages,
        { 
          role: 'model' as const, 
          text: friendlyError,
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Relance la génération d'une réponse spécifique du tuteur
  const handleRegenerateMessage = async (tutorIndex: number) => {
    if (isLoading) return;

    // Retrouve le dernier message utilisateur correspondant
    let promptText = '';
    for (let i = tutorIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        promptText = messages[i].text;
        break;
      }
    }

    if (!promptText) {
      promptText = messages[tutorIndex]?.text || '';
    }

    if (!promptText) return;

    setIsLoading(true);
    setRegeneratingIndex(tutorIndex);

    try {
      const session = getOrCreateChatSession();
      let promptToSend = promptText;
      if (activeMode === 'Examen') {
        promptToSend = `[Cadre: Problème d'entraînement type Concours/Baccalauréat Terminale D/C Bénin] ${promptText}`;
      } else if (activeMode === 'Synthèse') {
        promptToSend = `[Cadre: Fiche de synthèse synthétique avec formules LaTeX et démonstrations requises] ${promptText}`;
      }

      const responseText = await session.sendMessage(promptToSend);
      
      setMessages((prev) => {
        const next = [...prev];
        next[tutorIndex] = {
          role: 'model',
          text: responseText,
          timestamp: new Date()
        };
        return next;
      });
    } catch (err: any) {
      console.error("Erreur relance Gemini:", err);
      const friendlyError = formatGeminiError(err);
      setMessages((prev) => {
        const next = [...prev];
        next[tutorIndex] = {
          role: 'model',
          text: friendlyError,
          timestamp: new Date()
        };
        return next;
      });
    } finally {
      setIsLoading(false);
      setRegeneratingIndex(null);
    }
  };

  // Téléchargement PDF A4 HD
  const handleDownloadPDF = async (messageIndex: number) => {
    setDownloadingIndex(messageIndex);
    try {
      const elementId = `workspace-message-${messageIndex}`;
      await exportElementToA4PDF(elementId, {
        title: "Fiche d'Exercices & Démonstrations",
        subject: "Mathématiques & Physique · Terminale D & C",
        author: profile.fullName || profile.nickname || 'Élève Terminale D/C'
      });
    } catch (e) {
      console.error('Erreur export PDF:', e);
    } finally {
      setDownloadingIndex(null);
    }
  };

  // Impression vectorielle native
  const handlePrintVector = (messageIndex: number) => {
    const el = document.getElementById(`workspace-content-${messageIndex}`);
    if (!el) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour l'impression directe.");
      return;
    }

    const katexCss = document.querySelector('link[href*="katex"]')?.outerHTML || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prépa Concours Bénin - Fiche de Cours</title>
          ${katexCss}
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 40px;
              color: #0f172a;
              background: #ffffff;
              line-height: 1.6;
              font-size: 14px;
            }
            .header-banner {
              border-bottom: 2px solid #0284c7;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            .header-banner h1 {
              font-size: 18px;
              margin: 0 0 4px 0;
              color: #0284c7;
            }
            .header-banner p {
              font-size: 11px;
              color: #64748b;
              margin: 0;
            }
            h1, h2, h3, h4 { color: #0f172a; margin-top: 1.2em; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
            th { background-color: #f1f5f9; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1>RÉPUBLIQUE DU BÉNIN — PRÉPA CONCOURS &amp; BACCALAURÉAT</h1>
            <p>Terminale D &amp; C · Fiche d'auto-évaluation &amp; Résolution officielle</p>
          </div>
          <div>${el.innerHTML}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Prompts d'accroche rapides
  const quickPrompts = [
    { title: "Dérivabilité & Logarithmes", prompt: "Montre-moi comment étudier rigoureusement la dérivabilité et les branches infinies d'une fonction avec ln(x)." },
    { title: "Équations différentielles", prompt: "Résous pas à pas l'équation différentielle y'' + 4y = 0 avec justifications complètes." },
    { title: "Lois de Newton en Physique", prompt: "Démontre les équations horaires du mouvement d'un projectile dans un champ de pesanteur uniforme." },
    { title: "Nombres complexes & Géométrie", prompt: "Donne la méthode pas à pas pour déterminer la nature d'un triangle à partir des affixes de ses sommets." }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      
      {/* Top Workspace Bar */}
      <header className="h-14 border-b border-gray-800 bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-10 flex-shrink-0">
        
        <div className="flex items-center gap-3">
          {onToggleSidebar && !isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Afficher le panneau latéral"
            >
              <Plus size={18} />
            </button>
          )}

          {messages.length > 0 ? (
            <button
              onClick={() => {
                setMessages([]);
                chatSessionRef.current = null;
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 hover:text-white transition-colors border border-gray-700"
              title="Nouvelle session"
            >
              <RotateCcw size={13} />
              <span>Nouvelle session</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs text-gray-300 font-medium">
                Espace de Révision Scientifique
              </span>
            </div>
          )}
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Track badge */}
          <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-blue-400 font-medium">
            {profile.track || 'Terminale D & C'}
          </span>

          {/* Model indicator */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 transition-colors border border-gray-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{selectedModel}</span>
              <ChevronDown size={11} className="text-gray-400" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute top-9 right-0 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-1 z-40 text-xs text-gray-300">
                {availableModels.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => {
                      setSelectedModel(mod);
                      setIsModelDropdownOpen(false);
                      chatSessionRef.current = new ChatSession(mod, profile.customInstructions);
                      saveUserProfile({ ...profile, model: mod });
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${selectedModel === mod ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                  >
                    <span>{mod}</span>
                    {selectedModel === mod && <Check size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile shortcut */}
          <button 
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-500 transition-colors shadow-sm shadow-blue-900/30"
            title="Paramètres de profil"
          >
            {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : (profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'É')}
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-between p-4 sm:p-6 pb-2">
        
        {/* Empty Welcome Screen */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center space-y-6 animate-in fade-in duration-300">
            
            {/* Logo officiel Bénin */}
            <div className="w-16 h-16 flex items-center justify-center">
              <AppLogo size={60} className="w-15 h-15 shadow-xl shadow-blue-900/30 rounded-2xl" />
            </div>

            {/* Titre d'accueil */}
            <div className="space-y-1">
              <h2 className="font-bold text-2xl sm:text-3xl text-gray-100 tracking-tight">
                {profile.nickname ? `Prêt à réviser, ${profile.nickname}` : 'Prêt pour la révision ?'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Mathématiques &amp; Physique-Chimie · Programme officiel Terminale D &amp; C
              </p>
            </div>

            {/* Central prompt card */}
            <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl space-y-3 text-left">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question de cours, collez un énoncé d'exercice ou demandez une démonstration..."
                rows={3}
                className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none custom-scrollbar leading-relaxed"
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                {/* Left actions */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="Actions rapides"
                    >
                      <Plus size={16} />
                    </button>

                    {isPlusMenuOpen && (
                      <div className="absolute bottom-10 left-0 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-1.5 z-40 text-xs text-gray-300">
                        <button
                          onClick={() => {
                            setInput("Résous cet exercice étape par étape avec justification de chaque formule et étape mathématique : ");
                            setIsPlusMenuOpen(false);
                            textareaRef.current?.focus();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-left"
                        >
                          <Calculator size={14} className="text-blue-400" />
                          <span>Résolution pas à pas</span>
                        </button>
                        <button
                          onClick={() => {
                            setInput("Rédige une fiche de synthèse condensée avec définitions, formules clés en LaTeX et pièges à éviter sur : ");
                            setIsPlusMenuOpen(false);
                            textareaRef.current?.focus();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-left"
                        >
                          <FileText size={14} className="text-emerald-400" />
                          <span>Fiche de synthèse avec formules</span>
                        </button>
                        <button
                          onClick={() => {
                            setInput("Propose un problème d'entraînement type concours / baccalauréat Terminale D/C avec questions progressives sur : ");
                            setIsPlusMenuOpen(false);
                            textareaRef.current?.focus();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 text-left"
                        >
                          <BookOpen size={14} className="text-indigo-400" />
                          <span>Problème type concours</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mode switcher: Tuteur | Examen | Synthèse */}
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-0.5 text-xs">
                    {(['Tuteur', 'Examen', 'Synthèse'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setActiveMode(m)}
                        className={`px-2.5 py-1 rounded-md transition-all ${activeMode === m ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right action: Mic & Send */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`p-1.5 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
                  >
                    <Mic size={16} />
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-xl transition-all flex items-center justify-center ${input.trim() && !isLoading ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40 cursor-pointer' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                    title="Envoyer"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick syllabus prompt chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-xl">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(item.prompt);
                    textareaRef.current?.focus();
                  }}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/40 rounded-full text-xs text-gray-300 hover:text-white transition-all shadow-sm"
                >
                  {item.title}
                </button>
              ))}
            </div>

          </div>
        ) : (
          /* Active Chat Stream */
          <div className="w-full max-w-3xl flex-1 space-y-6 pb-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Speaker label */}
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-gray-400">
                    {isUser ? (
                      <span>Vous</span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Tuteur Scientifique</span>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div 
                    id={`workspace-message-${index}`}
                    className={`w-full max-w-full rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/30' 
                        : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none shadow-xl'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div 
                        id={`workspace-content-${index}`}
                        className="prose prose-invert max-w-none text-gray-200 text-sm space-y-3 font-normal leading-relaxed"
                      >
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Action footer for assistant messages */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-3 mt-4 border-t border-gray-800 text-xs text-gray-400 no-print">
                        <button
                          onClick={() => handleRegenerateMessage(index)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700 disabled:opacity-50"
                          title="Relancer et régénérer cette réponse du tuteur"
                        >
                          {regeneratingIndex === index ? (
                            <>
                              <Loader2 size={13} className="animate-spin text-amber-400" />
                              <span className="text-amber-300">Relance en cours...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw size={13} className="text-amber-400" />
                              <span>Relancer</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={async () => {
                            const success = await copyMessageToClipboard(msg.text);
                            if (success) {
                              setCopiedIndex(index);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                          title="Copier le texte et les formules mathématiques"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check size={13} className="text-green-400 font-bold" />
                              <span className="text-green-400 font-medium">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copier</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handlePrintVector(index)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700"
                          title="Imprimer ou enregistrer en PDF vectoriel sans aucune perte"
                        >
                          <Printer size={13} className="text-blue-400" />
                          <span>Imprimer</span>
                        </button>

                        <button
                          onClick={() => handleDownloadPDF(index)}
                          disabled={downloadingIndex === index}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 shadow-sm shadow-blue-900/30"
                          title="Télécharger la fiche A4 haute définition avec en-tête officiel"
                        >
                          {downloadingIndex === index ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Génération HD...</span>
                            </>
                          ) : (
                            <>
                              <Download size={13} />
                              <span>Télécharger PDF (HD)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-lg">
                <Loader2 size={16} className="text-blue-400 animate-spin" />
                <span className="text-xs text-gray-300">
                  Raisonnement scientifique et rédaction en cours...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Card at bottom when in active conversation */}
        {messages.length > 0 && (
          <div className="w-full max-w-3xl pt-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 shadow-2xl space-y-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question complémentaire ou demandez un éclaircissement..."
                rows={2}
                className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none custom-scrollbar leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1.5 border-t border-gray-800">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-blue-400 font-medium px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                    Mode : {activeMode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`p-1.5 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
                  >
                    <Mic size={15} />
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-xl transition-all flex items-center justify-center ${input.trim() && !isLoading ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 cursor-pointer' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer de l'espace de travail */}
      <footer className="w-full py-2 px-4 bg-gray-950/90 border-t border-gray-900 text-center text-xs text-gray-500 flex-shrink-0 flex items-center justify-center gap-1.5">
        <span>Prépa Concours Bénin</span>
        <span className="text-gray-700">•</span>
        <span>Développé par</span>
        <a
          href="https://horaciochinkoun.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-blue-400 font-medium underline underline-offset-2 transition-colors"
        >
          Horacio CHINKOUN
        </a>
      </footer>

    </div>
  );
};
