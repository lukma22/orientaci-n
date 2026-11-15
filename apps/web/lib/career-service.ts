import catalog from '../data/carreras-muestra.json';
import type { Participant } from './assessment';

export type Offer = typeof catalog.careers[number]['offers'][number];
export interface Career {
  slug: string; name: string; description: string; offers: Offer[];
  reference: Offer; sourceLabel: string;
}
const SOURCES: Record<number,string> = {
  1:'Vacantes web (octubre de 2026)',2:'ENEMDU 2025',3:'Vacantes web + ENEMDU 2025',
  4:'IESS (marzo de 2025)',5:'Vacantes web + IESS 2025',6:'ENEMDU + IESS 2025',7:'Vacantes web + ENEMDU + IESS 2025',
};
function normalized(s: string) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace('DISTRITO METROPOLITANO DE ',''); }

export interface CareerGateway { list(participant: Participant): Career[] }
// Las 3 carreras del diseño aprobado siguen siendo una muestra. No se inventa
// un matching: el Excel no contiene perfiles RIASEC de carreras ni un C-Index.
export const localCareerGateway: CareerGateway = {
  list(participant) {
    return catalog.careers.map(career => {
      const offers = [...career.offers].sort((a,b) => {
        const score = (o: Offer) => (participant.canton && normalized(o['Cantón'])===normalized(participant.canton) ? 2 : 0) + (participant.province && normalized(o.Provincia)===normalized(participant.province) ? 1 : 0);
        return score(b)-score(a);
      });
      const reference = offers.find(o => participant.canton && normalized(o['Cantón'])===normalized(participant.canton))
        ?? offers.find(o => participant.province && normalized(o.Provincia)===normalized(participant.province))
        ?? offers.find(o=>normalized(o['Cantón'])==='QUITO') ?? offers[0];
      return {...career,offers,reference,sourceLabel:SOURCES[Number(reference.Fuente)] ?? 'Catálogo proporcionado'};
    });
  },
};
export function money(value: number | null | undefined) {
  return value == null ? 'Sin dato' : new Intl.NumberFormat('es-EC',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
}
