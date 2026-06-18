import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm font-medium text-gray-400">Progression Globale</span>
          <h4 className="text-2xl font-bold text-gray-100">{percentage}%</h4>
        </div>
        <span className="text-sm text-gray-500 font-medium">
          {current} / {total} chapitres maîtrisés
        </span>
      </div>
      
      {/* Conteneur de la barre de progression */}
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        {/* Barre active */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-400 h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
