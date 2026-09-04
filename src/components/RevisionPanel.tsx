import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { generateRevisionSheet, formatGeminiError } from '../utils/gemini';
import { Chapter } from '../data/chapters';
import { X, Loader2, Download, Check, Printer } from 'lucide-react';
import { updateChapterStatus } from '../utils/storage';
import { exportToAcademicPDF, printElementVector } from '../utils/pdfExport';

interface RevisionPanelProps {
  chapter: Chapter;
  onClose: () => void;
}

export const RevisionPanel: React.FC<RevisionPanelProps> = ({ chapter, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Génère la fiche de cours à l'ouverture
    const fetchContent = async () => {
      try {
        setLoading(true);
        const mdContent = await generateRevisionSheet(chapter.subject, chapter.title);
        setContent(mdContent);
        // Note automatiquement le chapitre "En cours" s'il n'est pas déjà ouvert
        updateChapterStatus(chapter.id, 'En cours');
      } catch (err: any) {
        setError(formatGeminiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [chapter]);

  const downloadAsPDF = async () => {
    setDownloading(true);
    const ok = await exportToAcademicPDF({
      title: `${chapter.subject} : ${chapter.title}`,
      subject: chapter.subject,
      sourceElementId: 'revision-content',
      fileNamePrefix: `fiche_${chapter.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}`
    });
    setDownloading(false);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const printVector = () => {
    printElementVector('revision-content', `${chapter.subject} : ${chapter.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-full rounded-2xl flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header modale */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-800 bg-gray-800/50">
          <div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">Fiche de révision • {chapter.subject}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{chapter.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && content && (
              <>
                <button
                  onClick={printVector}
                  className="flex items-center gap-1.5 font-medium py-2 px-3 rounded-xl text-sm transition-all shadow-md bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700"
                  title="Imprimer ou enregistrer en PDF vectoriel natif"
                >
                  <Printer size={16} className="text-blue-400" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>

                <button
                  onClick={downloadAsPDF}
                  disabled={downloading}
                  className={`flex items-center gap-2 font-medium py-2 px-4 rounded-xl text-sm transition-all shadow-md ${downloadSuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'} disabled:opacity-50`}
                  title="Télécharger cette fiche en PDF haute définition"
                >
                  {downloadSuccess ? (
                    <>
                      <Check size={18} />
                      <span className="hidden sm:inline">Fiche Téléchargée !</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} className={downloading ? 'animate-bounce' : ''} />
                      <span className="hidden sm:inline">{downloading ? 'Génération HD...' : 'Télécharger PDF (HD)'}</span>
                    </>
                  )}
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenu Markdown */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
              <Loader2 size={48} className="animate-spin text-blue-500" />
              <p>Génération de la fiche par l'IA en cours...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {error}
            </div>
          ) : (
            <div id="revision-content" className="prose prose-invert prose-blue max-w-none katex-render-container">
              {/* ReactMarkdown gère l'affichage du markdown de Gemini */}
              <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]} 
                rehypePlugins={[rehypeKatex]}
              >
                {content || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
