import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getUserProfile } from './userProfile';

export interface PDFExportOptions {
  title?: string;
  subject?: string;
  sourceElementId: string;
  fileNamePrefix?: string;
}

/**
 * Nettoie les couleurs oklch incompatibles avec html2canvas
 */
function sanitizeStylesForCanvas(doc: Document) {
  try {
    const styles = doc.querySelectorAll('style');
    styles.forEach((styleTag) => {
      if (styleTag.innerHTML && styleTag.innerHTML.includes('oklch')) {
        styleTag.innerHTML = styleTag.innerHTML.replace(/oklch\([^)]*\)/g, 'rgb(120, 120, 120)');
      }
    });
    const elementsWithInlineStyles = doc.querySelectorAll('[style*="oklch"]');
    elementsWithInlineStyles.forEach((el) => {
      const style = el.getAttribute('style');
      if (style) {
        el.setAttribute('style', style.replace(/oklch\([^)]*\)/g, 'rgb(120, 120, 120)'));
      }
    });
  } catch (e) {
    console.warn('Erreur nettoyage oklch:', e);
  }
}

/**
 * Détecte une ligne de coupure vierge (espace blanc entre paragraphes ou après une formule)
 * pour éviter de couper une formule mathématique ou une phrase au milieu.
 */
function findCleanPageBreak(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  targetY: number, 
  searchRange: number
): number {
  const startY = Math.max(0, targetY - searchRange);
  const endY = targetY;
  
  let bestY = targetY;
  let maxWhiteStreak = 0;
  let currentStreak = 0;
  let streakCenter = targetY;

  // Analyser les pixels ligne par ligne
  for (let y = startY; y <= endY; y += 2) {
    // Échantillonner des pixels sur la ligne
    const sampleCount = 40;
    const step = Math.floor(canvasWidth / sampleCount);
    let isWhiteRow = true;

    try {
      const rowData = ctx.getImageData(0, y, canvasWidth, 1).data;
      for (let x = 20; x < canvasWidth - 20; x += step) {
        const idx = x * 4;
        const r = rowData[idx];
        const g = rowData[idx + 1];
        const b = rowData[idx + 2];
        const a = rowData[idx + 3];

        // Pixel non blanc ou non transparent = texte/formule présent
        if (a > 20 && (r < 240 || g < 240 || b < 240)) {
          isWhiteRow = false;
          break;
        }
      }
    } catch {
      isWhiteRow = false;
    }

    if (isWhiteRow) {
      currentStreak++;
      if (currentStreak > maxWhiteStreak) {
        maxWhiteStreak = currentStreak;
        streakCenter = Math.floor(y - (currentStreak * 2) / 2);
      }
    } else {
      currentStreak = 0;
    }
  }

  if (maxWhiteStreak >= 2) {
    return streakCenter;
  }

  return bestY;
}

/**
 * Exporte un contenu mathématique/scientifique vers un PDF de qualité académique d'excellence.
 */
