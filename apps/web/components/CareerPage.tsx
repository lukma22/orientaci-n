'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {assessmentStore,type Assessment} from '../lib/assessment';
import Dashboard from './Dashboard';
import {BrandHeader} from './StartFlow';
export default function CareerPage({slug}:{slug:string}) {
  const [assessment,setAssessment]=useState<Assessment|null>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{setAssessment(assessmentStore.load());setReady(true);},[]);
  if(!ready)return <div className="app-loading" role="status">Abriendo tu camino…</div>;
  return <main className="brujula-product">{assessment?<Dashboard assessment={assessment} selectedCareer={slug}/>:<><BrandHeader/><div className="registration"><h1>Primero, descubre tu perfil.</h1><p>Completa el test para explorar las carreras y volver a tu dashboard.</p><Link className="primary-button" href="/">Ir a Brújula</Link></div></>}</main>;
}
