import React from 'react';
import { VoiceState } from '../types';
import { Mic, Volume2, Pause, Play, AlertCircle, CheckCircle2, Edit3 } from 'lucide-react';

interface VoiceStatusBadgeProps {
  state: VoiceState;
}

export const VoiceStatusBadge: React.FC<VoiceStatusBadgeProps> = ({ state }) => {
  switch (state) {
    case 'speaking':
      return (
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-300/80 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse">
          <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>Clio hablando...</span>
        </div>
      );
    case 'listening':
      return (
        <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-800 border border-rose-300/80 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse">
          <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
          <span>Escuchando tu respuesta...</span>
        </div>
      );
    case 'sound_check':
      return (
        <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-300/80 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>Prueba de Sonido</span>
        </div>
      );
    case 'mic_check':
      return (
        <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-800 border border-sky-300/80 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Mic className="w-4 h-4 text-sky-600" />
          <span>Prueba de Micrófono</span>
        </div>
      );
    case 'paused':
      return (
        <div className="inline-flex items-center space-x-2 bg-amber-100/80 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Pause className="w-4 h-4 text-amber-700" />
          <span>Pausado</span>
        </div>
      );
    case 'editing':
      return (
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-800 border border-indigo-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Edit3 className="w-4 h-4 text-indigo-600" />
          <span>Escribiendo Respuesta</span>
        </div>
      );
    case 'awaiting_selection':
      return (
        <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-purple-600" />
          <span>Selecciona una opción</span>
        </div>
      );
    case 'error':
      return (
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 border border-red-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>Atención Requerida</span>
        </div>
      );
    case 'idle':
    default:
      return (
        <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Play className="w-4 h-4 text-slate-500" />
          <span>En Espera</span>
        </div>
      );
  }
};
