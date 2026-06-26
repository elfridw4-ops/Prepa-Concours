import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateRevisionSheet } from '../utils/gemini';
import { Chapter } from '../data/chapters';
import { X, Loader2, Download, Check } from 'lucide-react';
import { updateChapterStatus } from '../utils/storage';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
      } catch (err) {
        setError('Impossible de générer la fiche de révision. Vérifiez votre connexion et votre clé API.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [chapter]);

  const downloadAsPDF = async () => {
    const container = document.getElementById('revision-content');
    if (!container) return;

    try {
      setDownloading(true);
      const canvas = await html2canvas(container, {
        scale: 1.8, // Netteté optimisée des équations sans alourdir le fichier
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Nettoyage de toutes les expressions de couleur oklch() dans les feuilles de style clonées
          // Tailwind v4 utilise oklch par défaut, ce qui fait planter html2canvas car il ne supporte pas oklch()
          try {
            const styles = clonedDoc.querySelectorAll('style');
            styles.forEach((styleTag) => {
              if (styleTag.innerHTML && styleTag.innerHTML.includes('oklch')) {
                styleTag.innerHTML = styleTag.innerHTML.replace(/oklch\([^)]*\)/g, 'rgb(120, 120, 120)');
              }
            });
            const oklchElements = clonedDoc.querySelectorAll('[style*="oklch"]');
            oklchElements.forEach((el: any) => {
              let inlineStyle = el.getAttribute('style');
              if (inlineStyle) {
                inlineStyle = inlineStyle.replace(/oklch\([^)]*\)/g, 'rgb(120, 120, 120)');
                el.setAttribute('style', inlineStyle);
              }
            });
          } catch (e) {
            console.error('Erreur nettoyage oklch pour PDF:', e);
          }

          const clonedEl = clonedDoc.getElementById('revision-content');
          if (clonedEl) {
            // Force les styles de conteneur d'excellence académique à fond blanc pur et texte très contrasté
            clonedEl.style.padding = '35px 45px';
            clonedEl.style.color = '#0f172a'; // Ardoise foncée lisible
            clonedEl.style.background = '#ffffff';
            clonedEl.style.width = '740px'; // Étalonnage optimal pour le format A4
            clonedEl.style.maxWidth = '100%';

            // Nettoyage de toutes les classes de mode sombre et de couleurs floues sur le conteneur principal et ses enfants
            clonedEl.classList.remove('prose-invert', 'text-gray-300', 'text-gray-100');
            const allChildren = clonedEl.querySelectorAll('*');
            allChildren.forEach((child: any) => {
              child.classList.remove(
                'prose-invert',
                'text-gray-100',
                'text-gray-200',
                'text-gray-300',
                'text-gray-400',
                'text-gray-500',
                'text-slate-100',
                'text-slate-200',
                'text-slate-300',
                'text-blue-400',
                'text-green-400',
                'bg-gray-800',
                'bg-gray-900',
                'bg-slate-900',
                'bg-slate-800',
                'bg-black/30',
                'border-gray-800',
                'border-slate-800'
              );
              // Assure une police propre et standardisée
              child.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            });

            // En-têtes scolaires bleus nets
            const headings = clonedEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach((h: any) => {
              h.style.color = '#1d4ed8'; // Bleu d'excellence éducatif
              h.style.fontWeight = 'bold';
              h.style.borderBottom = '1px solid #e2e8f0';
              h.style.paddingBottom = '6px';
              h.style.marginTop = '1.5rem';
              h.style.marginBottom = '0.75rem';
            });

            // Force la lisibilité pour tous les textes
            const texts = clonedEl.querySelectorAll('p, li, span, td, th');
            texts.forEach((t: any) => {
              if (!t.classList.contains('katex') && !t.closest('.katex')) {
                t.style.color = '#1e293b'; // Slate-800
              }
            });

            // Sublime les équations KaTeX pour un confort de lecture optimal en bleu foncé contrasté
            const katexElements = clonedEl.querySelectorAll('.katex');
            katexElements.forEach((kat: any) => {
              kat.style.color = '#1e3a8a'; 
              kat.style.fontSize = '120%';
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

      // Utilisation de JPEG compressé à 75% au lieu de PNG pour diviser le poids du fichier par 15 tout en préservant la netteté !
      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 190; // Largeur de contenu
      const pageHeight = 297; // Hauteur A4
      const pageWidth = 210; // Largeur A4
      const marginX = 10; // Marges horizontales pour un rendu aéré de 10mm

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 32, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PREPA CONCOURS BENIN', 15, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Fiche de révision : ${chapter.title} (${chapter.subject})`, 15, 21);

      const pxScale = canvas.width / imgWidth;
      const firstPageHeightMm = 246; // 297 - 36 (startY) - 15 (bottom margin)
      const firstPageHeightPx = firstPageHeightMm * pxScale;
      const nextPageHeightMm = 267; // 297 - 15 (top margin) - 15 (bottom margin)
      const nextPageHeightPx = nextPageHeightMm * pxScale;

      let sourceY = 0;
      let isFirstPage = true;

      while (sourceY < canvas.height) {
        if (!isFirstPage) {
          doc.addPage();
        }

        const currentMaxHeightPx = isFirstPage ? firstPageHeightPx : nextPageHeightPx;
        const currentMaxHeightMm = isFirstPage ? firstPageHeightMm : nextPageHeightMm;
        const drawY = isFirstPage ? 36 : 15;

        // Calcul des pixels à découper
        const sliceHeightPx = Math.min(canvas.height - sourceY, currentMaxHeightPx);
        const sliceHeightMm = (sliceHeightPx * imgWidth) / canvas.width;

        // Création d'un mini-canvas temporaire pour cette portion de page uniquement (poids réduit)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sliceHeightPx;

        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sliceHeightPx,
            0, 0, canvas.width, sliceHeightPx
          );
          const sliceImgData = tempCanvas.toDataURL('image/jpeg', 0.75);
          doc.addImage(sliceImgData, 'JPEG', marginX, drawY, imgWidth, sliceHeightMm);
        }

        sourceY += sliceHeightPx;
        isFirstPage = false;
      }

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

      doc.save(`Fiche_${chapter.title.replace(/\s+/g, '_')}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Erreur génération PDF fiches:', err);
    } finally {
      setDownloading(false);
    }
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
              <button
                onClick={downloadAsPDF}
                disabled={downloading}
                className={`flex items-center gap-2 font-medium py-2 px-4 rounded-xl text-sm transition-all shadow-md ${downloadSuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'} disabled:opacity-50`}
                title="Télécharger cette fiche en PDF"
              >
                {downloadSuccess ? (
                  <>
                    <Check size={18} />
                    <span className="hidden sm:inline">Fiche Téléchargée !</span>
                  </>
                ) : (
                  <>
                    <Download size={18} className={downloading ? 'animate-bounce' : ''} />
                    <span className="hidden sm:inline">{downloading ? 'Génération...' : 'Télécharger PDF'}</span>
                  </>
                )}
              </button>
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
                remarkPlugins={[remarkMath]} 
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
