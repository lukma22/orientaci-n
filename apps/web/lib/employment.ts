import data from '../data/desempleo-enemdu-brujula.json';

export interface EmploymentEstimate {
  codigo: string;
  nombre: string;
  nivel: string;
  periodo: string;
  tasa_pct: number;
  ic95_pct: number[];
  n_pea: number;
  revision?: string;
  categoria?: string;
}

interface CareerEstimate {
  tasa_por_titulo: EmploymentEstimate | null;
  tasa_ocupacion_exacta: EmploymentEstimate | null;
  contexto_grupo_ocupacional: EmploymentEstimate | null;
}

const careerEstimates: Partial<Record<string, CareerEstimate>> = data.fichas;
const quarters = data.metadatos.trimestres;
const percent = new Intl.NumberFormat('es-EC', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const ENEMDU_PERIOD = quarters[0] + '–' + quarters[quarters.length - 1];
export const ENEMDU_SOURCE = data.metadatos.referencias[0].url;
export const TITLE_ESTIMATE_UNAVAILABLE = 'Sin estimación por título';

export function employmentForCareer(slug: string) {
  const career = careerEstimates[slug];
  const exactOccupation = career?.tasa_ocupacion_exacta;
  return {
    title: career?.tasa_por_titulo ?? null,
    occupation: exactOccupation ?? career?.contexto_grupo_ocupacional ?? null,
    occupationLabel: exactOccupation ? 'Desempleo en la ocupación' : 'Contexto del grupo ocupacional',
  };
}

export function unemploymentRate(estimate: EmploymentEstimate) {
  return percent.format(estimate.tasa_pct / 100);
}

export function confidenceInterval(estimate: EmploymentEstimate) {
  return estimate.ic95_pct.map(value => percent.format(value / 100)).join('–');
}

export type EmploymentGroup = 'education' | 'occupation' | 'industry' | 'category' | 'general';
interface EmploymentGroupData {
  label: string;
  definition: string;
  estimates: Record<string, EmploymentEstimate>;
}

const workDefinition = 'Se usa el trabajo principal de los ocupados y el último trabajo de los desempleados con experiencia.';
export const employmentGroups: Record<EmploymentGroup, EmploymentGroupData> = {
  education: {
    label: 'Título o campo de estudio (CNTP)',
    definition: 'Desempleo entre personas activas con ese título o campo de estudio. Incluye a quienes buscan su primer empleo.',
    estimates: data.formacion_cntp,
  },
  occupation: {
    label: 'Ocupación (CIUO)',
    definition: workDefinition,
    estimates: data.ocupaciones_ciuo,
  },
  industry: {
    label: 'Actividad económica (CIIU)',
    definition: workDefinition + ' Cada revisión CIIU tiene su propio período de estimación.',
    estimates: data.actividades_ciiu,
  },
  category: {
    label: 'Categoría ocupacional',
    definition: workDefinition,
    estimates: data.categorias_ocupacionales,
  },
  general: {
    label: 'Desempleo general',
    definition: 'Desempleo entre personas activas del grupo. Incluye a quienes buscan su primer empleo.',
    estimates: Object.fromEntries(data.desempleo_general.map(estimate => [
      [estimate.categoria, estimate.codigo, estimate.periodo].join('|'), estimate,
    ])),
  },
};
