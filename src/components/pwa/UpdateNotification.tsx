import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdateNotification() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW Registration error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-xl z-50 text-sm text-gray-200">
      <p>Une nouvelle version est disponible.</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-blue-600 px-3 py-1.5 rounded text-white font-medium hover:bg-blue-500"
        >
          Mettre à jour
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="bg-gray-800 px-3 py-1.5 rounded text-gray-300 font-medium hover:bg-gray-700"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
