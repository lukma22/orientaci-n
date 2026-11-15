import { useState } from 'react';
import {
  confidenceInterval, employmentForCareer, employmentGroups, ENEMDU_SOURCE,
  TITLE_ESTIMATE_UNAVAILABLE, unemploymentRate, type EmploymentEstimate, type EmploymentGroup,
} from '../lib/employment';

const counts = new Intl.NumberFormat('es-EC');
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

function EstimateDetails({ estimate }: { estimate: EmploymentEstimate }) {
  return <>
    <p className="bdr-data-note">Ecuador · {estimate.periodo} · {estimate.nivel}</p>
    <p className="bdr-data-note">IC del 95 % {confidenceInterval(estimate)} · {counts.format(estimate.n_pea)} registros activos</p>
  </>;
}

function SourceNote() {
  return <p className="bdr-data-note">
    Estimaciones propias con <a className="bdr-data-source" href={ENEMDU_SOURCE} target="_blank" rel="noreferrer">microdatos de la ENEMDU (INEC)</a>.
  </p>;
}

export function CareerEmployment({ slug }: { slug: string }) {
  const { title, occupation, occupationLabel } = employmentForCareer(slug);
  return <section className="bdr-panel">
    <h2>Desempleo por título</h2>
    {title ? <>
      <p className="bdr-employment-rate">{unemploymentRate(title)}</p>
      <p className="bdr-employment-name">{title.nombre} · CNTP {title.codigo}</p>
      <EstimateDetails estimate={title} />
    </> : <p className="bdr-employment-state">{TITLE_ESTIMATE_UNAVAILABLE}</p>}
    {occupation && <div className="bdr-occupation-context">
      <h3>{occupationLabel}</h3>
      <p className="bdr-employment-name"><strong>{unemploymentRate(occupation)}</strong> · {occupation.nombre}</p>
      <p className="bdr-data-note">CIUO {occupation.codigo} · Ecuador · {occupation.periodo}</p>
    </div>}
    <SourceNote />
  </section>;
}

function groupLabel(estimate: EmploymentEstimate) {
  if (estimate.categoria) return [estimate.nombre, estimate.categoria, estimate.periodo].join(' · ');
  return [estimate.nombre, estimate.codigo, estimate.revision].filter(Boolean).join(' · ');
}

export function EmploymentExplorer() {
  const [group, setGroup] = useState<EmploymentGroup>('education');
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState('');
  const { estimates, definition } = employmentGroups[group];
  const needle = normalize(query);
  const options = Object.entries(estimates)
    .filter(([, estimate]) => normalize(groupLabel(estimate)).includes(needle))
    .sort(([, a], [, b]) => a.nombre.localeCompare(b.nombre, 'es') || a.periodo.localeCompare(b.periodo));
  const selected = options.find(([key]) => key === selection)?.[1];

  return <details className="bdr-panel bdr-employment-explorer">
    <summary>Explorar tasas de desempleo</summary>
    <p className="bdr-data-note">Consulta el mercado laboral de Ecuador por título, ocupación, actividad económica y otros grupos.</p>
    <div className="bdr-employment-filters">
      <label>Tipo de grupo
        <select value={group} onChange={event => {
          setGroup(event.currentTarget.value as EmploymentGroup);
          setQuery('');
          setSelection('');
        }}>
          {Object.entries(employmentGroups).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
      </label>
      <label>Buscar por nombre o código
        <input type="search" value={query} onChange={event => {
          setQuery(event.currentTarget.value);
          setSelection('');
        }} />
      </label>
      <label>Grupo de la ENEMDU
        <select value={selected ? selection : ''} onChange={event => setSelection(event.currentTarget.value)} disabled={!options.length}>
          <option value="">{options.length ? 'Selecciona un grupo' : 'Sin coincidencias'}</option>
          {options.map(([key, estimate]) => <option key={key} value={key}>{groupLabel(estimate)}</option>)}
        </select>
      </label>
    </div>
    <div aria-live="polite">
      {selected && <div className="bdr-occupation-context">
        <h3>{selected.nombre}</h3>
        <p className="bdr-employment-rate">{unemploymentRate(selected)}</p>
        {selected.revision && <p className="bdr-data-note">{selected.revision} · {selected.codigo}</p>}
        <EstimateDetails estimate={selected} />
      </div>}
    </div>
    <p className="bdr-data-note">{definition}</p>
    <SourceNote />
  </details>;
}
