import React, { useRef, useEffect } from 'react';
import { 
  Settings, 
  BookOpen, 
  Key, 
  LogOut
} from 'lucide-react';
import { getUserProfile } from '../utils/userProfile';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenApiKey: () => void;
  onLogout: () => void;
  onOpenCurriculum?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenApiKey,
  onLogout,
  onOpenCurriculum
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = getUserProfile();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-16 left-3 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-gray-300 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* User profile info */}
      <div className="px-3 py-2 border-b border-gray-800 mb-1">
        <p className="font-semibold text-gray-100">{profile.fullName || profile.nickname}</p>
        <p className="text-[11px] text-gray-400 truncate">{profile.email}</p>
        <p className="text-[10px] text-blue-400 font-medium mt-0.5">{profile.track || 'Terminale D & C'}</p>
      </div>

      {/* Menu options */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Settings size={15} className="text-gray-400" />
            <span>Paramètres</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Ctrl ⇧ ,</span>
        </button>

        {onOpenCurriculum && (
          <button
            onClick={() => {
              onClose();
              onOpenCurriculum();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-left"
          >
            <BookOpen size={15} className="text-blue-400" />
            <span>Programme complet</span>
          </button>
        )}

        <button
          onClick={() => {
            onClose();
            onOpenApiKey();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Key size={15} className="text-blue-400" />
            <div>
              <p className="leading-tight">Clé API Gemini</p>
              <p className="text-[10px] text-gray-500">Google AI Studio</p>
            </div>
          </div>
        </button>

        <div className="my-1 border-t border-gray-800" />

        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors text-left"
        >
          <LogOut size={15} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};
