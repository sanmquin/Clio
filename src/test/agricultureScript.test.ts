import { describe, it, expect } from 'vitest';
import { hydrateText, agricultureScript, agricultureReading } from '../data/agricultureScript';

describe('Agriculture Script & Data Models', () => {
  it('hydrates user name into prompt templates correctly', () => {
    const rawPrompt = 'Hola {userName}, bienvenido a la lección sobre la Agricultura.';
    const hydrated = hydrateText(rawPrompt, { username: 'Sofia' });
    expect(hydrated).toBe('Hola Sofia, bienvenido a la lección sobre la Agricultura.');
  });

  it('hydrates domain attributes if present', () => {
    const rawPrompt = 'Hola {userName}, bienvenido a la clase de {gradeLevel}.';
    const hydrated = hydrateText(rawPrompt, {
      username: 'Mateo',
      domainAttributes: { gradeLevel: '3º de Secundaria' },
    });
    expect(hydrated).toBe('Hola Mateo, bienvenido a la clase de 3º de Secundaria.');
  });

  it('contains hardware check steps at initial sequence', () => {
    expect(agricultureScript.initialStepId).toBe('sound_check');
    const soundCheckStep = agricultureScript.steps.find((s) => s.id === 'sound_check');
    const micCheckStep = agricultureScript.steps.find((s) => s.id === 'mic_check');

    expect(soundCheckStep).toBeDefined();
    expect(soundCheckStep?.type).toBe('sound-check');
    expect(soundCheckStep?.nextStepId).toBe('mic_check');

    expect(micCheckStep).toBeDefined();
    expect(micCheckStep?.type).toBe('mic-check');
    expect(micCheckStep?.nextStepId).toBe('[1] Origen');
  });

  it('contains all 16 lesson questions in sequential order with nextStepId pointers', () => {
    const questions = agricultureScript.steps.filter(
      (s) => s.type !== 'sound-check' && s.type !== 'mic-check'
    );
    expect(questions.length).toBe(16);

    for (let i = 0; i < questions.length - 1; i++) {
      expect(questions[i].nextStepId).toBe(questions[i + 1].id);
    }
    expect(questions[questions.length - 1].nextStepId).toBeNull();
  });

  it('includes educational reading lecture content', () => {
    expect(agricultureReading.title).toContain('El Origen de la Agricultura');
    expect(agricultureReading.content).toContain('Revolución Neolítica');
  });
});
