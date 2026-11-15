'use client';
import { useState, type FormEvent } from 'react';
import places from '../data/ecuador.json';
import { ACADEMIC_STAGES, type Participant } from '../lib/assessment';
import { Compass } from './StageProgress';
import { Icon } from './Icons';

export function BrandHeader() {
  return <header className="site-header"><a href="/" className="wordmark" aria-label="Brújula, inicio">brújula<span>.</span></a><span>Tu futuro, tu camino</span></header>;
}
export function Welcome({onStart}: {onStart:()=>void}) {
  return <><BrandHeader/><div className="welcome enter-view">
    <div className="welcome-copy"><p className="eyebrow">ENCUENTRA TU NORTE</p>
      <h1>Tu próximo paso<br/>empieza por <em>ti.</em></h1>
      <p className="hero-description">Hay muchos caminos. El tuyo comienza por descubrir lo que te mueve.</p>
      <p className="hero-support">Brújula te acompaña a reconocer tus intereses y explorar posibilidades para tu futuro.</p>
      <button className="primary-button" onClick={onStart}>Encontrar mi rumbo <Icon name="arrow"/></button>
      <div className="welcome-meta"><span>36 preguntas</span><span>3 etapas</span><span>A tu ritmo</span></div>
    </div>
    <div className="welcome-compass"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><Compass/><span className="compass-caption">Tu dirección la descubres tú.</span></div>
    <div className="welcome-bottom">{[
      ['01','Escúchate','Responde pensando en lo que te gustaría hacer.'],
      ['02','Descúbrete','Conoce tus seis dimensiones de interés.'],
      ['03','Explora','Llévate tu perfil y abre nuevos caminos.'],
    ].map(([n,t,d])=><div key={n}><span>{n}</span><div><h2>{t}</h2><p>{d}</p></div></div>)}</div>
  </div></>;
}
export function Registration({onComplete,onBack}: {onComplete:(participant:Participant)=>void;onBack:()=>void}) {
  const [name,setName] = useState('');
  const [academicStage,setStage] = useState('');
  const [province,setProvince] = useState('');
  const [canton,setCanton] = useState('');
  const cantons = places.provinces.find(p=>p.name===province)?.cantons ?? [];
  function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !ACADEMIC_STAGES.includes(academicStage as Participant['academicStage'])) return;
    onComplete({name:name.trim(),academicStage:academicStage as Participant['academicStage'],province,canton});
  }
  return <><BrandHeader/><div className="registration enter-view">
    <button className="back-link" onClick={onBack}><Icon name="back"/>Volver al inicio</button>
    <p className="eyebrow">ANTES DE EMPEZAR</p><h1>Vamos a conocerte<br/>un poquito.</h1>
    <p className="registration-description">Tu nombre y el momento en el que estás. Así, este camino se siente más tuyo.</p>
    <form onSubmit={submit} className="registration-form">
      <label htmlFor="participant-name">¿Cómo te llamas?</label>
      <input id="participant-name" name="name" autoComplete="given-name" placeholder="Tu nombre" required maxLength={64} value={name} onChange={e=>setName(e.target.value)} pattern=".*\S.*"/>
      <label htmlFor="academic-stage">¿En qué etapa estás?</label>
      <select id="academic-stage" required value={academicStage} onChange={e=>setStage(e.target.value)}>
        <option value="" disabled>Selecciona tu etapa académica</option>
        {ACADEMIC_STAGES.map(stage=><option key={stage}>{stage}</option>)}
      </select>
      <div className="location-heading"><h2>¿Dónde te gustaría estudiar?</h2><span>Opcional</span></div>
      <div className="location-fields"><div><label htmlFor="province">Provincia</label>
        <select id="province" value={province} onChange={e=>{setProvince(e.target.value);setCanton('');}}>
          <option value="">Sin preferencia</option>{places.provinces.map(p=><option key={p.name}>{p.name}</option>)}
        </select></div><div><label htmlFor="canton">Cantón</label>
        <select id="canton" value={canton} disabled={!province} onChange={e=>setCanton(e.target.value)}>
          <option value="">Sin preferencia</option>{cantons.map(c=><option key={c}>{c}</option>)}
        </select></div></div>
      <p className="form-hint">No hay respuestas correctas o incorrectas. Piensa en cuánto te entusiasma cada actividad, aunque todavía no la domines.</p>
      <button className="primary-button" type="submit">Comenzar mi test <Icon name="arrow"/></button>
    </form>
  </div></>;
}
