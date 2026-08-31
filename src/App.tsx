import { useState } from 'react';
import { agricultureScript } from './data/agricultureScript';
import { UserProfile } from './types';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import { Header } from './components/Header';
import { VoiceControls } from './components/VoiceControls';
import { TranscriptView } from './components/TranscriptView';
import { ReadingOverlay } from './components/ReadingOverlay';
import { HistoryReviewModal } from './components/HistoryReviewModal';
import { Sparkles, BookOpen, Mic } from 'lucide-react';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Carlos',
    allowedLessons: ['0.Agriculture'],
  });

  const [isReadingOpen, setIsReadingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    voiceState,
    currentStep,
    stepIndex,
    totalSteps,
    transcript,
    history,
    errorMessage,
    startAgent,
    pauseAgent,
    resumeAgent,
    replayPrompt,
    skipStep,
    submitManualTranscript,
    testSoundPlayback,
    updateHistoryItem,
    resetHistory,
    getPromptText,
  } = useVoiceAgent({
    script: agricultureScript,
    userProfile,
  });

  const handleUpdateUsername = (newName: string) => {
    setUserProfile((prev) => ({ ...prev, username: newName }));
  };

  const handleOpenReading = () => {
    pauseAgent();
    setIsReadingOpen(true);
  };

  const handleCloseReading = () => {
    setIsReadingOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        userProfile={userProfile}
        onUpdateUsername={handleUpdateUsername}
        onOpenReading={handleOpenReading}
        currentStepIndex={stepIndex}
        totalSteps={totalSteps}
        currentStepTitle={currentStep?.id}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Banner Welcome Card */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
              <h2 className="text-lg font-extrabold">{agricultureScript.title}</h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              {agricultureScript.description}
            </p>
          </div>

          <button
            onClick={handleOpenReading}
            className="bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5 flex-shrink-0"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Leer Material</span>
          </button>
        </div>

        {/* Live Controls */}
        <VoiceControls
          voiceState={voiceState}
          onStart={startAgent}
          onPause={pauseAgent}
          onResume={resumeAgent}
          onReplayPrompt={replayPrompt}
          onSkipStep={skipStep}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* Transcript & Step Interaction Box */}
        {currentStep && (
          <TranscriptView
            currentStep={currentStep}
            promptText={getPromptText(currentStep)}
            voiceState={voiceState}
            transcript={transcript}
            errorMessage={errorMessage}
            onSubmitManualTranscript={submitManualTranscript}
            onTestSound={testSoundPlayback}
            onSkipStep={skipStep}
          />
        )}

        {/* Footer info tip */}
        <div className="text-center text-xs text-slate-500 py-2 flex items-center justify-center space-x-1">
          <Mic className="w-3.5 h-3.5 text-amber-600" />
          <span>Diseñado para estudiantes hispanohablantes. Puedes responder con tu voz o escribiendo.</span>
        </div>
      </main>

      {/* Reading Modal Overlay */}
      <ReadingOverlay
        isOpen={isReadingOpen}
        onClose={handleCloseReading}
        lecture={agricultureScript.lecture}
      />

      {/* History Review & Export Modal */}
      <HistoryReviewModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        steps={agricultureScript.steps}
        history={history}
        onUpdateHistoryItem={updateHistoryItem}
        onResetHistory={resetHistory}
      />
    </div>
  );
}
