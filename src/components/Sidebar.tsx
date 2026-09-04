import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  PanelLeftClose, 
  PanelLeft,
  BookOpen,
  Sparkles,
  Settings,
  Key,
  CheckCircle2,
  Circle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { Chapter } from '../data/chapters';
import { ChapterProgress } from '../utils/storage';
import { getUserProfile } from '../utils/userProfile';
import { ProfileMenu } from './ProfileMenu';
import { AppLogo } from './AppLogo';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenApiKey: () => void;
  onSelectChapter: (chapterId: string, action: 'revise' | 'qcm' | 'exercise') => void;
  onSelectPromptTemplate: (prompt: string) => void;
  chapters: Chapter[];
  progress: Record<string, ChapterProgress>;
  activeChapterId: string | null;
  onLogout: () => void;
  onOpenCurriculum?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  onOpenSettings,
  onOpenApiKey,
  onSelectChapter,
  onSelectPromptTemplate,
  chapters,
  progress,
  activeChapterId,
  onLogout,
  onOpenCurriculum
}) => {
  const profile = getUserProfile();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMathsOpen, setIsMathsOpen] = useState(false);
  const [isPhysiqueOpen, setIsPhysiqueOpen] = useState(false);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const mathsChapters = chapters.filter(c => c.subject === 'Mathématiques');
  const physiqueChapters = chapters.filter(c => c.subject === 'Physique');

  // Sujets d'entraînement et requêtes réelles pour la Terminale D/C
  const examPrompts = [
    { 
      title: "Équation différentielle du 2nd ordre", 
      prompt: "Résous pas à pas l'équation différentielle suivante avec toutes les justifications mathématiques et vérifications : y'' + 4y = 0 avec y(0) = 1 et y'(0) = 2." 
    },
    { 
      title: "Étude de fonction avec ln et exp", 
      prompt: "Fais une étude complète de la fonction f(x) = (ln(x) + 1) / x : ensemble de définition, limites aux bornes, dérivée, tableau de variations et asymptotes." 
    },
    { 
      title: "Mouvement dans un champ de pesanteur", 
      prompt: "Soit un projectile lancé avec une vitesse v0 faisant un angle alpha avec l'horizontale. Établis l'équation de la trajectoire, la portée maximale et la flèche." 
    },
    { 
      title: "Nombres complexes & géométrie", 
      prompt: "Soit les points A, B, C d'affixes respectives zA = 1+i, zB = 3-i, zC = 2+2i. Détermine la nature du triangle ABC et calcule l'affixe du centre du cercle circonscrit." 
    },
    { 
      title: "Dénombrement & Probabilités", 
      prompt: "Propose un problème de probabilités conditionnelles avec tirage sans remise dans une urne, avec arbre pondéré et calcul d'espérance mathématique." 
    }
  ];

  if (!isOpen) {
    return (
      <div className="hidden md:flex flex-col items-center py-4 px-2 bg-gray-900 border-r border-gray-800 w-14 h-screen justify-between z-20 flex-shrink-0 select-none">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Ouvrir le panneau latéral"
          >
            <PanelLeft size={18} />
          </button>
          <button 
            onClick={onNewChat}
            className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-900/40 transition-colors"
            title="Nouveau sujet"
          >
            <Plus size={18} />
          </button>
          {onOpenCurriculum && (
            <button 
              onClick={onOpenCurriculum}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Programme officiel"
            >
              <BookOpen size={18} />
            </button>
          )}
        </div>

        {/* User avatar collapsed */}
        <button 
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-900/40"
          title={profile.nickname ? `Profil de ${profile.nickname}` : 'Profil élève'}
        >
          {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : (profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'É')}
        </button>
      </div>
    );
  }

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 h-screen flex flex-col justify-between flex-shrink-0 z-30 select-none text-gray-300 font-sans">
      
      {/* Top Section */}
      <div className="p-3 border-b border-gray-800">
        {/* Brand & collapse */}
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <AppLogo size={30} className="w-7.5 h-7.5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-gray-100">
                Prépa Concours
              </h1>
              <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
                Terminale D &amp; C
              </p>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            title="Réduire le panneau latéral"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* "+ Nouveau sujet" button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-blue-900/30 group"
        >
          <Plus size={15} className="group-hover:scale-110 transition-transform" />
          <span>Nouveau sujet</span>
        </button>

        {/* Navigation principale */}
        <nav className="mt-3 space-y-1 text-xs">
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-left font-medium"
          >
            <Sparkles size={15} className="text-blue-400" />
            <span>Tuteur IA &amp; Résolution</span>
          </button>

          {onOpenCurriculum && (
            <button 
              onClick={onOpenCurriculum}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-left font-medium"
            >
              <BookOpen size={15} className="text-indigo-400" />
              <span>Programme &amp; Fiches ({chapters.length})</span>
            </button>
          )}
        </nav>
      </div>

      {/* Middle Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3 custom-scrollbar text-xs">
        
        {/* Search inside sidebar */}
        {showSearchInput && (
          <div className="px-2 mb-2">
            <input 
              type="text"
              placeholder="Filtrer chapitres &amp; sujets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}

        {/* Section Mathématiques */}
        <div className="space-y-1">
          <button 
            onClick={() => setIsMathsOpen(!isMathsOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-gray-400 hover:text-gray-200 font-semibold uppercase tracking-wider rounded-md hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Mathématiques ({mathsChapters.length})</span>
            </div>
            {isMathsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {isMathsOpen && (
            <div className="ml-2 pl-2 border-l border-gray-800 space-y-1 mt-0.5">
              {mathsChapters
                .filter(c => !searchFilter || c.title.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((chap) => {
                  const isMastered = progress[chap.id]?.status === 'Maîtrisé';
                  const isInProgress = progress[chap.id]?.status === 'En cours';

                  return (
                    <div 
                      key={chap.id}
                      className={`group p-1.5 rounded-lg hover:bg-gray-800 transition-colors ${activeChapterId === chap.id ? 'bg-blue-600/15 border border-blue-500/25' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span 
                          onClick={() => onSelectChapter(chap.id, 'revise')}
                          className="truncate text-[11px] text-gray-300 group-hover:text-white cursor-pointer"
                          title={chap.title}
                        >
                          {chap.title}
                        </span>
                        {isMastered ? (
                          <CheckCircle2 size={11} className="text-green-400 flex-shrink-0" />
                        ) : isInProgress ? (
                          <Circle size={8} className="text-amber-400 flex-shrink-0 fill-amber-400" />
                        ) : (
                          <Circle size={6} className="text-gray-600 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'revise')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          Fiche
                        </button>
                        <span>·</span>
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'qcm')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          QCM
                        </button>
                        <span>·</span>
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'exercise')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          Exo
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Section Physique-Chimie */}
        <div className="space-y-1">
          <button 
            onClick={() => setIsPhysiqueOpen(!isPhysiqueOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-gray-400 hover:text-gray-200 font-semibold uppercase tracking-wider rounded-md hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Physique ({physiqueChapters.length})</span>
            </div>
            {isPhysiqueOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {isPhysiqueOpen && (
            <div className="ml-2 pl-2 border-l border-gray-800 space-y-1 mt-0.5">
              {physiqueChapters
                .filter(c => !searchFilter || c.title.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((chap) => {
                  const isMastered = progress[chap.id]?.status === 'Maîtrisé';
                  const isInProgress = progress[chap.id]?.status === 'En cours';

                  return (
                    <div 
                      key={chap.id}
                      className={`group p-1.5 rounded-lg hover:bg-gray-800 transition-colors ${activeChapterId === chap.id ? 'bg-blue-600/15 border border-blue-500/25' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span 
                          onClick={() => onSelectChapter(chap.id, 'revise')}
                          className="truncate text-[11px] text-gray-300 group-hover:text-white cursor-pointer"
                          title={chap.title}
                        >
                          {chap.title}
                        </span>
                        {isMastered ? (
                          <CheckCircle2 size={11} className="text-green-400 flex-shrink-0" />
                        ) : isInProgress ? (
                          <Circle size={8} className="text-amber-400 flex-shrink-0 fill-amber-400" />
                        ) : (
                          <Circle size={6} className="text-gray-600 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'revise')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          Fiche
                        </button>
                        <span>·</span>
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'qcm')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          QCM
                        </button>
                        <span>·</span>
                        <button 
                          onClick={() => onSelectChapter(chap.id, 'exercise')}
                          className="hover:text-blue-400 hover:underline"
                        >
                          Exo
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Sujets types d'examen & Prompts rapides */}
        <div className="space-y-1 pt-1">
          <button 
            onClick={() => setIsPromptsOpen(!isPromptsOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-gray-400 hover:text-gray-200 font-semibold uppercase tracking-wider rounded-md hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-blue-400" />
              <span>Sujets types concours</span>
            </div>
            {isPromptsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {isPromptsOpen && (
            <div className="space-y-0.5 mt-0.5">
              {examPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPromptTemplate(item.prompt)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 text-left truncate transition-colors group"
                  title={item.title}
                >
                  <Circle size={5} className="text-gray-600 group-hover:text-blue-400 flex-shrink-0" />
                  <span className="truncate text-[11px]">{item.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Profile Bar */}
      <div className="p-2 border-t border-gray-800 relative">
        <div className="flex items-center justify-between px-1 py-1">
          {/* User profile button */}
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-left group max-w-[155px]"
          >
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              {profile.nickname ? profile.nickname.charAt(0).toUpperCase() : (profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'É')}
            </div>
            <div className="truncate flex items-center gap-1 text-xs text-gray-300 group-hover:text-white">
              <span className="font-medium truncate">{profile.nickname || 'Élève'}</span>
              <ChevronDown size={11} className="text-gray-500" />
            </div>
          </button>

          {/* Quick utility icons */}
          <div className="flex items-center gap-0.5 text-gray-400">
            <button 
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1.5 hover:text-white hover:bg-gray-800 rounded-md transition-colors" 
              title="Rechercher"
            >
              <Search size={14} />
            </button>
            <button 
              onClick={onOpenSettings}
              className="p-1.5 hover:text-white hover:bg-gray-800 rounded-md transition-colors" 
              title="Paramètres (Ctrl ⇧ ,)"
            >
              <Settings size={14} />
            </button>
            <button 
              onClick={onToggle}
              className="p-1.5 hover:text-white hover:bg-gray-800 rounded-md transition-colors" 
              title="Réduire"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        </div>

        {/* Profile Menu Popup */}
        <ProfileMenu 
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          onOpenSettings={onOpenSettings}
          onOpenApiKey={onOpenApiKey}
          onLogout={onLogout}
          onOpenCurriculum={onOpenCurriculum}
        />
      </div>

    </aside>
  );
};
