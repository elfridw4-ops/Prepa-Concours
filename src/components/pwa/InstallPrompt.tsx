import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Si l'app est déjà lancée en mode standalone (déjà installée), on ne montre rien
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      return;
    }

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
      setDeferredPrompt(null);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-gray-900/95 border border-blue-500/40 p-4 rounded-2xl shadow-2xl z-50 text-sm text-gray-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Smartphone size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs sm:text-sm">Installer Prépa Concours</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Accédez directement à vos fiches et QCM depuis votre écran d'accueil, même hors-ligne.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInstall(false)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          title="Fermer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-900/30"
        >
          <Download size={14} />
          <span>Installer maintenant</span>
        </button>
        <button
          onClick={() => setShowInstall(false)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-3 rounded-xl text-xs transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
