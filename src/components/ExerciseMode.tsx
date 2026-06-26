import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateExercise } from '../utils/gemini';
import { Chapter } from '../data/chapters';
import { X, Loader2, Eye, Download, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ExerciseModeProps {
  chapter: Chapter;
  onClose: () => void;
}

export const ExerciseMode: React.FC<ExerciseModeProps> = ({ chapter, onClose }) => {
  const [exercise, setExercise] = useState<string | null>(null);
  const [correction, setCorrection] = useState<string | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const data = await generateExercise(chapter.subject, chapter.title);
        setExercise(data.exercise);
        setCorrection(data.correction);
      } catch (err) {
        setError('Impossible de générer l\'exercice.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [chapter]);

  const downloadAsPDF = async () => {
    const container = document.getElementById('exercise-content');
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

          const clonedEl = clonedDoc.getElementById('exercise-content');
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

            // Force la lisibilité pour tous les textes généraux (énoncés etc.)
            const texts = clonedEl.querySelectorAll('p, li, span, td, th');
            texts.forEach((t: any) => {
              if (!t.closest('.prose-green') && !t.classList.contains('katex') && !t.closest('.katex')) {
                t.style.color = '#1e293b'; // Slate-800
              }
            });

            // Sublime les blocs de correction en vert tendre avec du texte d'une excellente lisibilité
            const greenBlocks = clonedEl.querySelectorAll('.prose-green');
            greenBlocks.forEach((block: any) => {
              block.style.background = '#f0fdf4'; // Fond vert clair doux
              block.style.border = '1px solid #bbf7d0';
              block.style.padding = '22px';
              block.style.borderRadius = '12px';
              block.style.color = '#14532d'; // Vert foncé ultra-lisible
              
              const innerTexts = block.querySelectorAll('p, li, span, td, th');
              innerTexts.forEach((it: any) => {
                if (!it.classList.contains('katex') && !it.closest('.katex')) {
                  it.style.color = '#14532d';
                }
              });
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
      const isCorrectionStr = showCorrection ? " + Correction" : "";
      doc.text(`Exercice d'Examen${isCorrectionStr} : ${chapter.title} (${chapter.subject})`, 15, 21);

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

      const suffix = showCorrection ? "_Correction" : "";
      doc.save(`Exercice_${chapter.title.replace(/\s+/g, '_')}${suffix}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Erreur génération PDF exercice:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-full rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header modale */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-800 bg-gray-800/50">
          <div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">Exercice Type EXAMEN</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{chapter.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && exercise && (
              <button
                onClick={downloadAsPDF}
                disabled={downloading}
                className={`flex items-center gap-2 font-medium py-2 px-4 rounded-xl text-sm transition-all shadow-md ${downloadSuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'} disabled:opacity-50`}
                title={showCorrection ? "Télécharger l'exercice avec son corrigé détaillé en PDF" : "Télécharger l'énoncé de l'exercice en PDF"}
              >
                {downloadSuccess ? (
                  <>
                    <Check size={18} />
                    <span className="hidden sm:inline">Téléchargé !</span>
                  </>
                ) : (
                  <>
                    <Download size={18} className={downloading ? 'animate-bounce' : ''} />
                    <span className="hidden sm:inline">
                      {downloading ? 'Génération...' : showCorrection ? 'Télécharger PDF (Sujet + Corrigé)' : 'Télécharger Sujet PDF'}
                    </span>
                  </>
                )}
              </button>
            )}
            <button onClick={onClose} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
              <Loader2 size={48} className="animate-spin text-blue-500" />
              <p>Rédaction de l'exercice par le professeur IA...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {error}
            </div>
          ) : (
            <div id="exercise-content" className="space-y-8">
              {/* Enoncé */}
              <div>
                <h3 className="text-lg font-bold text-gray-100 mb-4 border-b border-gray-800 pb-2">Énoncé</h3>
                <div className="prose prose-invert prose-blue max-w-none text-gray-300 katex-render-container">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {exercise || ''}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Correction */}
              {!showCorrection ? (
                <div className="pt-8 flex justify-center border-t border-gray-800">
                  <button
                    onClick={() => setShowCorrection(true)}
                    className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 font-semibold py-3 px-8 rounded-xl transition-all"
                  >
                    <Eye size={20} />
                    <span>Voir la correction détaillée</span>
                  </button>
                </div>
              ) : (
                <div className="pt-8 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-lg font-bold text-green-400 mb-4 pb-2 border-b border-gray-800 inline-flex">
                    Correction
                  </h3>
                  <div className="prose prose-invert prose-green max-w-none text-gray-300 bg-green-500/5 border border-green-500/20 rounded-xl p-6 katex-render-container">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {correction || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
