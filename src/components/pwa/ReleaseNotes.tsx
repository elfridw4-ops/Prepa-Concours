import React from 'react';
import versionData from '../../version.json';

export function ReleaseNotes({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-4">Notes de version - v{versionData.version}</h2>
        <p className="text-gray-400 mb-4">Dernière mise à jour : {versionData.lastUpdated}</p>
        <ul className="list-disc list-inside text-gray-200 mt-2 space-y-2">
          {versionData.changes.map((change, i) => (
            <li key={i}>{change}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 px-4 py-2 rounded text-white font-medium hover:bg-blue-500"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
