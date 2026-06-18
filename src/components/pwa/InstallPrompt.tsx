import React, { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-blue-900/90 border border-blue-700 p-4 rounded-lg shadow-xl z-50 text-sm text-white">
      <p>Installez l'application pour un accès rapide.</p>
      <button
        onClick={handleInstall}
        className="mt-3 bg-blue-600 px-3 py-1.5 rounded text-white font-medium hover:bg-blue-500 w-full"
      >
        Installer l'application
      </button>
    </div>
  );
}
