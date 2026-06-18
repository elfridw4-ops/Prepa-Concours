import React, { useState, useEffect } from 'react';
import { getProgress } from '../utils/storage';
import { chapters } from '../data/chapters';
import { ProgressBar } from './ProgressBar';
import { ChapterCard } from './ChapterCard';
import { Settings, Search, Moon, Sun, Eye, Download, Home, ClipboardList } from 'lucide-react';
import { Theme, getSavedTheme, saveTheme, applyTheme } from '../utils/theme';
import { LandingPage } from './LandingPage';

interface DashboardProps {
  onClearKey: () => void;
  onSelectChapter: (chapterId: string, action: 'revise' | 'qcm' | 'exercise') => void;
  activeSection: 'accueil' | 'programme';
  setActiveSection: (section: 'accueil' | 'programme') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onClearKey, 
  onSelectChapter,
  activeSection,
  setActiveSection
}) => {
  const [activeTab, setActiveTab] = useState<'Tous' | 'Mathématiques' | 'Physique'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    setTheme(getSavedTheme());
  }, []);

  const handleToggleTheme = () => {
    const nextThemeMap: Record<Theme, Theme> = {
      dark: 'light',
      light: 'hc',
      hc: 'dark'
    };
    const next = nextThemeMap[theme];
    setTheme(next);
    saveTheme(next);
    applyTheme(next);
  };
  
  const progress = getProgress();

  const handleExportProgress = () => {
    let report = 'Bilan de Révision - Prépa Concours\n';
    report += '=================================================\n\n';

    const getStatusText = (status?: string) => {
      if (status === 'Maîtrisé') return '[✓] Maîtrisé';
      if (status === 'En cours') return '[~] En cours';
      return '[ ] Non commencé';
    };

    ['Mathématiques', 'Physique'].forEach(subject => {
      report += `\n--- ${subject} ---\n`;
      const subjectChapters = chapters.filter(c => c.subject === subject);
      subjectChapters.forEach(c => {
        report += `${getStatusText(progress[c.id]?.status)} : ${c.title}\n`;
      });
    });

    report += '\nCe document est généré automatiquement.';
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bilan_revisions.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calcule le nombre de chapitres maîtrisés
  const masteredCount = chapters.filter(c => progress[c.id]?.status === 'Maîtrisé').length;
  
  // Filtrage des chapitres selon l'onglet courant et la recherche
  const filteredChapters = chapters.filter(chap => {
    const matchesTab = activeTab === 'Tous' || chap.subject === activeTab;
    const matchesSearch = chap.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sépare les chapitres par matière après filtrage
  const maths = filteredChapters.filter(c => c.subject === 'Mathématiques');
  const physique = filteredChapters.filter(c => c.subject === 'Physique');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-20">
      {/* En-tête (Header) */}
      <header className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 truncate">
              Prépa Concours
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">Terminale D/C - Programme du Bénin</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleExportProgress}
              className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Exporter le bilan"
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Bilan</span>
            </button>
            <button
              onClick={handleToggleTheme}
              className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Changer le thème"
            >
              {theme === 'dark' && <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              {theme === 'light' && <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />}
              {theme === 'hc' && <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
            <button
              onClick={() => {
                onClearKey();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Modifier ou effacer la clé API"
            >
              <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Modifier Clé</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation principale de l'Application Portal */}
        <div className="flex border-b border-gray-800 w-full">
          <button
            onClick={() => setActiveSection('accueil')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-6 sm:py-3 font-semibold text-xs sm:text-sm border-b-2 transition-all ${
              activeSection === 'accueil'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Home size={15} />
            <span className="hidden sm:inline">Présentation &amp; FAQ</span>
            <span className="sm:hidden">Présentation</span>
          </button>
          <button
            onClick={() => setActiveSection('programme')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-6 sm:py-3 font-semibold text-xs sm:text-sm border-b-2 transition-all ${
              activeSection === 'programme'
                ? 'border-blue-500 text-blue-400 font-sans'
                : 'border-transparent text-gray-400 hover:text-gray-200 font-sans'
            }`}
          >
            <ClipboardList size={15} />
            <span className="hidden sm:inline">Mon Programme d'Exercices</span>
            <span className="sm:hidden">Programme</span>
          </button>
        </div>

        {activeSection === 'accueil' ? (
          <LandingPage 
            onStartRevision={() => setActiveSection('programme')} 
            onOpenChat={() => window.dispatchEvent(new CustomEvent('open-ai-tutor-chat'))}
            masteredCount={masteredCount}
            totalChapters={chapters.length}
          />
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Section Progression Globale */}
            <section className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <ProgressBar current={masteredCount} total={chapters.length} />
            </section>

            {/* Section: Filtres et Recherche */}
            <section className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/30 p-4 border border-gray-800 rounded-2xl">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                <button
                  onClick={() => setActiveTab('Tous')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Tous' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                >
                  Tous les chapitres
                </button>
                <button
                  onClick={() => setActiveTab('Mathématiques')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Mathématiques' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                >
                  Mathématiques
                </button>
                <button
                  onClick={() => setActiveTab('Physique')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Physique' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                >
                  Physique
                </button>
              </div>
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un chapitre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </section>

            {/* Section Mathématiques */}
            {(activeTab === 'Tous' || activeTab === 'Mathématiques') && maths.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold font-sans tracking-tight">Mathématiques</h2>
                  <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full text-xs font-semibold">
                    {maths.length} chapitres
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {maths.map(chap => (
                    <ChapterCard
                      key={chap.id}
                      chapter={chap}
                      progress={progress[chap.id] || { status: 'Non commencé' }}
                      onAction={(action) => onSelectChapter(chap.id, action)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section Physique */}
            {(activeTab === 'Tous' || activeTab === 'Physique') && physique.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold font-sans tracking-tight">Physique</h2>
                  <span className="bg-green-500/20 text-green-400 py-1 px-3 rounded-full text-xs font-semibold">
                    {physique.length} chapitres
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {physique.map(chap => (
                    <ChapterCard
                      key={chap.id}
                      chapter={chap}
                      progress={progress[chap.id] || { status: 'Non commencé' }}
                      onAction={(action) => onSelectChapter(chap.id, action)}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredChapters.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucun chapitre ne correspond à votre recherche.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
