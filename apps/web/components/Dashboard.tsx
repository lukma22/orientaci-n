'use client';
import { useEffect,useMemo,useRef,useState,type ReactNode } from 'react';
import Link from 'next/link';
import { RIASEC_LABELS } from '@brujula/core';
import type { Assessment } from '../lib/assessment';
import { localCareerGateway,money,type Career } from '../lib/career-service';
import { employmentForCareer,ENEMDU_PERIOD,TITLE_ESTIMATE_UNAVAILABLE,unemploymentRate } from '../lib/employment';
import { CareerEmployment,EmploymentExplorer } from './Employment';
import InterestRadar from './InterestRadar';
import { Icon } from './Icons';

function Modal({title,children,onClose}: {title:string;children:ReactNode;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(ref.current&&!ref.current.open)ref.current.showModal();},[]);
  return <dialog ref={ref} className="bdr-dialog" aria-labelledby="modal-title" onCancel={onClose} onClose={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <button className="bdr-dialog-close" onClick={onClose} aria-label="Cerrar ventana"><Icon name="close"/></button>
    <h3 id="modal-title">{title}</h3>{children}
  </dialog>;
}
export function CareerDetails({career,careers}: {career:Career;careers:Career[]}) {
  const r=career.reference;
  const institutions=[...new Set(career.offers.map(o=>o.Universidad))];
  return <section className="bdr-view enter-view" aria-label="Detalle de carrera">
    <Link href="/" className="bdr-back"><Icon name="back"/>Volver a mi dashboard</Link>
    <div className="bdr-career-hero"><p className="bdr-eyebrow">EXPLORA TU SIGUIENTE PASO</p><h1 className="career-title">{career.name}</h1><p className="bdr-career-level">{r.Nivel}</p></div>
    <section className="bdr-panel bdr-description"><h2>Descripción de la carrera</h2><p>{career.description}</p>
      <div className="bdr-study"><span>Universidades</span><ul className="institution-list">{institutions.slice(0,10).map(n=><li key={n}>{n}</li>)}</ul>
      </div>
    </section>
    <div className="bdr-career-facts"><section className="bdr-panel">
      <p className="bdr-eyebrow">INGRESO MENSUAL DE REFERENCIA</p><div className="bdr-salary"><strong>{money(r.P50)}</strong><span>USD / mes · mediana</span></div>
      <p className="bdr-salary-range">P25–P75: {money(r.P25)} – {money(r.P75)}</p>
      <p className="bdr-data-note">El 50 % central de los ingresos está en ese rango.</p>
      <p className="bdr-data-note"><strong>Profesión asociada:</strong> {r['Profesión (provisional)']}.</p>
      <p className="bdr-data-note"><strong>Referencia:</strong> {r['Cantón']}, {r.Provincia}. Alcance: {r.Zona}.</p>
      <p className="bdr-data-note"><strong>Fuente:</strong> {career.sourceLabel}.</p>
      <p className="bdr-data-note">Los ingresos son orientativos.</p>
    </section><CareerEmployment slug={career.slug}/></div>
    <section className="bdr-panel bdr-other-careers"><h2>Revisa las demás carreras</h2><div className="bdr-related-list">{careers.filter(c=>c.slug!==career.slug).map(c=><Link key={c.slug} href={`/carreras/${c.slug}`} className="bdr-career-link"><span className="bdr-career-name">{c.name}</span><span className="bdr-detail-link">Ver detalles <Icon name="arrow"/></span></Link>)}</div></section>
  </section>;
}
export default function Dashboard({assessment,onRestart,selectedCareer}: {assessment:Assessment;onRestart?:()=>void;selectedCareer?:string}) {
  const careers=useMemo(()=>localCareerGateway.list(assessment.participant),[assessment.participant]);
  const [modal,setModal]=useState<'email'|'repeat'|'feedback'|null>(null);
  const [downloading,setDownloading]=useState(false);
  const [error,setError]=useState('');
  const [feedbackSent,setFeedbackSent]=useState(false);
  const profile=assessment.profile;
  const career=careers.find(c=>c.slug===selectedCareer);
  async function download() {
    if(downloading)return;
    setDownloading(true);setError('');
    try {
      const {downloadProfilePdf}=await import('../lib/export-pdf');
      await downloadProfilePdf(assessment,careers);
    } catch {setError('No se pudo generar el PDF. Inténtalo de nuevo.');}
    finally {setDownloading(false);}
  }
  return <div id="brujula-dashboard-review"><div className="bdr-app">
    <header className="bdr-header"><Link href="/" className="bdr-wordmark">brújula<span>.</span></Link><span className="bdr-header-note">Tu futuro, tu camino</span></header>
    <div className="bdr-main">{career?<CareerDetails career={career} careers={careers}/>:<section className="bdr-view enter-view" aria-label="Dashboard de resultados">
      <div className="bdr-page-heading"><p className="bdr-eyebrow">TU PUNTO DE PARTIDA</p><h1>{assessment.participant.name}, tu rumbo toma forma.</h1><p>Tus intereses abren caminos. Explora los que más llaman tu atención.</p></div>
      <section className="bdr-panel bdr-recommendations" aria-labelledby="careers-heading"><div className="bdr-panel-heading"><h2 id="careers-heading">Carreras para explorar</h2><span>Tres opciones de muestra</span></div>
        <p className="bdr-data-note">Desempleo por título · Ecuador · ENEMDU (INEC) · {ENEMDU_PERIOD}</p>
        <ol className="bdr-career-list">{careers.map((c,i)=>{
          const { title } = employmentForCareer(c.slug);
          return <li key={c.slug}><Link href={`/carreras/${c.slug}`} className="bdr-career-link">
            <span className="bdr-rank">0{i+1}</span>
            <span className="bdr-career-preview">
              <span className="bdr-career-name">{c.name}</span>
              {title ? <strong className="bdr-career-rate">{unemploymentRate(title)}</strong>
                : <span className="bdr-career-missing">{TITLE_ESTIMATE_UNAVAILABLE}</span>}
            </span>
            <span className="bdr-detail-link">Ver detalles <Icon name="arrow"/></span>
          </Link></li>;
        })}</ol>
      </section>
      <p className="catalog-notice">Estas carreras permiten explorar el catálogo. La selección personalizada según tu perfil estará disponible más adelante.</p>
      <div className="bdr-section-heading"><h2>Tu perfil</h2><span>RIASEC · <strong>{profile.code}</strong></span></div>
      <div className="bdr-profile-grid"><section className="bdr-panel" aria-labelledby="interests-heading"><div className="bdr-panel-heading"><h2 id="interests-heading">Lo que te mueve</h2></div><p className="bdr-panel-caption">Tus seis dimensiones de interés · escala 0–100.</p>
        <div className="bdr-bars">{profile.ranked.map(([k,v])=><div key={k}><div className="bdr-bar-label"><span>{RIASEC_LABELS[k]}</span><span>{v}</span></div><div className="bdr-bar" role="meter" aria-label={RIASEC_LABELS[k]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}><span style={{width:`${v}%`}}/></div></div>)}</div>
      </section><section className="bdr-panel bdr-map-panel"><div className="bdr-panel-heading"><h2>Tu mapa de intereses</h2></div><p className="bdr-panel-caption">Una mirada al conjunto de tu perfil.</p><div className="bdr-radar"><InterestRadar scores={profile.riasec}/></div><p className="bdr-dominant">{profile.ranked.slice(0,3).map(([k])=>RIASEC_LABELS[k]).join(' · ')}</p></section></div>
      {profile.hasTopTie&&<p className="catalog-notice">Hay un empate entre tus intereses principales. El código usa el orden R, I, A, S, E, C para mostrarlo de forma consistente.</p>}
      <EmploymentExplorer/>
      <div className="bdr-actions"><button className="bdr-action" onClick={()=>setModal('repeat')}><Icon name="repeat"/>Repetir test</button><button className="bdr-action bdr-action-primary" onClick={download} disabled={downloading}><Icon name="download"/>{downloading?'Preparando PDF…':'Descargar PDF'}</button><button className="bdr-action" onClick={()=>setModal('email')}><Icon name="mail"/>Enviar por correo</button></div>
      {error&&<p className="pdf-error" role="alert">{error}</p>}
    </section>}
    <section className="bdr-feedback"><div><h2>Ayúdanos a mejorar</h2><p>Tu experiencia nos ayuda a construir una mejor Brújula.</p></div><button className="bdr-text-button" onClick={()=>{setFeedbackSent(false);setModal('feedback');}}>Dejar mi opinión <Icon name="arrow"/></button></section>
    </div>
    {modal==='email'&&<Modal title="Tu perfil, a mano." onClose={()=>setModal(null)}><p>Ingresa tu correo para recibir una copia de tu perfil.</p><form onSubmit={e=>e.preventDefault()}><label htmlFor="profile-email">Correo electrónico</label><input id="profile-email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required/><p className="bdr-form-note">El envío por correo estará disponible próximamente. Por ahora puedes descargar tu PDF.</p><button className="bdr-action bdr-action-primary" type="submit" disabled>Enviar mi perfil</button></form></Modal>}
    {modal==='repeat'&&<Modal title="¿Empezamos un nuevo rumbo?" onClose={()=>setModal(null)}><p>Se reiniciará el test y se borrará este perfil de la sesión. Puedes descargarlo antes de continuar.</p><div className="bdr-dialog-actions"><button className="bdr-action" onClick={()=>setModal(null)}>Conservar mi perfil</button><button className="bdr-action bdr-action-primary" onClick={()=>{setModal(null);onRestart?.();}}>Sí, repetir test</button></div></Modal>}
    {modal==='feedback'&&<Modal title="Te escuchamos." onClose={()=>setModal(null)}>{feedbackSent?<p role="status">Gracias por ayudarnos a encontrar el rumbo. Tu opinión queda en esta sesión de prueba.</p>:<form onSubmit={e=>{e.preventDefault();setFeedbackSent(true);}}><label htmlFor="feedback">¿Qué mejorarías?</label><textarea id="feedback" required maxLength={1200} rows={4}/><p className="bdr-form-note">Esta es una prueba local; tu opinión no se envía a un servidor.</p><button className="bdr-action bdr-action-primary">Guardar opinión de prueba</button></form>}</Modal>}
  </div></div>;
}
