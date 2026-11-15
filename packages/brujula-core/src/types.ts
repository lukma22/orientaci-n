import type { FormStep } from '@quill/engine/browser';

export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type ModuleId = 'm1' | 'm2' | 'm3';
export type Screen = 'intro' | ModuleId | 'results';
export type TestAnswers = Record<string, string>;
export type RiasecScores = Record<RiasecDimension, number>;
export interface TestQuestion {
  step: FormStep;
  module: ModuleId;
  group: string;
  kind: 'likert' | 'context';
}
export interface TestResults {
  riasec: RiasecScores;
  employability: Record<string, number>;
  context: Record<string, string>;
  ranked: [RiasecDimension, number][];
  code: string;
  catalogKey: string;
  hasTopTie: boolean;
  employabilityAverage: number;
}
export interface CareerRecommendation {
  area: string;
  carreras: string;
  instituciones: string;
  mercado: string;
}
export interface CareerRepository {
  findByProfile(profile: TestResults): Promise<CareerRecommendation | null>;
}
