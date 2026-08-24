import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { VoiceStatusBadge } from '../components/VoiceStatusBadge';
import { VoiceControls } from '../components/VoiceControls';
import { ReadingOverlay } from '../components/ReadingOverlay';

describe('Header Component', () => {
  it('renders Clio title and user name', () => {
    render(
      <Header
        userProfile={{ username: 'Lucia' }}
        onUpdateUsername={vi.fn()}
        onOpenReading={vi.fn()}
        currentStepIndex={0}
        totalSteps={18}
        currentStepTitle="sound_check"
      />
    );

    expect(screen.getByText('Clio')).toBeInTheDocument();
    expect(screen.getByText('Lucia')).toBeInTheDocument();
    expect(screen.getByText('Ver Lectura')).toBeInTheDocument();
  });

  it('allows user to open name edit form and change username', () => {
    const onUpdateUsername = vi.fn();
    render(
      <Header
        userProfile={{ username: 'Lucia' }}
        onUpdateUsername={onUpdateUsername}
        onOpenReading={vi.fn()}
        currentStepIndex={0}
        totalSteps={18}
        currentStepTitle="sound_check"
      />
    );

    fireEvent.click(screen.getByText('Lucia'));
    const input = screen.getByPlaceholderText('Tu nombre...');
    fireEvent.change(input, { target: { value: 'Maria' } });
    fireEvent.click(screen.getByText('OK'));

    expect(onUpdateUsername).toHaveBeenCalledWith('Maria');
  });
});

describe('VoiceStatusBadge Component', () => {
  it('displays correct badge text for speaking state', () => {
    render(<VoiceStatusBadge state="speaking" />);
    expect(screen.getByText('Clio hablando...')).toBeInTheDocument();
  });

  it('displays correct badge text for listening state', () => {
    render(<VoiceStatusBadge state="listening" />);
    expect(screen.getByText('Escuchando tu respuesta...')).toBeInTheDocument();
  });
});

describe('VoiceControls Component', () => {
  it('triggers start, replay, and skip handlers', () => {
    const onStart = vi.fn();
    const onReplay = vi.fn();
    const onSkip = vi.fn();
    const onOpenHistory = vi.fn();

    render(
      <VoiceControls
        voiceState="idle"
        onStart={onStart}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onReplayPrompt={onReplay}
        onSkipStep={onSkip}
        onOpenHistory={onOpenHistory}
      />
    );

    fireEvent.click(screen.getByText('Iniciar Lección'));
    expect(onStart).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Historial'));
    expect(onOpenHistory).toHaveBeenCalled();
  });
});

describe('ReadingOverlay Component', () => {
  it('renders lecture content when open', () => {
    const onClose = vi.fn();
    render(
      <ReadingOverlay
        isOpen={true}
        onClose={onClose}
        lecture={{
          title: 'Lectura de Prueba',
          content: 'Contenido explicativo sobre la agricultura.',
        }}
      />
    );

    expect(screen.getByText('Lectura de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido explicativo sobre la agricultura.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Entendido, volver a la lección'));
    expect(onClose).toHaveBeenCalled();
  });
});
