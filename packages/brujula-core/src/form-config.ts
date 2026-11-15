import { runtimeSteps, validateAnswerCode } from '@quill/engine/browser';
import type { FormConfig, FormOption } from '@quill/engine/browser';
import { CONTEXT_QUESTIONS, EMP_ITEMS, RIASEC_ITEMS } from './items';
import type { ModuleId, TestAnswers, TestQuestion } from './types';

export const SCALE = [
  { value: '1', label: 'Nada', points: 1 },
  { value: '2', label: 'Poco', points: 2 },
  { value: '3', label: 'Neutral / Me da igual', points: 3 },
  { value: '4', label: 'Bastante', points: 4 },
  { value: '5', label: 'Totalmente', points: 5 },
] satisfies FormOption[];

function likert(items: [string, string][], module: ModuleId, prefix: string): TestQuestion[] {
  return items.map(([group, question], i) => ({
    module, group, kind: 'likert',
    step: {
      key: `${prefix}_${String(i + 1).padStart(2, '0')}`,
      type: 'multiple_choice', question, required: true,
      options: SCALE.map(option => ({ ...option })),
      flowGroup: 'qualification', scoringEnabled: true,
    },
  }));
}

export const QUESTIONS: TestQuestion[] = [
  ...likert(RIASEC_ITEMS, 'm1', 'riasec').map((q,i) => ({...q,module:`m${Math.floor(i/12)+1}` as ModuleId})),
  ...likert(EMP_ITEMS, 'm2', 'emp'),
  ...CONTEXT_QUESTIONS.map(({key, q, opts}): TestQuestion => ({
    module: 'm3', group: key, kind: 'context',
    step: { key: `context_${key}`, type: 'multiple_choice', question: q,
      required: true, scoringEnabled: false,
      options: opts.map(label => ({label, value: label})),
    },
  })),
];

// Configuration consumable by the real Dapta engine. Context does not add points.
export const FORM_CONFIG: FormConfig = {
  version: 1, title: 'Brújula', language: 'es', layout: 'slides',
  scoring: { enabled: true }, steps: QUESTIONS.map(question => question.step),
};

export function visibleQuestions(answers: TestAnswers): TestQuestion[] {
  const visible = new Set(runtimeSteps(FORM_CONFIG, answers).map(step => step.key));
  return QUESTIONS.filter(question => visible.has(question.step.key));
}

export function isAnswered(question: TestQuestion, answers: TestAnswers): boolean {
  return validateAnswerCode(question.step, answers[question.step.key]).ok;
}

export function unansweredQuestions(answers: TestAnswers): TestQuestion[] {
  return visibleQuestions(answers).filter(question => !isAnswered(question, answers));
}

export function progressPercent(answers: TestAnswers): number {
  const questions = visibleQuestions(answers);
  if (!questions.length) return 0;
  return Math.round(100 * questions.filter(question => isAnswered(question, answers)).length / questions.length);
}

// Explicit fixtures for local tests only; no personal information is generated.
export function demoAnswers(value: 1 | 3 | 5 = 3): TestAnswers {
  return Object.fromEntries(QUESTIONS.map(question => [
    question.step.key, question.kind === 'likert' ? String(value) : question.step.options![0].value,
  ]));
}
