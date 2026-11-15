import { QUESTIONS, isAnswered, unansweredQuestions } from './form-config';
import type { ModuleId, Screen, TestAnswers } from './types';

export interface SessionState {
  screen: Screen;
  answers: TestAnswers;
  position: Record<ModuleId, number>;
}
export type SessionAction =
  | { type: 'start' }
  | { type: 'answer'; key: string; value: string }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'restart' };

export function initialSession(): SessionState {
  return { screen: 'intro', answers: {}, position: { m1: 0, m2: 0, m3: 0 } };
}

export function questionsIn(module: ModuleId) {
  return QUESTIONS.filter(question => question.module === module);
}

// One state machine enforces bounds and required answers for buttons and keyboard.
export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === 'restart') return initialSession();
  if (action.type === 'start') return { ...state, screen: 'm1' };
  if (state.screen === 'intro' || state.screen === 'results') return state;
  const module = state.screen;
  const questions = questionsIn(module);
  const index = state.position[module];
  const question = questions[index];
  if (action.type === 'answer') {
    if (action.key !== question.step.key) return state;
    const answers = { ...state.answers, [action.key]: action.value };
    return isAnswered(question, answers) ? { ...state, answers } : state;
  }
  if (action.type === 'next') {
    if (!isAnswered(question, state.answers)) return state;
    if (index < questions.length - 1) return { ...state, position: { ...state.position, [module]: index + 1 } };
    if (module === 'm3') return unansweredQuestions(state.answers).length ? state : { ...state, screen: 'results' };
    const next: ModuleId = module === 'm1' ? 'm2' : 'm3';
    return { ...state, screen: next, position: { ...state.position, [next]: 0 } };
  }
  if (index > 0) return { ...state, position: { ...state.position, [module]: index - 1 } };
  if (module === 'm1') return { ...state, screen: 'intro' };
  const previous: ModuleId = module === 'm2' ? 'm1' : 'm2';
  return { ...state, screen: previous, position: { ...state.position, [previous]: questionsIn(previous).length - 1 } };
}
