import {describe,it,expect} from 'vitest';
import {QUESTIONS,demoAnswers,isAnswered,unansweredQuestions,progressPercent} from './form-config';
import {computeResults} from './scoring';
import {initialSession,sessionReducer,questionsIn} from './session';
import type {ModuleId} from './types';
describe('Cuadernillo RIASEC-36',()=>{
  it('conserva 36 preguntas intercaladas y 3 etapas de 12',()=>{
    expect(QUESTIONS).toHaveLength(36);
    expect(QUESTIONS.map(q=>q.group).join('')).toBe('RIASEC'.repeat(6));
    for(const module of ['m1','m2','m3'] as ModuleId[])expect(questionsIn(module)).toHaveLength(12);
    for(const code of 'RIASEC')expect(QUESTIONS.filter(q=>q.group===code)).toHaveLength(6);
  });
  it.each([[1,0],[3,50],[5,100]] as const)('normaliza una respuesta uniforme %i a %i', (value,score)=>{
    const profile=computeResults(demoAnswers(value));
    expect(Object.values(profile.riasec)).toEqual(Array(6).fill(score));
    expect(profile.code).toBe('RIA');expect(profile.hasTopTie).toBe(true);
    expect(profile.employability).toEqual({});
  });
  it('suma las seis preguntas de cada dimensión a través de las tres etapas',()=>{
    const answers=demoAnswers(1),value:Record<string,string>={R:'5',I:'4',A:'1',S:'2',E:'3',C:'1'};
    for(const q of QUESTIONS)answers[q.step.key]=value[q.group];
    const result=computeResults(answers);
    expect(result.riasec).toEqual({R:100,I:75,A:0,S:25,E:50,C:0});
    expect(result.code).toBe('RIE');expect(result.hasTopTie).toBe(false);
  });
  it('rechaza preguntas omitidas y valores fuera de escala',()=>{
    const a=demoAnswers();delete a.riasec_12;
    expect(()=>computeResults(a)).toThrow(/Completa/);
    expect(()=>computeResults({...demoAnswers(),riasec_36:'6'})).toThrow(/Completa/);
    expect(unansweredQuestions({})).toHaveLength(36);
    for(const value of ['0','6','texto',''])expect(isAnswered(QUESTIONS[0],{riasec_01:value})).toBe(false);
    expect(progressPercent({})).toBe(0);expect(progressPercent(demoAnswers())).toBe(100);
  });
  it('señala el empate de la tercera dimensión con la cuarta',()=>{
    const a=demoAnswers(1);
    for(const q of QUESTIONS)a[q.step.key]=q.group==='R'?'5':q.group==='I'?'4':['A','S'].includes(q.group)?'3':'1';
    expect(computeResults(a).hasTopTie).toBe(true);
  });
  it('navega por las tres etapas sin saltar respuestas y reinicia',()=>{
    let s=sessionReducer(initialSession(),{type:'start'});
    expect(sessionReducer(s,{type:'next'})).toEqual(s);
    for(const q of QUESTIONS){s=sessionReducer(s,{type:'answer',key:q.step.key,value:'4'});s=sessionReducer(s,{type:'next'});}
    expect(s.screen).toBe('results');expect(Object.keys(s.answers)).toHaveLength(36);
    expect(sessionReducer(s,{type:'restart'})).toEqual(initialSession());
  });
});
