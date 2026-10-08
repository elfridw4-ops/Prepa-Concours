import React, { useState } from 'react';
import { Key, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { saveApiKey, getApiKey, clearApiKey, cleanApiKey } from '../utils/storage';
import { AppLogo } from './AppLogo';

export const ApiKeyScreen: React.FC<{ onKeySaved: () => void }> = ({ onKeySaved }) => {
  const existingKey = getApiKey() || '';
  const [apiKey, setApiKey] = useState(existingKey);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Gère la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedKey = cleanApiKey(apiKey);
    if (!cleanedKey) {
      setError('Veuillez entrer une clé valide.');
      return;
    }
    // Sauvegarde la clé via notre utilitaire (qui va aussi la nettoyer)
    saveApiKey(cleanedKey);
    setSuccess('Clé enregistrée avec succès !');
    setTimeout(() => {
      // Notifie le parent que la clé est sauvegardée
      onKeySaved();
    }, 600);
  };

  const handleDeleteKey = () => {
    clearApiKey();
    setApiKey('');
    setError('');
    setSuccess('Clé supprimée avec succès.');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <AppLogo size={56} className="w-14 h-14 shadow-lg shadow-blue-900/30 rounded-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 font-sans tracking-tight">
          {existingKey ? 'Configuration de votre Clé API' : 'Bienvenue, Futur Étudiant'}
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Pour utiliser notre assistant de révision Terminale D/C (Bénin), veuillez entrer votre propre clé API Google Gemini.
          Elle sera stockée uniquement sur votre appareil de manière sécurisée.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              Clé API Gemini
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(''); // Réinitialise l'erreur à la saisie
              }}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-100 font-mono"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-400 flex items-center gap-1"><CheckCircle size={16} /> {success}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {existingKey ? 'Enregistrer les modifications' : 'Commencer à réviser'}
            </button>

            {existingKey && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onKeySaved}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-700 text-sm"
                >
                  <XCircle size={16} />
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteKey}
                  className="bg-red-950/40 hover:bg-red-950/80 text-red-400 hover:text-red-300 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-900/55 text-sm"
                  title="Supprimer la clé stockée sur votre appareil"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Obtenir une clé API gratuite dans Google AI Studio
            </a>
          </div>

          <div className="pt-3 border-t border-gray-800/80 text-xs text-gray-500">
            Développé par{' '}
            <a
              href="https://horaciochinkoun.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 font-medium underline underline-offset-2 transition-colors"
            >
              Horacio CHINKOUN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
