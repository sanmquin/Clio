import React from 'react';
import { BookOpen, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  onUpdateUsername: (name: string) => void;
  onOpenReading: () => void;
  currentStepIndex: number;
  totalSteps: number;
  currentStepTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onUpdateUsername,
  onOpenReading,
  currentStepIndex,
  totalSteps,
  currentStepTitle
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(userProfile.username || '');

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUsername(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const progressPercent = Math.min(Math.round(((currentStepIndex + 1) / totalSteps) * 100), 100);

  return (
    <header className="bg-white border-b border-amber-200/60 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-white p-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clio</h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-300/50">
                  Tutora de Historia 🌍
                </span>
              </div>
              <p className="text-xs text-slate-5 resolved-leading text-slate-500">
                Aprende Historia Universal con voz e interacción
              </p>
            </div>
          </div>

          {/* User Profile & Reading Overlay Toggle */}
          <div className="flex items-center space-x-3">
            {/* User Profile Pill */}
            <div className="bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="text-xs border rounded px-1 py-0.5 w-24 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Tu nombre..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium hover:bg-amber-600"
                  >
                    OK
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  title="Haz clic para cambiar nombre"
                >
                  <span>{userProfile.username || 'Estudiante'}</span>
                  <span className="text-[10px] text-amber-600 underline ml-0.5">(Editar)</span>
                </button>
              )}
            </div>

            {/* View Reading Button */}
            <button
              onClick={onOpenReading}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-300/70 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Ver Lectura</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span className="truncate max-w-xs sm:max-w-md">
              Paso {currentStepIndex + 1} de {totalSteps}: <strong className="text-slate-800">{currentStepTitle || ''}</strong>
            </span>
            <span className="font-semibold text-amber-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
