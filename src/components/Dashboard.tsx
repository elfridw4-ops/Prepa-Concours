import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CenterWorkspace } from './CenterWorkspace';
import { SettingsModal } from './SettingsModal';
import { ProgressBar } from './ProgressBar';
import { ChapterCard } from './ChapterCard';
import { chapters } from '../data/chapters';
import { getProgress } from '../utils/storage';
import { 
  PanelLeft, 
  PanelLeftClose, 
  BookOpen, 
  Sparkles, 
  Search, 
  X, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

interface DashboardProps {
  onClearKey: () => void;
  onSelectChapter: (chapterId: string, action: 'revise' | 'qcm' | 'exercise') => void;
  activeSection?: 'accueil' | 'programme';
  setActiveSection?: (section: 'accueil' | 'programme') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onClearKey, 
  onSelectChapter,
  activeSection: propActiveSection,
  setActiveSection: propSetActiveSection
}) => {
  // Sidebar rétractable par défaut
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'workspace' | 'curriculum'>('workspace');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePromptTemplate, setActivePromptTemplate] = useState<string | null>(null);
  const [progress, setProgress] = useState(getProgress());
  const [activeTab, setActiveTab] = useState<'Tous' | 'Mathématiques' | 'Physique'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  // Raccourci clavier pour les paramètres : Ctrl + Shift + ,
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshProgress = () => {
    setProgress(getProgress());
  };

  const masteredCount = chapters.filter(c => progress[c.id]?.status === 'Maîtrisé').length;

  const handleSelectPromptTemplate = (prompt: string) => {
    setActivePromptTemplate(prompt);
    setViewMode('workspace');
  };

  const filteredChapters = chapters.filter(chap => {
    const matchesTab = activeTab === 'Tous' || chap.subject === activeTab;
    const matchesSearch = chap.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const maths = filteredChapters.filter(c => c.subject === 'Mathématiques');
  const physique = filteredChapters.filter(c => c.subject === 'Physique');

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Panneau latéral escamotable avec les couleurs et polices d'origine */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={() => {
          setViewMode('workspace');
          setActivePromptTemplate('');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenApiKey={onClearKey}
        onSelectChapter={(chapterId, action) => onSelectChapter(chapterId, action)}
        onSelectPromptTemplate={handleSelectPromptTemplate}
        chapters={chapters}
        progress={progress}
        activeChapterId={null}
        onLogout={onClearKey}
        onOpenCurriculum={() => setViewMode(viewMode === 'curriculum' ? 'workspace' : 'curriculum')}
      />

      {/* Zone centrale principale */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Toggle flottant discret pour ouvrir la barre si fermée */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-3 left-3 z-40 p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all shadow-lg shadow-black/40"
            title="Ouvrir le menu latéral"
          >
            <PanelLeft size={18} />
          </button>
        )}

        {/* Vue Programme & Fiches (Curriculum complet) */}
        {viewMode === 'curriculum' ? (
          <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-y-auto custom-scrollbar">
            
            {/* Header Curriculum */}
            <header className="sticky top-0 z-30 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('workspace')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition-colors border border-gray-700"
                >
                  <ArrowLeft size={14} />
                  <span>Retour au Tuteur</span>
                </button>
                <div className="hidden sm:block">
                  <h2 className="text-sm font-bold text-gray-100">Programme Officiel Terminale D &amp; C</h2>
                  <p className="text-[11px] text-gray-400">Syllabus conforme Ministère des Enseignements Secondaire et Technique du Bénin</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {masteredCount} / {chapters.length} chapitres maîtrisés
                </span>
                <button
                  onClick={() => setViewMode('workspace')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  title="Fermer le programme"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Corps du Curriculum */}
            <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
              
              {/* Barre de progression globale */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <ProgressBar current={masteredCount} total={chapters.length} />
              </div>

              {/* Filtres par matière et recherche */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900 p-4 border border-gray-800 rounded-2xl shadow-lg">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                  <button
                    onClick={() => setActiveTab('Tous')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'Tous'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    Tous les chapitres ({chapters.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('Mathématiques')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'Mathématiques'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    Mathématiques ({chapters.filter(c => c.subject === 'Mathématiques').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('Physique')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'Physique'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    Physique ({chapters.filter(c => c.subject === 'Physique').length})
                  </button>
                </div>

                <div className="relative w-full sm:w-72 flex-shrink-0">
                  <Search size={16} className="absolute inset-y-0 left-3 my-auto text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un chapitre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Mathématiques */}
              {(activeTab === 'Tous' || activeTab === 'Mathématiques') && maths.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h3 className="text-lg font-bold text-gray-100">Mathématiques</h3>
                    <span className="text-xs text-gray-400">({maths.length} chapitres)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

              {/* Physique */}
              {(activeTab === 'Tous' || activeTab === 'Physique') && physique.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h3 className="text-lg font-bold text-gray-100">Physique</h3>
                    <span className="text-xs text-gray-400">({physique.length} chapitres)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl p-8">
                  <p className="text-gray-400 text-sm">Aucun chapitre ne correspond à votre recherche "{searchQuery}".</p>
                </div>
              )}

              {/* Footer Curriculum */}
              <footer className="text-center py-8 border-t border-gray-900 text-xs text-gray-500">
                <span>Prépa Concours Bénin • Développé par </span>
                <a
                  href="https://horaciochinkoun.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 font-medium underline underline-offset-2 transition-colors"
                >
                  Horacio CHINKOUN
                </a>
              </footer>

            </main>
          </div>
        ) : (
          /* Vue Espace de Travail & Résolution Scientifique */
          <CenterWorkspace 
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenApiKey={onClearKey}
            onSelectChapterModal={(chapterId, action) => onSelectChapter(chapterId, action)}
            activePromptTemplate={activePromptTemplate}
            onClearActivePromptTemplate={() => setActivePromptTemplate(null)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        )}

      </div>

      {/* Modal des Paramètres & Profil */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyChanged={refreshProgress}
        onProgressReset={refreshProgress}
      />

    </div>
  );
};
