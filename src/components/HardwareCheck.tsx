import React from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';

interface HardwareCheckProps {
  type: 'sound-check' | 'mic-check';
  onTestSound: () => void;
  onContinue: () => void;
  transcript: string;
}

export const HardwareCheck: React.FC<HardwareCheckProps> = ({
  type,
  onTestSound,
  onContinue,
  transcript,
}) => {
  if (type === 'sound-check') {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 my-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
            <Volume2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-amber-900">Verificación de Audio (Bocinas)</h3>
            <p className="text-xs text-amber-800 mt-1">
              Asegúrate de que el volumen de tu dispositivo esté encendido para escuchar las explicaciones de Clio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onTestSound}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                Reproducir Audio de Prueba 🔊
              </button>
              <button
                onClick={onContinue}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Escucho bien, continuar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-5 my-4">
      <div className="flex items-start space-x-3">
        <div className="p-3 bg-sky-500 text-white rounded-xl shadow-md">
          <span className="text-xl">🎙️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-sky-900">Verificación de Micrófono</h3>
          <p className="text-xs text-sky-800 mt-1">
            Di algo en voz alta (ej. &quot;Hola Clio&quot;). Verás tus palabras en pantalla abajo si el micrófono funciona bien.
          </p>

          <div className="mt-3 p-3 bg-white/90 border border-sky-200 rounded-lg min-h-[48px] text-xs text-slate-700 italic">
            {transcript ? (
              <span className="text-sky-950 font-medium not-italic">🎙️ &quot;{transcript}&quot;</span>
            ) : (
              <span className="text-slate-400">Esperando señal de voz...</span>
            )}
          </div>

          <div className="mt-3">
            <button
              onClick={onContinue}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Micrófono configurado, continuar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
