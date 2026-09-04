import React, { useState } from 'react';
import { 
  X, 
  Search, 
  User, 
  Brain, 
  Key, 
  BookOpen,
  Monitor,
  Sun,
  Moon,
  Check,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { getUserProfile, saveUserProfile, UserProfile } from '../utils/userProfile';
import { clearApiKey, getApiKey, saveApiKey, getProgress, resetProgress } from '../utils/storage';
import { applyTheme, Theme } from '../utils/theme';
import { chapters } from '../data/chapters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChanged?: () => void;
  onProgressReset?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onKeyChanged,
  onProgressReset
}) => {
  const [activeTab, setActiveTab] = useState<'Profil' | 'Tuteur' | 'CleAPI' | 'Progression'>('Profil');
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey() || '');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const progress = getProgress();
  const masteredCount = chapters.filter(c => progress[c.id]?.status === 'Maîtrisé').length;
  const inProgressCount = chapters.filter(c => progress[c.id]?.status === 'En cours').length;
  const notStartedCount = chapters.length - masteredCount - inProgressCount;

  const handleProfileChange = (key: keyof UserProfile, value: any) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    saveUserProfile(updated);
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2000);
  };

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    handleProfileChange('theme', theme);
    const themeToApply: Theme = theme === 'light' ? 'light' : 'dark';
    applyTheme(themeToApply);
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setIsKeySaved(true);
      if (onKeyChanged) onKeyChanged();
      setTimeout(() => setIsKeySaved(false), 2000);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setApiKeyInput('');
    if (onKeyChanged) onKeyChanged();
  };

  const handleResetAllProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    if (onProgressReset) onProgressReset();
  };

  const tabs = [
    { id: 'Profil' as const, label: 'Profil & Niveau', icon: User },
    { id: 'Tuteur' as const, label: 'Tuteur IA & Consignes', icon: Brain },
    { id: 'CleAPI' as const, label: 'Clé API Gemini', icon: Key },
    { id: 'Progression' as const, label: 'Données & Révision', icon: BookOpen },
  ];

  const filteredTabs = tabs.filter(t => 
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-900 border border-gray-800 text-gray-200 rounded-2xl w-full max-w-3xl h-[620px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800 flex-shrink-0">
          <div className="relative flex-1 max-w-xs mr-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Rechercher un paramètre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body - stacked column on mobile, 2-column sidebar on desktop */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          
          {/* Navigation des onglets: barre horizontale scrollable sur mobile, barre verticale sur desktop */}
          <div className="sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-800 p-2 sm:p-3 flex sm:flex-col justify-between overflow-x-auto sm:overflow-x-visible overflow-y-hidden sm:overflow-y-auto custom-scrollbar flex-shrink-0 bg-gray-900/60">
            <div className="flex sm:flex-col gap-1 w-full">
              <span className="hidden sm:block text-[11px] font-semibold text-gray-500 px-3 uppercase tracking-wider mb-1">
                Paramètres
              </span>
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:block p-2 border-t border-gray-800 text-[10px] text-gray-500">
              Prépa Concours · Terminale D/C
            </div>
          </div>

          {/* Right Content pane - takes full width on mobile */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* TAB: PROFIL */}
            {activeTab === 'Profil' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-white">Profil de l'élève</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Informations utilisées pour personnaliser vos sessions de révision.
                  </p>
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-xs text-gray-400">Avatar</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-900/30">
                    {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : (profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'É')}
                  </div>
                </div>

                {/* Nom complet */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Nom complet</label>
                  <input 
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    placeholder="Entrez votre nom complet"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Prénom / Nom d'usage */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Prénom d'usage (salutation de l'accueil)</label>
                  <input 
                    type="text"
                    value={profile.nickname}
                    onChange={(e) => handleProfileChange('nickname', e.target.value)}
                    placeholder="Entrez votre prénom ou surnom"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Niveau / Série */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Filière / Niveau préparé</label>
                  <input 
                    type="text"
                    value={profile.track}
                    onChange={(e) => handleProfileChange('track', e.target.value)}
                    placeholder="Terminale D & C · Concours d'Entrée"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Apparence */}
                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <span className="text-xs text-gray-400">Thème visuel</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${profile.theme === 'dark' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'text-gray-400 border-gray-700 hover:text-gray-200 hover:bg-gray-800'}`}
                    >
                      <Moon size={14} />
                      <span>Sombre</span>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${profile.theme === 'light' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'text-gray-400 border-gray-700 hover:text-gray-200 hover:bg-gray-800'}`}
                    >
                      <Sun size={14} />
                      <span>Clair</span>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('system')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${profile.theme === 'system' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'text-gray-400 border-gray-700 hover:text-gray-200 hover:bg-gray-800'}`}
                    >
                      <Monitor size={14} />
                      <span>Système</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: TUTEUR IA */}
            {activeTab === 'Tuteur' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-white">Consignes du Tuteur IA</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Définissez le comportement scientifique, la rigueur et le ton de l'assistant.
                  </p>
                </div>

                {/* Modèle de base */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Modèle Gemini par défaut</label>
                  <select 
                    value={profile.model}
                    onChange={(e) => handleProfileChange('model', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Ultra-rapide, idéal pour QCM et fiches de révision)</option>
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Raisonnement avancé, idéal pour démonstrations et concours complexes)</option>
                  </select>
                </div>

                {/* Directives personnalisées */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-300">Instructions permanentes</label>
                    {isProfileSaved && (
                      <span className="text-[11px] text-green-400 flex items-center gap-1">
                        <Check size={12} /> Sauvegardé
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Ces consignes sont automatiquement injectées dans chaque échange avec l'IA pour garantir un niveau d'exigence maximal.
                  </p>
                  <textarea 
                    rows={7}
                    value={profile.customInstructions}
                    onChange={(e) => handleProfileChange('customInstructions', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono leading-relaxed resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB: CLE API */}
            {activeTab === 'CleAPI' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-white">Clé API Google AI Studio</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connectez votre propre clé Gemini pour alimenter les résolutions et générations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-800/80 border border-gray-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">Statut de la clé</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${apiKeyInput ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {apiKeyInput ? 'Clé configurée' : 'Clé manquante'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="password"
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button 
                        onClick={handleClearApiKey}
                        className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                      >
                        Supprimer la clé
                      </button>
                      <button 
                        onClick={handleSaveApiKey}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-900/30 cursor-pointer"
                      >
                        {isKeySaved ? <Check size={13} /> : null}
                        <span>{isKeySaved ? 'Enregistrée' : 'Sauvegarder'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Obtenir une clé API gratuite sur Google AI Studio</span>
                </a>
              </div>
            )}

            {/* TAB: PROGRESSION */}
            {activeTab === 'Progression' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-white">Données &amp; Suivi de révision</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    État de préparation sur le programme officiel Terminale D/C.
                  </p>
                </div>

                {/* Stat cards - responsive 3 cols */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-green-400">{masteredCount}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">Maîtrisés</p>
                  </div>
                  <div className="p-2.5 sm:p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-amber-400">{inProgressCount}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">En cours</p>
                  </div>
                  <div className="p-2.5 sm:p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-gray-400">{notStartedCount}</p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">À commencer</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Taux de maîtrise global</span>
                    <span className="font-semibold text-white">{Math.round((masteredCount / chapters.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(masteredCount / chapters.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Reset Progress */}
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <span className="text-xs font-semibold text-gray-300">Réinitialisation</span>
                  <p className="text-[11px] text-gray-500">
                    Remet à zéro l'ensemble des statuts de chapitres (utile avant de démarrer un nouveau cycle de révision).
                  </p>
                  
                  {showResetConfirm ? (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button 
                        onClick={handleResetAllProgress}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Confirmer la réinitialisation
                      </button>
                      <button 
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:underline pt-1 cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Réinitialiser la progression</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
