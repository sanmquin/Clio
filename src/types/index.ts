export type ScriptStepType = 'default' | 'multiple-choice' | 'sound-check' | 'mic-check';

export type VoiceState =
  | 'idle'
  | 'speaking'
  | 'listening'
  | 'sound_check'
  | 'mic_check'
  | 'awaiting_selection'
  | 'editing'
  | 'paused'
  | 'error';

export interface ScriptStep {
  id: string;                // Step identifier (e.g., "[1] Intro")
  prompt: string;            // Text spoken by TTS agent
  requirement: string;       // Answer criteria or educational intent
  nextStepId: string | null; // ID of next sequential step (null if final step)
  type?: ScriptStepType;     // UI step type wrapper
  options?: { id: string; label: string; text: string }[]; // Optional multiple choice options
}

export interface LectureContent {
  title: string;
  content: string;
}

export interface Script {
  id: string;
  title: string;
  description: string;
  initialStepId: string;
  steps: ScriptStep[];
  lecture?: LectureContent;
  lectures?: LectureContent[];
}

export interface UserProfile {
  username: string;
  isAdmin?: boolean;
  hasPassword?: boolean;
  allowedLessons?: string[];            // Permitted module IDs (e.g., ['0.Agriculture'])

  // Generic Domain Attributes Container
  domainAttributes?: Record<string, string>;

  // Domain attributes for Clio World History Tutor
  gradeLevel?: string;
  language?: string;
}

export interface ResponseHistoryItem {
  stepId: string;
  transcript: string;
  timestamp?: string;
}

export interface ResponseRecord {
  userId: string;
  scriptId: string;
  history: ResponseHistoryItem[];
  updatedAt: string;
}
