import {describe,it,expect} from 'vitest';
import {readFile} from 'node:fs/promises';
import places from '../../../apps/web/data/ecuador.json';
import {createProfilePdf} from '../../../apps/web/lib/export-pdf';
import {localCareerGateway} from '../../../apps/web/lib/career-service';
import {demoAnswers} from './form-config';
import {computeResults} from './scoring';
import {PDFDocument} from 'pdf-lib';
import type {Assessment} from '../../../apps/web/lib/assessment';

describe('Datos y PDF del perfil',()=>{
  it('tiene las 24 provincias y 222 cantones sin duplicados',()=>{
    expect(places.provinces).toHaveLength(24);
    expect(places.provinces.flatMap(p=>p.cantons)).toHaveLength(222);
    for(const p of places.provinces)expect(new Set(p.cantons).size).toBe(p.cantons.length);
    expect(places.provinces.find(p=>p.name==='MORONA SANTIAGO')?.cantons).toContain('SEVILLA DON BOSCO');
  });
  it('produce exactamente cuatro páginas y conserva los percentiles de una fila',async()=>{
    const a:Assessment={version:'riasec36-v1',participant:{name:'María José',academicStage:'Bachillerato',province:'PICHINCHA',canton:'DISTRITO METROPOLITANO DE QUITO'},answers:demoAnswers(),profile:computeResults(demoAnswers()),completedAt:new Date().toISOString()};
    const careers=localCareerGateway.list(a.participant);
    expect(careers).toHaveLength(3);
    expect(careers.map(c=>c.name)).toEqual(['Derecho','Ciencia de Datos','Comunicación']);
    for(const c of careers){expect(c.reference.P25).toBeLessThanOrEqual(c.reference.P50!);expect(c.reference.P50).toBeLessThanOrEqual(c.reference.P75!);}
    const font=await readFile(new URL('../../../apps/web/public/fonts/figtree.ttf',import.meta.url));
    const bytes=await createProfilePdf(a,careers,font);
    const pdf=await PDFDocument.load(bytes);expect(pdf.getPageCount()).toBe(4);
    expect(pdf.getTitle()).toContain('María José');
  });
});
