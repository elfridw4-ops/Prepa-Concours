import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { generateQCM, QCMQuestion, formatGeminiError } from '../utils/gemini';
import { Chapter } from '../data/chapters';
import { X, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { updateChapterScore } from '../utils/storage';

interface QCMModeProps {
  chapter: Chapter;
  onClose: () => void;
}

export const QCMMode: React.FC<QCMModeProps> = ({ chapter, onClose }) => {
  const [questions, setQuestions] = useState<QCMQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Génère 5 questions QCM à l'ouverture
    const fetchQCM = async () => {
      try {
        setLoading(true);
        const qcmData = await generateQCM(chapter.subject, chapter.title);
        setQuestions(qcmData);
      } catch (err: any) {
        setError(formatGeminiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchQCM();
  }, [chapter]);

  // Extraction de la lettre de la réponse (ex: "A. 42" -> "A")
  const extractLetter = (choice: string) => choice.charAt(0).toUpperCase();

  const handleSelectAnswer = (choice: string) => {
    if (selectedAnswer) return; // Empêche de rejouter si déjà répondu
    
    const letter = extractLetter(choice);
    setSelectedAnswer(letter);
    
    const currentQ = questions[currentIndex];
    if (letter === currentQ.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
      // Sauvegarde la progression à la fin
      const percentage = Math.round(((score + (selectedAnswer === questions[currentIndex].answer ? 1 : 0)) / questions.length) * 100);
      updateChapterScore(chapter.id, percentage);
    }
  };

  if (loading || error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl p-8 flex flex-col relative text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <Loader2 size={48} className="animate-spin text-blue-500" />
               <p className="text-gray-300">Génération du QCM par l'IA...</p>
             </div>
          ) : (
            <div className="py-12 text-red-400">
               <XCircle size={48} className="mx-auto mb-4" />
               <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (finished) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-700 w-full max-w-xl rounded-2xl p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
          
          <h2 className="text-3xl font-bold mb-6 text-gray-100">Résultats du QCM</h2>
          <div className="flex justify-center mb-8">
            <div className={`text-6xl font-black ${finalPercentage >= 80 ? 'text-green-500' : finalPercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {score} <span className="text-3xl text-gray-500">/ {questions.length}</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-8 text-lg">
            {finalPercentage >= 80 ? "Excellent travail ! Tu as obtenu le niveau 'Maîtrisé'." : 
             finalPercentage >= 50 ? "Bon travail, mais il y a encore de la marge de progression." : 
             "Il faut revoir cette notion. N'hésite pas à consulter la fiche de révision."}
          </p>
          
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-3xl rounded-2xl flex flex-col shadow-2xl relative my-auto">
        
        {/* Info Barre */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
             <span className="text-sm font-semibold text-gray-400">Question {currentIndex + 1} / {questions.length}</span>
             <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all" style={{ width: `${((currentIndex+1)/questions.length)*100}%` }}></div>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        {/* Question */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-medium text-gray-100 mb-8 leading-relaxed katex-render-container">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentQ.question}</ReactMarkdown>
          </h3>

          <div className="space-y-3">
            {currentQ.choices.map((choice, idx) => {
              const letter = extractLetter(choice);
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === currentQ.answer;
              
              // Détermine la couleur de la carte une fois répondu
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-gray-200 ";
              if (!selectedAnswer) {
                btnClass += "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-800/80 cursor-pointer";
              } else {
                if (isCorrect) {
                  btnClass += "border-green-500 bg-green-500/10 cursor-default";
                } else if (isSelected) {
                  btnClass += "border-red-500 bg-red-500/10 cursor-default";
                } else {
                  btnClass += "border-gray-800 bg-gray-800/50 opacity-50 cursor-default";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(choice)}
                  disabled={!!selectedAnswer}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex-1 text-left prose prose-invert prose-sm katex-render-container"><ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>{choice}</ReactMarkdown></div>
                    {selectedAnswer && isCorrect && <CheckCircle className="text-green-500 ml-2 flex-shrink-0" size={20} />}
                    {selectedAnswer && isSelected && !isCorrect && <XCircle className="text-red-500 ml-2 flex-shrink-0" size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explication et Bouton Suivant */}
          {selectedAnswer && (
            <div className="mt-8 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Explication</h4>
              <div className="text-gray-300 leading-relaxed mb-6 prose prose-invert prose-sm max-w-none katex-render-container">
                <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>{currentQ.explanation}</ReactMarkdown>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};
