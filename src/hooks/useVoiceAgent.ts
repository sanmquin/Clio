import { useState, useEffect, useRef, useCallback } from 'react';
import { Script, ScriptStep, VoiceState, UserProfile, ResponseHistoryItem } from '../types';
import { hydrateText } from '../data/agricultureScript';

interface UseVoiceAgentProps {
  script: Script;
  userProfile: UserProfile;
}

export function useVoiceAgent({ script, userProfile }: UseVoiceAgentProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [currentStepId, setCurrentStepId] = useState<string>(script.initialStepId);
  const [transcript, setTranscript] = useState<string>('');
  const [history, setHistory] = useState<ResponseHistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrimed, setIsPrimed] = useState<boolean>(false);

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const currentStepIdRef = useRef<string>(currentStepId);
  const voiceStateRef = useRef<VoiceState>(voiceState);

  // Keep refs synced
  useEffect(() => {
    currentStepIdRef.current = currentStepId;
  }, [currentStepId]);

  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);

  // Load history from localStorage on mount or profile change
  const storageKey = `clio_session_${script.id}_${userProfile.username || 'default'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          // Find next uncompleted step
          const completedStepIds = new Set(parsed.history.map((h: ResponseHistoryItem) => h.stepId));
          const nextStep = script.steps.find((s) => !completedStepIds.has(s.id));
          if (nextStep) {
            setCurrentStepId(nextStep.id);
          } else if (parsed.history.length > 0) {
            // All steps completed, set to last step or keep initial
            setCurrentStepId(script.steps[script.steps.length - 1].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load saved history:', err);
    }
  }, [script.id, userProfile.username]);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: ResponseHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        scriptId: script.id,
        username: userProfile.username,
        history: newHistory,
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Failed to persist history:', err);
    }
  }, [script.id, storageKey, userProfile.username]);

  const currentStep = script.steps.find((s) => s.id === currentStepId) || script.steps[0];
  const stepIndex = script.steps.findIndex((s) => s.id === currentStepId);

  // Get hydrated prompt text
  const getPromptText = useCallback((step: ScriptStep) => {
    return hydrateText(step.prompt, userProfile);
  }, [userProfile]);

  // Stop TTS Audio
  const stopTTS = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
  }, []);

  // Stop STT Listening
  const stopSTT = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
      recognitionRef.current = null;
    }
  }, []);

  // Prime Web Speech Synthesis Audio engine
  const primeAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const dummyUtterance = new SpeechSynthesisUtterance('');
      dummyUtterance.volume = 0;
      window.speechSynthesis.speak(dummyUtterance);
      setIsPrimed(true);
    }
  }, []);

  // Speak Prompt using Native Web TTS
  const speakText = useCallback((text: string, onEndCallback?: () => void) => {
    stopTTS();
    stopSTT();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorMessage('Tu navegador no soporta síntesis de voz (Text-to-Speech).');
      if (onEndCallback) onEndCallback();
      return;
    }

    setVoiceState('speaking');
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = (e) => {
      console.warn('TTS Speech synthesis error:', e);
      isSpeakingRef.current = false;
      if (onEndCallback) {
        onEndCallback();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [stopSTT, stopTTS]);

  // Start Speech Recognition (STT)
  const startSTT = useCallback((onResultCaptured: (text: string) => void) => {
    stopTTS();
    stopSTT();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Tu navegador no soporta reconocimiento de voz. Puedes escribir tus respuestas manualmente.');
      setVoiceState('editing');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      let accumulatedText = '';

      const resetSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        // 2.5 seconds silence auto-endpointing
        silenceTimerRef.current = setTimeout(() => {
          stopSTT();
          if (accumulatedText.trim().length > 0) {
            onResultCaptured(accumulatedText.trim());
          } else {
            // Prompt retry on empty response
            handleEmptyResponse();
          }
        }, 2500);
      };

      recognition.onstart = () => {
        setVoiceState('listening');
        setTranscript('');
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          accumulatedText += (accumulatedText ? ' ' : '') + final;
        }

        const currentDisplay = accumulatedText + (interim ? ' ' + interim : '');
        setTranscript(currentDisplay);
        resetSilenceTimer();
      };

      recognition.onerror = (event: any) => {
        console.warn('STT recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Permiso de micrófono denegado. Habilita el micrófono en tu navegador.');
          setVoiceState('error');
        } else if (event.error === 'no-speech') {
          handleEmptyResponse();
        }
      };

      recognition.onend = () => {
        if (voiceStateRef.current === 'listening') {
          if (accumulatedText.trim().length > 0) {
            onResultCaptured(accumulatedText.trim());
          } else {
            handleEmptyResponse();
          }
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      setErrorMessage('Error al inicializar micrófono.');
      setVoiceState('error');
    }
  }, [stopSTT, stopTTS]);

  // Advance step to next step ID
  const advanceStep = useCallback((stepId: string, responseText: string) => {
    // Record answer in history
    const updatedHistory = history.filter((h) => h.stepId !== stepId);
    updatedHistory.push({
      stepId,
      transcript: responseText,
      timestamp: new Date().toISOString(),
    });

    saveHistory(updatedHistory);

    const stepObj = script.steps.find((s) => s.id === stepId);
    const nextId = stepObj?.nextStepId;

    if (nextId) {
      setCurrentStepId(nextId);
      const nextStepObj = script.steps.find((s) => s.id === nextId);
      if (nextStepObj) {
        processStep(nextStepObj);
      }
    } else {
      // Completed all steps!
      setVoiceState('idle');
      speakText('¡Felicidades! Has completado todos los pasos de esta lección con éxito.');
    }
  }, [history, saveHistory, script.steps, speakText]);

  // Handle empty or uncaptured response retry
  const handleEmptyResponse = useCallback(() => {
    stopSTT();
    speakText('No pude escucharte, ¿podrías repetir por favor?', () => {
      startSTT((capturedText) => {
        advanceStep(currentStepIdRef.current, capturedText);
      });
    });
  }, [advanceStep, speakText, startSTT, stopSTT]);

  // Process and activate a step
  const processStep = useCallback((step: ScriptStep) => {
    const textToSpeak = getPromptText(step);

    if (step.type === 'sound-check') {
      setVoiceState('sound_check');
      speakText(textToSpeak);
      return;
    }

    if (step.type === 'mic-check') {
      setVoiceState('mic_check');
      speakText(textToSpeak, () => {
        startSTT((captured) => {
          advanceStep(step.id, captured);
        });
      });
      return;
    }

    if (step.type === 'multiple-choice') {
      setVoiceState('awaiting_selection');
      speakText(textToSpeak);
      return;
    }

    // Default step: Speak prompt -> start STT -> capture response -> advance
    speakText(textToSpeak, () => {
      startSTT((capturedText) => {
        advanceStep(step.id, capturedText);
      });
    });
  }, [advanceStep, getPromptText, speakText, startSTT]);

  // Main Controls
  const startAgent = useCallback(() => {
    primeAudio();
    setErrorMessage(null);
    if (currentStep) {
      processStep(currentStep);
    }
  }, [currentStep, primeAudio, processStep]);

  const pauseAgent = useCallback(() => {
    stopTTS();
    stopSTT();
    setVoiceState('paused');
  }, [stopSTT, stopTTS]);

  const resumeAgent = useCallback(() => {
    if (currentStep) {
      processStep(currentStep);
    }
  }, [currentStep, processStep]);

  const replayPrompt = useCallback(() => {
    if (currentStep) {
      processStep(currentStep);
    }
  }, [currentStep, processStep]);

  const skipStep = useCallback(() => {
    if (currentStep) {
      advanceStep(currentStep.id, '(Paso omitido por el estudiante)');
    }
  }, [advanceStep, currentStep]);

  const submitManualTranscript = useCallback((text: string) => {
    if (currentStep && text.trim()) {
      stopTTS();
      stopSTT();
      advanceStep(currentStep.id, text.trim());
    }
  }, [advanceStep, currentStep, stopSTT, stopTTS]);

  const updateHistoryItem = useCallback((stepId: string, text: string) => {
    const updated = history.map((h) => (h.stepId === stepId ? { ...h, transcript: text } : h));
    saveHistory(updated);
  }, [history, saveHistory]);

  const resetHistory = useCallback(() => {
    saveHistory([]);
    setCurrentStepId(script.initialStepId);
    setVoiceState('idle');
  }, [saveHistory, script.initialStepId]);

  // Test sound playback specifically for sound-check step
  const testSoundPlayback = useCallback(() => {
    speakText('El sonido funciona correctamente. ¡Puedes continuar!');
  }, [speakText]);

  return {
    voiceState,
    setVoiceState,
    currentStep,
    stepIndex,
    totalSteps: script.steps.length,
    transcript,
    setTranscript,
    history,
    errorMessage,
    isPrimed,
    startAgent,
    pauseAgent,
    resumeAgent,
    replayPrompt,
    skipStep,
    submitManualTranscript,
    testSoundPlayback,
    updateHistoryItem,
    resetHistory,
    getPromptText
  };
}
