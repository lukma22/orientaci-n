import { computeResults, type TestAnswers, type TestResults } from '@brujula/core';

export const ACADEMIC_STAGES = ['Bachillerato', 'Educación superior', 'Reorientación profesional'] as const;
export interface Participant {
  name: string;
  academicStage: typeof ACADEMIC_STAGES[number];
  province: string;
  canton: string;
}
export interface Assessment {
  version: 'riasec36-v1';
  participant: Participant;
  answers: TestAnswers;
  profile: TestResults;
  completedAt: string;
}
const KEY = 'brujula-completed-riasec36-v1';
// Almacenamiento temporal de la pestaña; no equivale a una base de datos.
export const assessmentStore = {
  load(): Assessment | null {
    try {
      const value = JSON.parse(sessionStorage.getItem(KEY) || 'null') as Assessment | null;
      if (!value || value.version !== 'riasec36-v1' || !value.participant?.name || !ACADEMIC_STAGES.includes(value.participant.academicStage)) return null;
      return {...value, profile: computeResults(value.answers)};
    } catch { return null; }
  },
  save(value: Assessment) { try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch {} },
  clear() { try { sessionStorage.removeItem(KEY); } catch {} },
};

// Contrato para el futuro backend. El adaptador local no hace llamadas HTTP.
export interface AssessmentGateway {
  complete(participant: Participant, answers: TestAnswers): Promise<Assessment>;
  email(assessment: Assessment, email: string): Promise<void>;
}
export const localAssessmentGateway: AssessmentGateway = {
  async complete(participant, answers) {
    const assessment: Assessment = {version:'riasec36-v1',participant,answers,profile:computeResults(answers),completedAt:new Date().toISOString()};
    assessmentStore.save(assessment);
    return assessment;
  },
  async email() { throw new Error('El envío por correo estará disponible próximamente.'); },
};
