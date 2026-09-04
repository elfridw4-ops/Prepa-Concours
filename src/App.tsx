/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { getApiKey } from './utils/storage';
import { ApiKeyScreen } from './components/ApiKeyScreen';
import { Dashboard } from './components/Dashboard';
import { RevisionPanel } from './components/RevisionPanel';
import { QCMMode } from './components/QCMMode';
import { ExerciseMode } from './components/ExerciseMode';
import { chapters } from './data/chapters';
import { UpdateNotification } from './components/pwa/UpdateNotification';
import { InstallPrompt } from './components/pwa/InstallPrompt';

interface HistoryState {
  section: 'accueil' | 'programme';
  mode: 'revise' | 'qcm' | 'exercise' | null;
  chapterId: string | null;
  isRootShield?: boolean;
}

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'accueil' | 'programme'>('accueil');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'revise' | 'qcm' | 'exercise' | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const blockPushRef = useRef<boolean>(false);
  const lastRootTapRef = useRef<number>(0);

  // Vérifie la présence de la clé au chargement
  useEffect(() => {
    setHasKey(!!getApiKey());
  }, []);

  // Configuration du tracking d'historique quand la clé est présente
  useEffect(() => {
    if (!hasKey) return;

    // Crée la pile de base : [shield state, home state]
    window.history.replaceState({ isRootShield: true }, '');

    const home: HistoryState = {
      section: activeSection,
      mode: activeMode,
      chapterId: activeChapterId,
    };
    window.history.pushState(home, '');

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (!state) return;

      if (state.isRootShield) {
        const now = Date.now();
        if (now - lastRootTapRef.current < 2000) {
          // Double-clic : On accepte de quitter en reculant derrière le bouclier
          window.history.go(-1);
        } else {
          // Premier clic : On retient l'utilisateur et affiche le Toast
          lastRootTapRef.current = now;
          setShowExitConfirm(true);

          // On re-pousse l'état actif sur l'historique pour bloquer le pop
          const baseline: HistoryState = {
            section: 'accueil',
            mode: null,
            chapterId: null,
          };
          blockPushRef.current = true;
          window.history.pushState(baseline, '');
        }
        return;
      }

      // Synchronise l'état React depuis le pop du navigateur
      const hState = state as HistoryState;
      blockPushRef.current = true;
      setActiveSection(hState.section);
      setActiveMode(hState.mode);
      setActiveChapterId(hState.chapterId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasKey]);

  // Met à jour l'historique popstate lors des changements d'états programmatiques
  useEffect(() => {
    if (!hasKey) return;

    if (blockPushRef.current) {
      blockPushRef.current = false;
      return;
    }

    const currentState: HistoryState = {
      section: activeSection,
      mode: activeMode,
      chapterId: activeChapterId,
    };

    const hState = window.history.state as HistoryState | null;
    if (
      !hState ||
      hState.isRootShield ||
      hState.section !== currentState.section ||
      hState.mode !== currentState.mode ||
      hState.chapterId !== currentState.chapterId
    ) {
      window.history.pushState(currentState, '');
    }
  }, [activeSection, activeMode, activeChapterId, hasKey]);

  // Décompte d'invisibilité automatique pour le Toast de sortie
  useEffect(() => {
    if (showExitConfirm) {
      const timer = setTimeout(() => {
        setShowExitConfirm(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showExitConfirm]);

  const handleKeySaved = () => {
    setHasKey(true);
  };

  const handleClearKey = () => {
    setHasKey(false);
  };

  const handleSelectChapter = (chapterId: string, action: 'revise' | 'qcm' | 'exercise') => {
    setActiveChapterId(chapterId);
    setActiveMode(action);
  };

  const handleCloseModal = () => {
    const hState = window.history.state as HistoryState | null;
    if (hState && hState.mode !== null) {
      window.history.back();
    } else {
      setActiveChapterId(null);
      setActiveMode(null);
    }
  };

  // Si pas de clé, on affiche l'écran de saisie
  if (!hasKey) {
    return (
      <>
        <ApiKeyScreen onKeySaved={handleKeySaved} />
        <UpdateNotification />
        <InstallPrompt />
      </>
    );
  }

  // Trouve le chapitre actif
  const activeChapter = activeChapterId ? chapters.find(c => c.id === activeChapterId) : null;

  return (
    <div className="antialiased selection:bg-blue-500/30 selection:text-blue-200">
      <Dashboard 
        onClearKey={handleClearKey} 
        onSelectChapter={handleSelectChapter}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      {/* Modales pour les différents modes */}
      {activeChapter && activeMode === 'revise' && (
        <RevisionPanel chapter={activeChapter} onClose={handleCloseModal} />
      )}
      
      {activeChapter && activeMode === 'qcm' && (
        <QCMMode chapter={activeChapter} onClose={handleCloseModal} />
      )}
      
      {activeChapter && activeMode === 'exercise' && (
        <ExerciseMode chapter={activeChapter} onClose={handleCloseModal} />
      )}

      {/* Notification de confirmation de sortie pour Android / PWA */}
      {showExitConfirm && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-800 text-gray-200 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-sm font-medium">
            Appuyez à nouveau pour quitter l'application
          </p>
        </div>
      )}

      <UpdateNotification />
      <InstallPrompt />
    </div>
  );
}
