import React from 'react';
import { Chapter } from '../data/chapters';
import { ChapterProgress } from '../utils/storage';
import { BookOpen, CheckCircle, Circle, Play, Check } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  progress: ChapterProgress;
  onAction: (action: 'revise' | 'qcm' | 'exercise') => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, progress, onAction }) => {
  // Détermine la couleur de l'indicateur de statut
  const getStatusColor = () => {
    switch (progress.status) {
      case 'Maîtrisé': return 'text-green-500';
      case 'En cours': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all flex flex-col h-full group relative overflow-hidden">
      
      {/* Ligne du haut : Titre et statut */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="font-semibold text-lg text-gray-100 leading-tight">
          {chapter.title}
        </h3>
        <div className={`mt-1 flex-shrink-0 ${getStatusColor()}`} title={`Statut : ${progress.status}`}>
          {progress.status === 'Maîtrisé' ? <CheckCircle size={24} /> : 
           progress.status === 'En cours' ? <Circle size={24} className="fill-blue-500/20" /> : 
           <Circle size={24} />}
        </div>
      </div>

      {/* Affichage du score si existant */}
      {progress.qcmScore !== undefined && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 border border-gray-700 w-fit">
          <span className="text-gray-400">Score QCM :</span>
          <span className={progress.qcmScore >= 80 ? 'text-green-400' : progress.qcmScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
            {progress.qcmScore}%
          </span>
        </div>
      )}

      {/* Remplisseur d'espace flexible */}
      <div className="flex-1"></div>

      {/* Ligne de boutons action */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => onAction('revise')}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          <BookOpen size={16} />
          <span>Réviser</span>
        </button>
        <button
          onClick={() => onAction('qcm')}
          className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border border-blue-600/30"
        >
          <Play size={16} />
          <span>S'entraîner</span>
        </button>
      </div>

      {/* Bouton Exercice ouvert (optionnel sur la ligne d'en dessous) */}
      <button
        onClick={() => onAction('exercise')}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-300 py-2 rounded-lg text-xs font-medium transition-colors border border-gray-800 border-dashed"
      >
        <span>Exo. ouvert rédigé</span>
      </button>

    </div>
  );
};
