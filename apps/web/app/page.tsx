'use client';
import {useCallback,useEffect,useState} from 'react';
import type {Answers} from '@quill/engine/browser';
import {FormRenderer} from '../dapta/form-renderer';
import {Welcome,Registration} from '../components/StartFlow';
import Dashboard from '../components/Dashboard';
import {buildNativeConfig} from '../lib/brujula-config';
import {assessmentStore,localAssessmentGateway,type Assessment,type Participant} from '../lib/assessment';

const config=buildNativeConfig();
export default function Page() {
  const [view,setView]=useState<'welcome'|'registration'|'test'|'results'>('welcome');
  const [participant,setParticipant]=useState<Participant|null>(null);
  const [assessment,setAssessment]=useState<Assessment|null>(null);
  const [ready,setReady]=useState(false);
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{const saved=assessmentStore.load();if(saved){setAssessment(saved);setView('results');}setReady(true);},[]);
  const complete=useCallback(async(value:Answers)=>{
    if(!participant)return;
    const answers=Object.fromEntries(Object.entries(value).filter((p):p is [string,string]=>typeof p[1]==='string'));
    const result=await localAssessmentGateway.complete(participant,answers);
    setAssessment(result);setView('results');window.scrollTo(0,0);
  },[participant]);
  function restart(){assessmentStore.clear();setAssessment(null);setParticipant(null);setAttempt(n=>n+1);setView('welcome');window.scrollTo(0,0);}
  return <main className="brujula-product">
    {!ready?<div className="app-loading" role="status">Preparando tu Brújula…</div>:
      view==='results'&&assessment?<Dashboard assessment={assessment} onRestart={restart}/>:
      view==='test'?<FormRenderer key={attempt} accountCode="brujula-local" slug="riasec36" name="Brújula" config={config} locale="es" onComplete={complete} manualAdvance={false} brujulaStages/>:
      view==='registration'?<Registration onBack={()=>setView('welcome')} onComplete={p=>{setParticipant(p);setView('test');window.scrollTo(0,0);}}/>:
      <Welcome onStart={()=>{setView('registration');window.scrollTo(0,0);}}/>
    }
  </main>;
}
