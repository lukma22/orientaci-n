import { computeScore } from '@quill/engine/browser';
import { QUESTIONS, unansweredQuestions } from './form-config';
import type { ModuleId, RiasecDimension, RiasecScores, TestAnswers, TestResults } from './types';

const ORDER: RiasecDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];

function groupScores(_module: ModuleId, answers: TestAnswers): Record<string, number> {
  const groups = [...new Set(QUESTIONS.map(question => question.group))];
  return Object.fromEntries(groups.map(group => {
    const steps = QUESTIONS.filter(question => question.group === group).map(question => question.step);
    const sum = computeScore({ version: 1, steps, scoring: { enabled: true } }, answers);
    // Same 1..5 -> 0..100 normalization as the original; the item count is dynamic.
    const score = Math.round(100 * (sum - steps.length) / (4 * steps.length));
    return [group, score];
  }));
}

export function computeResults(answers: TestAnswers): TestResults {
  if (unansweredQuestions(answers).length) {
    throw new Error('Completa todas las preguntas antes de calcular resultados.');
  }
  const riasec = groupScores('m1', answers) as RiasecScores;
  const employability: Record<string,number> = {};
  // Stable original tie order; a tie is explicitly disclosed in the UI.
  const ranked = ORDER.map((key): [RiasecDimension, number] => [key, riasec[key]])
    .sort((a, b) => b[1] - a[1]);
  const context: Record<string,string> = {};
  const values = Object.values(employability);
  return {
    riasec, employability, context, ranked,
    code: ranked.slice(0,3).map(([key])=>key).join(''),
    catalogKey: ranked.slice(0,3).map(([key])=>key).sort().join(''),
    hasTopTie: ranked.slice(0,3).some((entry,i)=>entry[1]===ranked[i+1][1]),
    employabilityAverage: 0,
  };
}
