import React from 'react';
import { VoiceState } from '../types';
import { Play, Pause, RotateCcw, FastForward, History } from 'lucide-react';

interface VoiceControlsProps {
  voiceState: VoiceState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplayPrompt: () => void;
  onSkipStep: () => void;
  onOpenHistory: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  voiceState,
  onStart,
  onPause,
  onResume,
  onReplayPrompt,
  onSkipStep,
  onOpenHistory,
}) => {
  const isStarted = voiceState !== 'idle';
  const isPaused = voiceState === 'paused';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-3 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Primary Action Button: Start / Pause / Resume */}
      {!isStarted ? (
        <button
          onClick={onStart}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Iniciar Lección</span>
        </button>
      ) : isPaused ? (
        <button
          onClick={onResume}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Continuar</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all"
        >
          <Pause className="w-5 h-5 fill-current" />
          <span>Pausar</span>
        </button>
      )}

      {/* Secondary Controls */}
      <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
        <button
          onClick={onReplayPrompt}
          disabled={!isStarted}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 font-medium text-xs px-3.5 py-2 rounded-lg transition-all"
          title="Repetir pregunta de la tutora"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Repetir Pregunta</span>
        </button>

        <button
          onClick={onSkipStep}
          disabled={!isStarted}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 font-medium text-xs px-3.5 py-2 rounded-lg transition-all"
          title="Omitir este paso"
        >
          <FastForward className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Omitir Paso</span>
        </button>

        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-medium text-xs px-3.5 py-2 rounded-lg transition-all"
          title="Ver historial de respuestas"
        >
          <History className="w-4 h-4 text-amber-700" />
          <span>Historial</span>
        </button>
      </div>
    </div>
  );
};
