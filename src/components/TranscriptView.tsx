import React, { useState, useEffect } from 'react';
import { ScriptStep, VoiceState } from '../types';
import { VoiceStatusBadge } from './VoiceStatusBadge';
import { HardwareCheck } from './HardwareCheck';
import { Send, Edit3, MessageSquare, AlertCircle } from 'lucide-react';

interface TranscriptViewProps {
  currentStep: ScriptStep;
  promptText: string;
  voiceState: VoiceState;
  transcript: string;
  errorMessage: string | null;
  onSubmitManualTranscript: (text: string) => void;
  onTestSound: () => void;
  onSkipStep: () => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  currentStep,
  promptText,
  voiceState,
  transcript,
  errorMessage,
  onSubmitManualTranscript,
  onTestSound,
  onSkipStep,
}) => {
  const [manualInput, setManualInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setManualInput('');
    setIsEditing(false);
  }, [currentStep.id]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSubmitManualTranscript(manualInput.trim());
      setManualInput('');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-4">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Conversación en Vivo
          </span>
        </div>
        <VoiceStatusBadge state={voiceState} />
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 p-4 text-xs text-red-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Nota: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Conversation Box */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Hardware Check Step Render */}
        {currentStep.type === 'sound-check' || currentStep.type === 'mic-check' ? (
          <HardwareCheck
            type={currentStep.type}
            onTestSound={onTestSound}
            onContinue={onSkipStep}
            transcript={transcript}
          />
        ) : null}

        {/* Clio Prompt Message Card */}
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-amber-500/20 flex-shrink-0">
            C
          </div>
          <div className="flex-1 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-900">Clio (Tutora)</span>
              <span className="text-[10px] text-amber-700 font-medium">Historia Universal</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              {promptText}
            </p>
          </div>
        </div>

        {/* User Response Area */}
        {currentStep.type !== 'sound-check' && (
          <div className="flex items-start space-x-3.5 pt-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
              Tú
            </div>

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleManualSubmit} className="space-y-2">
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={3}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!manualInput.trim()}
                      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm"
                    >
                      <span>Enviar</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative group min-h-[72px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-500">Tu Voz / Respuesta</span>
                    <button
                      onClick={() => {
                        setManualInput(transcript);
                        setIsEditing(true);
                      }}
                      className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center space-x-1 opacity-80 hover:opacity-100 transition-opacity"
                      title="Escribir manualmente"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Escribir texto</span>
                    </button>
                  </div>

                  {transcript ? (
                    <p className="text-sm text-slate-900 font-medium">
                      &quot;{transcript}&quot;
                    </p>
                  ) : voiceState === 'listening' ? (
                    <p className="text-sm text-slate-400 italic animate-pulse">
                      Escuchando... habla ahora o presiona escribir texto.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Las respuestas que pronuncies aparecerán aquí automáticamente.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