export async function exportToAcademicPDF(options: PDFExportOptions): Promise<boolean> {
  const { title, subject, sourceElementId, fileNamePrefix = 'prepa_concours' } = options;
  const sourceEl = document.getElementById(sourceElementId);
  if (!sourceEl) {
    console.error(`Élément ${sourceElementId} introuvable.`);
    return false;
  }

  const profile = getUserProfile();
  const candidateName = profile.fullName || profile.nickname || 'Élève';
  const track = profile.track || 'Terminale D & C';
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  try {
    const canvas = await html2canvas(sourceEl, {
      scale: 2.6, // Résolution haute définition (~280 DPI)
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        sanitizeStylesForCanvas(clonedDoc);

        const targetEl = clonedDoc.getElementById(sourceElementId);
        if (!targetEl) return;

        // Créer le conteneur académique A4 étalonné
        const wrapper = clonedDoc.createElement('div');
        wrapper.id = 'academic-pdf-export-wrapper';
        wrapper.style.width = '794px'; // 210mm à 96 DPI
        wrapper.style.backgroundColor = '#ffffff';
        wrapper.style.color = '#0f172a';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '0';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

        // En-tête académique officiel
        const header = clonedDoc.createElement('div');
        header.style.padding = '24px 36px 16px 36px';
        header.style.borderBottom = '2px solid #1e3a8a';
        header.style.backgroundColor = '#ffffff';

        header.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #1e3a8a; letter-spacing: 0.08em; text-transform: uppercase;">
                RÉPUBLIQUE DU BÉNIN · ENSEIGNEMENT SECONDAIRE ET SUPÉRIEUR
              </div>
              <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; letter-spacing: -0.02em;">
                PRÉPA CONCOURS · TERMINALE D &amp; C
              </div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #64748b; line-height: 1.4;">
              <div style="text-transform: uppercase; font-weight: 600; color: #1e3a8a;">${subject || 'Sciences Exactes'}</div>
              <div>${formattedDate}</div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div>
              <span style="color: #64748b;">Candidat : </span>
              <strong style="color: #0f172a;">${candidateName}</strong>
              <span style="margin: 0 10px; color: #cbd5e1;">|</span>
              <span style="color: #64748b;">Niveau préparé : </span>
              <strong style="color: #0f172a;">${track}</strong>
            </div>
            <div style="font-size: 10px; color: #475569; font-weight: 600;">
              Document d'Étude &amp; Résolution
            </div>
          </div>

          ${title ? `
            <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #1e3a8a; background: #eff6ff; padding: 8px 12px; border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0;">
              <strong>Sujet / Problème :</strong> ${title}
            </div>
          ` : ''}
        `;

        // Contenu markdown formaté
        const contentContainer = clonedDoc.createElement('div');
        contentContainer.style.padding = '20px 36px 36px 36px';
        contentContainer.style.backgroundColor = '#ffffff';

        // Déplacer le contenu cloné dans le conteneur
        contentContainer.appendChild(targetEl.cloneNode(true));

        wrapper.appendChild(header);
        wrapper.appendChild(contentContainer);

        // Nettoyer et styliser le contenu cloné pour un rendu papier impeccable
        wrapper.querySelectorAll('*').forEach((el: any) => {
          // Supprimer les classes du mode sombre de Tailwind
          el.classList.remove(
            'prose-invert',
            'text-gray-100',
            'text-gray-200',
            'text-gray-300',
            'text-gray-400',
            'text-gray-500',
            'text-slate-100',
            'text-slate-200',
            'text-slate-300',
            'bg-[#1b1b1e]',
            'bg-[#222226]',
            'bg-[#18181b]',
            'border-[#2a2a2f]',
            'border-[#303036]'
          );

          // Masquer les boutons ou éléments d'interaction
          if (
            el.tagName === 'BUTTON' || 
            el.getAttribute('role') === 'button' ||
            el.classList.contains('no-print')
          ) {
            el.style.display = 'none';
          }
        });

        // Stylisation typographique d'excellence
        const headings = wrapper.querySelectorAll('h1, h2, h3, h4');
        headings.forEach((h: any) => {
          h.style.color = '#1e3a8a';
          h.style.fontWeight = '700';
          h.style.marginTop = '16px';
          h.style.marginBottom = '8px';
          if (h.tagName === 'H1' || h.tagName === 'H2') {
            h.style.borderBottom = '1px solid #e2e8f0';
            h.style.paddingBottom = '4px';
          }
        });

        const paragraphs = wrapper.querySelectorAll('p, li, td, th');
        paragraphs.forEach((p: any) => {
          if (!p.closest('.katex')) {
            p.style.color = '#0f172a';
            p.style.lineHeight = '1.65';
            p.style.fontSize = '13.5px';
          }
        });

        // Sublime les équations KaTeX (contraste absolu et mise en valeur)
        const katexInline = wrapper.querySelectorAll('.katex');
        katexInline.forEach((kat: any) => {
          kat.style.color = '#0f172a';
          kat.style.fontSize = '105%';
        });

        const katexDisplays = wrapper.querySelectorAll('.katex-display');
        katexDisplays.forEach((kd: any) => {
          kd.style.backgroundColor = '#f8fafc';
          kd.style.border = '1px solid #e2e8f0';
          kd.style.borderRadius = '8px';
          kd.style.padding = '12px 16px';
          kd.style.margin = '12px 0';
          kd.style.overflow = 'visible';
          kd.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
        });

        // Remplacer le DOM cloné par notre document structuré
        clonedDoc.body.innerHTML = '';
        clonedDoc.body.style.backgroundColor = '#ffffff';
        clonedDoc.body.appendChild(wrapper);
      }
    });

    // Configuration A4 en mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginSide = 12; // 12mm de marges latérales
    const contentWidthMm = pageWidth - (marginSide * 2); // 186mm

    const marginTop = 14;
    const marginBottom = 14;
    const usableHeightMm = pageHeight - (marginTop + marginBottom); // 269mm

    // Convertir les millimètres en pixels de canvas
    const pxPerMm = canvas.width / contentWidthMm;
    const pageHeightPx = Math.floor(usableHeightMm * pxPerMm);
    const totalHeightPx = canvas.height;

    // Découpage intelligent du canvas
    let currentY = 0;
    let pageNum = 1;
    const slices: { y: number; height: number }[] = [];

    const ctx = canvas.getContext('2d');

    while (currentY < totalHeightPx) {
      const remainingPx = totalHeightPx - currentY;
      if (remainingPx <= pageHeightPx) {
        // Dernier morceau
        slices.push({ y: currentY, height: remainingPx });
        break;
      } else {
        // Trouver une ligne de séparation propre
        const targetY = currentY + pageHeightPx;
        let cutY = targetY;
        if (ctx) {
          cutY = findCleanPageBreak(ctx, canvas.width, targetY, Math.floor(140 * (canvas.width / 794)));
        }
        const sliceH = cutY - currentY;
        slices.push({ y: currentY, height: sliceH });
        currentY = cutY;
      }
    }

    const totalPages = slices.length;

    // Dessiner chaque page sur le PDF
    for (let i = 0; i < slices.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const slice = slices[i];
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slice.height;

      const sliceCtx = sliceCanvas.getContext('2d');
      if (sliceCtx) {
        sliceCtx.fillStyle = '#ffffff';
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas, 
          0, slice.y, canvas.width, slice.height, 
          0, 0, canvas.width, slice.height
        );
      }

      const sliceHeightMm = slice.height / pxPerMm;
      const imgData = sliceCanvas.toDataURL('image/png');

      // Dessiner le contenu de la tranche
      pdf.addImage(imgData, 'PNG', marginSide, marginTop, contentWidthMm, sliceHeightMm, undefined, 'FAST');

      // En-tête courant (sur les pages 2+)
      if (i > 0) {
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`PRÉPA CONCOURS · TERMINALE D & C — ${title || 'Résolution & Démonstration'}`, marginSide, 10);
        pdf.setDrawColor(226, 232, 240);
        pdf.line(marginSide, 11.5, pageWidth - marginSide, 11.5);
      }

      // Pied de page officiel sur toutes les pages
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.setDrawColor(226, 232, 240);
      pdf.line(marginSide, pageHeight - 10, pageWidth - marginSide, pageHeight - 10);

      pdf.text(
        `Prépa Concours Bénin · Mathématiques & Physique`, 
        marginSide, 
        pageHeight - 6
      );
      pdf.text(
        `Page ${i + 1} / ${totalPages}`, 
        pageWidth - marginSide, 
        pageHeight - 6, 
        { align: 'right' }
      );
    }

    const sanitizedTitle = (title || 'document')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_')
      .slice(0, 30);
    pdf.save(`${fileNamePrefix}_${sanitizedTitle}_${Date.now()}.pdf`);
    return true;
  } catch (err) {
    console.error('Erreur génération PDF:', err);
    return false;
  }
}

/**
 * Déclenche une impression native vectorielle (haute fidélité sans pixellisation)
 */
export function printElementVector(elementId: string, title?: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const profile = getUserProfile();
  const candidateName = profile.fullName || profile.nickname || 'Élève';
  const track = profile.track || 'Terminale D & C';
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres pop-up pour lancer l'impression directe.");
    return;
  }

  // Cloner le HTML avec KaTeX
  const contentHtml = el.innerHTML;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>${title || 'Fiche Prépa Concours'}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">
      <style>
        @page {
          size: A4;
          margin: 15mm 12mm 15mm 12mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.6;
          font-size: 14px;
          margin: 0;
          padding: 0;
        }
        .header {
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 12px;
          margin-bottom: 18px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .sub-header {
          font-size: 10px;
          font-weight: 700;
          color: #1e3a8a;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .main-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2px;
        }
        .badge-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
          margin-top: 10px;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }
        h1, h2, h3 {
          color: #1e3a8a;
          page-break-after: avoid;
        }
        h1 { font-size: 18px; margin-top: 18px; }
        h2 { font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 14px; }
        h3 { font-size: 14px; margin-top: 12px; }
        .katex-display {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 14px;
          margin: 12px 0;
          page-break-inside: avoid;
        }
        p, li {
          color: #0f172a;
        }
        button, .no-print {
          display: none !important;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-top">
          <div>
            <div class="sub-header">RÉPUBLIQUE DU BÉNIN · TERMINALE D &amp; C</div>
            <div class="main-title">PRÉPA CONCOURS &amp; BACCALAURÉAT</div>
          </div>
          <div style="font-size: 10px; color: #64748b; text-align: right;">
            <div>${formattedDate}</div>
            <div style="font-weight: 600; color: #1e3a8a;">Sciences Exactes</div>
          </div>
        </div>
        <div class="badge-box">
          <div>Candidat : <strong>${candidateName}</strong> | Niveau : <strong>${track}</strong></div>
          <div>Document d'étude</div>
        </div>
        ${title ? `<div style="margin-top: 8px; font-size: 12px; font-weight: 600; color: #1e3a8a;">Objet : ${title}</div>` : ''}
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 350);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Raccourci d'export A4 haute définition
 */
export async function exportElementToA4PDF(
  elementId: string, 
  options: { title?: string; subject?: string; author?: string }
): Promise<boolean> {
  return exportToAcademicPDF({
    sourceElementId: elementId,
    title: options.title,
    subject: options.subject,
    fileNamePrefix: 'Fiche_Prepa_Concours'
  });
}

