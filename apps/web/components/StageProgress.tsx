'use client';
import { useEffect, useState } from 'react';
import { QUESTIONS, isAnswered, type TestAnswers } from '@brujula/core';

export const STAGE_MESSAGE_MS = 4200;
export function Compass({animate = false}: {animate?: boolean}) {
  return <div className={`bcf-compass${animate?' is-searching':''}`} aria-hidden="true">
    <span className="bcf-n">N</span><span className="bcf-e">E</span><span className="bcf-s">S</span><span className="bcf-w">O</span>
    <div className="bcf-needle"/><div className="bcf-pivot"/>
  </div>;
}
export function StageCelebration({stage}: {stage:number}) {
  const messages = [
    ['¡Ya encontraste tu primer norte!', 'Sigamos descubriendo lo que te mueve.'],
    ['¡Tu rumbo está cada vez más claro!', 'Solo queda una etapa. Vas muy bien.'],
    ['¡Tu mapa está listo para explorar!', 'Es momento de descubrir tu perfil de intereses.'],
  ];
  return <section className="bcf-celebration" role="status" aria-live="polite" aria-atomic="true" key={stage}>
    <Compass animate/><p className="bcf-eyebrow">ETAPA {stage} COMPLETADA</p>
    <h2>{messages[stage-1][0]}</h2><p>{messages[stage-1][1]}</p>
    <span className="bcf-message-timer" aria-hidden="true"><span/></span>
  </section>;
}
export function StageProgress({index, answers, celebration,completedStages=[]}: {index:number; answers:TestAnswers; celebration:number|null;completedStages?:number[]}) {
  const [showCheck,setShowCheck] = useState<number|null>(null);
  useEffect(()=>{
    setShowCheck(null);
    if (!celebration) return;
    const timer = setTimeout(()=>setShowCheck(celebration),900);
    return ()=>clearTimeout(timer);
  },[celebration]);
  const answered = QUESTIONS.filter(q=>isAnswered(q,answers)).length;
  return <aside className="bcf-sidebar" aria-label="Progreso por etapas">
    <div className="bcf-brand">brújula<span>.</span></div>
    <p className="bcf-sidebar-intro">ENCUENTRA TU NORTE</p>
    <ol className="bcf-stages">{[1,2,3].map(stage=>{
      const complete = (completedStages.includes(stage)||index>=stage*12||celebration===stage) && QUESTIONS.slice((stage-1)*12,stage*12).every(q=>isAnswered(q,answers));
      const active = Math.floor(index/12)+1===stage;
      const state = complete ? celebration===stage ? 'filling' : 'done' : active ? 'active':'pending';
      return <li key={stage} data-stage={stage} data-state={state} aria-current={active?'step':undefined}>
        <div className="bcf-marker" aria-hidden="true"><div className="bcf-water"/>
          <span className="bcf-symbol">{complete && (celebration!==stage || showCheck===stage) ? '✓' : stage}</span>
        </div>
        <div className="bcf-label">Etapa {stage}<small>{(stage-1)*12+1}–{stage*12}</small><em>{complete?'Completada':active?'En curso':'Por descubrir'}</em></div>
      </li>;
    })}</ol>
    <div className="bcf-total"><strong>{answered}<span> / 36</span></strong><p>preguntas respondidas</p></div>
    <p className="bcf-sidebar-note">Cada respuesta te acerca<br/>un poco más a ti.</p>
  </aside>;
}
