import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateExercise } from '../utils/gemini';
import { Chapter } from '../data/chapters';
import { X, Loader2, Eye } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-full rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header modale */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-800 bg-gray-800/50">
          <div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">Exercice Type EXAMEN</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{chapter.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400">
            <X size={24} />
          </button>
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
            <div className="space-y-8">
              {/* Enoncé */}
              <div>
                <h3 className="text-lg font-bold text-gray-100 mb-4 border-b border-gray-800 pb-2">Énoncé</h3>
                <div className="prose prose-invert prose-blue max-w-none text-gray-300">
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
                  <div className="prose prose-invert prose-green max-w-none text-gray-300 bg-green-500/5 border border-green-500/20 rounded-xl p-6">
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
