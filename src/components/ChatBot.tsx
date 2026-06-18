import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Mic, Maximize2, Minimize2, Copy, Download, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatSession } from '../utils/gemini';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Utility for formatting clipboard rich-HTML representation alongside Markdown plain text
const copyMessageToClipboard = async (text: string): Promise<boolean> => {
  try {
    let htmlContent = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)(?:<br\/>|<\/p>)/g, '<h3>$1</h3>')
      .replace(/## (.*?)(?:<br\/>|<\/p>)/g, '<h2>$1</h2>')
      .replace(/# (.*?)(?:<br\/>|<\/p>)/g, '<h1>$1</h1>')
      .replace(/(?:^|<br\/>)\s*-\s+(.*?)(?=<br\/>|$)/g, '<li>$1</li>');
      
    htmlContent = `<div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; font-size: 15px;"><p>${htmlContent}</p></div>`;

    if (navigator.clipboard && window.ClipboardItem) {
      const plainBlob = new Blob([text], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const item = new ClipboardItem({
        'text/plain': plainBlob,
        'text/html': htmlBlob,
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(text);
    }
    return true;
  } catch (err) {
    console.error('Failed to copy rich text:', err);
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Utility for exporting the clean formatted structured message to PDF via HTML-to-Canvas high fidelity rendering
const downloadMessageAsPDF = async (index: number) => {
  const container = document.getElementById(`message-text-${index}`);
  if (!container) return;

  try {
    // Rend l'élément HTML (contenant le texte et les formules LaTeX de KaTeX) en canvas haute résolution
    const canvas = await html2canvas(container, {
      scale: 2.5, // Superbe netteté des équations lors d'impression ou zoom sur PDF
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(`message-text-${index}`);
        if (clonedEl) {
          // Applique des styles universitaires et scientifiques haut-de-gamme
          clonedEl.style.padding = '30px 42px';
          clonedEl.style.color = '#0f172a'; // slate-900
          clonedEl.style.background = '#ffffff';
          clonedEl.style.width = '740px'; // Étalonnage optimal pour le format A4
          clonedEl.style.maxWidth = '100%';
          clonedEl.className = 'prose max-w-none'; // Enlève la classe de mode sombre

          // En-têtes scolaires
          const headings = clonedEl.querySelectorAll('h1, h2, h3, h4');
          headings.forEach((h: any) => {
            h.style.color = '#1d4ed8'; // Bleu d'excellence éducatif
            h.style.fontWeight = 'bold';
            h.style.borderBottom = '1px solid #e2e8f0';
            h.style.paddingBottom = '6px';
            h.style.marginTop = '1.25rem';
            h.style.marginBottom = '0.75rem';
          });

          // Sublime les équations pour un confort visuel maximal
          const katexElements = clonedEl.querySelectorAll('.katex');
          katexElements.forEach((kat: any) => {
            kat.style.color = '#1e3a8a'; // Bleu profond contrasté pour la physique-maths
            kat.style.fontSize = '125%';
          });

          // Alignement précis des puces
          const lists = clonedEl.querySelectorAll('ul, ol');
          lists.forEach((list: any) => {
            list.style.paddingLeft = '22px';
            list.style.color = '#334155'; // slate-700
          });
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // Largeur A4
    const pageHeight = 297; // Hauteur A4
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Magnifique en-tête d'excellence
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 32, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PREPA CONCOURS BENIN', 15, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text("Fiche d'explications certifiée du Tuteur IA - Terminale D/C", 15, 21);

    const startY = 36; // Lancement sous l'en-tête

    if (imgHeight <= pageHeight - startY - 15) {
      doc.addImage(imgData, 'PNG', 0, startY, imgWidth, imgHeight);
    } else {
      // Découpage réactif et fluide multi-pages
      doc.addImage(imgData, 'PNG', 0, startY, imgWidth, pageHeight - startY - 15);
      heightLeft -= (pageHeight - startY - 15);
      position = -(pageHeight - startY - 15);

      while (heightLeft > 0) {
        doc.addPage();
        const drawHeight = Math.min(heightLeft, pageHeight - 25);
        doc.addImage(imgData, 'PNG', 0, 15, imgWidth, drawHeight, undefined, 'FAST', 0);
        heightLeft -= (pageHeight - 25);
        position -= (pageHeight - 25);
      }
    }

    // Filigranes de bas de page académique
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(15, pageHeight - 12, 195, pageHeight - 12);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Prépa Concours Bénin - Votre compagnon de réussite au Baccalauréat', 15, pageHeight - 8);
      doc.text(`Page ${i} sur ${totalPages}`, 180, pageHeight - 8);
    }

    doc.save('Prépa_Concours_Fiche_Tuteur.pdf');
  } catch (err) {
    console.error('Erreur lors de la génération haute fidélité du PDF :', err);
  }
};

// Extrait la création de la session hors du composant pour ne pas la recréer aux re-renders,
// On l'initialisera lors de l'ouverture du chat.
let globalChatSession: ChatSession | null = null;
let recognition: any = null;

interface ChatBotProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen: propIsOpen, onOpen, onClose }) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;

  const setIsOpen = (val: boolean) => {
    if (val) {
      if (onOpen) onOpen();
      else setLocalIsOpen(true);
    } else {
      if (onClose) onClose();
      else setLocalIsOpen(false);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const baseInputRef = useRef('');

  useEffect(() => {
    // Initialise SpeechRecognition si supporté
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = true;
      recognition.continuous = true; // Permet de continuer à écouter sans s'arrêter à chaque pause

      recognition.onresult = (event: any) => {
        let sessionTranscript = '';
        
        for (let i = 0; i < event.results.length; ++i) {
          sessionTranscript += event.results[i][0].transcript;
        }
        
        // On remplace le texte courant en partant de ce qui était déjà là avant la dictée
        setInput(baseInputRef.current + (baseInputRef.current && sessionTranscript ? ' ' : '') + sessionTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setInput("Erreur : Accès au micro refusé. Vérifiez les permissions.");
          setTimeout(() => setInput(''), 3000);
        } else if (event.error === 'no-speech') {
          // Silently ignore or we could show a brief toast
        } else {
          setInput(`Erreur micro : ${event.error}`);
          setTimeout(() => setInput(''), 3000);
        }
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        baseInputRef.current = input;
        recognition.start();
        setIsListening(true);
      } else {
        setInput("La reconnaissance vocale n'est pas supportée par votre navigateur.");
        setTimeout(() => setInput(''), 3000);
      }
    }
  };

  // Auto-scroll vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Événement global pour ouvrir le tuteur
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-tutor-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-tutor-chat', handleOpenChat);
  }, []);

  // Initialisation au premier message / ouverture
  useEffect(() => {
    if (isOpen && !globalChatSession) {
      try {
        globalChatSession = new ChatSession();
        setMessages([{ role: 'model', text: 'Bonjour ! Je suis ton tuteur IA pour la Terminale D/C. As-tu une question sur le cours de maths ou de physique ?' }]);
      } catch (e) {
        console.error("Erreur d'init Chat:", e);
      }
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!globalChatSession) globalChatSession = new ChatSession();
      const responseText = await globalChatSession.sendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, je rencontre des difficultés de connexion. Vérifie ta clé API ou réessaie." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/50 transition-transform ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Panneau de Chat */}
      {isOpen && (
        <div className={`fixed bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ${isExpanded ? 'inset-4 sm:inset-6 md:inset-8 xl:inset-12 !h-auto !w-auto !max-h-none' : 'bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]'}`}>
          
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <h3 className="font-semibold">Tuteur IA</h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-blue-700 p-1.5 rounded-lg transition-colors">
                {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-700 text-gray-300' : 'bg-blue-500/20 text-blue-400'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 flex flex-col ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}`}>
                  <div 
                    id={`message-text-${idx}`}
                    className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-invert'}`}
                  >
                     <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                     >
                       {msg.text}
                     </ReactMarkdown>
                  </div>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-700/50 text-gray-400">
                      <button
                        onClick={async () => {
                          const success = await copyMessageToClipboard(msg.text);
                          if (success) {
                            setCopiedIndex(idx);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }
                        }}
                        className="flex items-center gap-1 hover:text-white text-xs transition-colors py-0.5 px-1.5 rounded hover:bg-gray-700/50"
                        title="Copier avec mise en forme propre"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={12} className="text-green-400 font-bold" />
                            <span className="text-green-400 font-medium">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => downloadMessageAsPDF(idx)}
                        className="flex items-center gap-1 hover:text-white text-xs transition-colors py-0.5 px-1.5 rounded hover:bg-gray-700/50"
                        title="Télécharger la fiche au format PDF"
                      >
                        <Download size={12} />
                        <span>Télécharger PDF</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Il tape...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <form onSubmit={handleSend} className="flex gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}
                title="Dictée vocale"
              >
                <Mic size={18} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose ta question de maths/physique..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
