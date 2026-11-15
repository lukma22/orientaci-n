/** PDF vectorial: siempre 4 páginas A4, sin capturas ni servicio externo. */
import {PDFDocument,rgb,type PDFFont,type PDFPage} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {RIASEC_LABELS,type RiasecDimension} from '@brujula/core';
import type {Assessment} from './assessment';
import {money,type Career} from './career-service';
import {confidenceInterval,employmentForCareer,ENEMDU_PERIOD,TITLE_ESTIMATE_UNAVAILABLE,unemploymentRate} from './employment';

const W=595.28,H=841.89;
const C={bg:rgb(10/255,12/255,14/255),panel:rgb(18/255,22/255,26/255),fg:rgb(232/255,237/255,242/255),muted:rgb(167/255,178/255,186/255),line:rgb(41/255,49/255,57/255),lime:rgb(211/255,231/255,80/255)};
const ORDER:RiasecDimension[]=['R','I','A','S','E','C'];

export async function createProfilePdf(assessment:Assessment,careers:Career[],fontBytes?:Uint8Array):Promise<Uint8Array> {
  if(careers.length!==3)throw new Error('El informe requiere exactamente tres carreras.');
  const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
  const bytes=fontBytes ?? new Uint8Array(await (await fetch('/fonts/figtree.ttf')).arrayBuffer());
  const font=await pdf.embedFont(bytes,{subset:true});
  pdf.setTitle(`Brújula - Perfil de ${assessment.participant.name}`);
  pdf.setAuthor('Brújula');pdf.setSubject('Perfil RIASEC-36 y tres carreras para explorar');
  const rectangle=(page:PDFPage,x:number,top:number,w:number,h:number,fill=C.panel)=>page.drawRectangle({x,y:H-top-h,width:w,height:h,color:fill});
  const line=(page:PDFPage,x1:number,t1:number,x2:number,t2:number,color=C.line,width=1)=>page.drawLine({start:{x:x1,y:H-t1},end:{x:x2,y:H-t2},color,thickness:width});
  const text=(page:PDFPage,s:string,x:number,top:number,size=11,color=C.fg)=>page.drawText(s,{x,y:H-top-size,size,font,color});
  function paragraph(page:PDFPage,s:string,x:number,top:number,width:number,size=11,color=C.muted,lineHeight=size*1.5,maxLines=20) {
    const rows:string[]=[];let row='';
    for(const word of s.replace(/\s+/g,' ').trim().split(' ')) {
      if(font.widthOfTextAtSize((row?row+' ':'')+word,size)>width&&row){rows.push(row);row='';}
      if(font.widthOfTextAtSize(word,size)>width){
        for(const ch of word){if(font.widthOfTextAtSize(row+ch,size)>width){rows.push(row);row='';}row+=ch;}
      }else row+=(row?' ':'')+word;
    }
    if(row)rows.push(row);
    const limited=rows.slice(0,maxLines);
    if(rows.length>maxLines)limited[maxLines-1]=limited[maxLines-1].slice(0,-3)+'…';
    limited.forEach((r,i)=>text(page,r,x,top+i*lineHeight,size,color));
    return top+limited.length*lineHeight;
  }
  function page(number:number) {
    const p=pdf.addPage([W,H]);rectangle(p,0,0,W,H,C.bg);
    text(p,'brújula.',40,32,26);text(p,'TU FUTURO, TU CAMINO',390,45,9,C.muted);line(p,40,83,W-40,83);
    line(p,40,793,W-40,793);text(p,'BRÚJULA / RIASEC-36',40,808,8,C.muted);
    text(p,`${number.toString().padStart(2,'0')} / 04`,506,807,9,C.lime);
    return p;
  }
  const profile=assessment.profile;
  const p=page(1);
  text(p,'TU PUNTO DE PARTIDA',40,105,9,C.lime);
  paragraph(p,`${assessment.participant.name}, tu rumbo toma forma.`,40,128,515,25,C.fg,30,2);
  text(p,'Tus intereses abren caminos. Explora los que más llaman tu atención.',40,200,10,C.muted);
  const location=[assessment.participant.canton,assessment.participant.province].filter(Boolean).join(', ')||'Sin preferencia de ubicación';
  paragraph(p,`${assessment.participant.academicStage} · ${location}`,40,224,515,10,C.muted,14,2);
  rectangle(p,40,265,515,144);
  text(p,'Carreras para explorar',56,279,13);text(p,'Desempleo por título',298,282,9,C.muted);
  careers.forEach((career,i)=>{
    const {title}=employmentForCareer(career.slug);
    const top=311+i*30;text(p,`0${i+1}`,56,top,10,C.lime);text(p,career.name,88,top-1,13);
    text(p,title?unemploymentRate(title):TITLE_ESTIMATE_UNAVAILABLE,298,top,10,title?C.lime:C.muted);
    text(p,`Pág. ${i+2}`,501,top,9,C.muted);if(i<2)line(p,56,top+22,538,top+22);
  });
  text(p,`Ecuador · Estimaciones con ENEMDU (INEC) · ${ENEMDU_PERIOD}`,56,391,8,C.muted);
  text(p,'Tu perfil',40,433,16);text(p,`RIASEC · ${profile.code}`,455,438,10,C.lime);
  rectangle(p,40,466,249,236);rectangle(p,302,466,253,236);
  text(p,'Lo que te mueve',56,483,12);text(p,'Escala 0-100',56,506,9,C.muted);
  profile.ranked.forEach(([k,v],i)=>{
    const top=533+i*26;text(p,RIASEC_LABELS[k],56,top,10);text(p,String(v),251,top,10,C.muted);
    rectangle(p,56,top+17,216,3,C.line);if(v)rectangle(p,56,top+17,216*v/100,3,C.lime);
  });
  text(p,'Tu mapa de intereses',318,483,12);
  const cx=428,cy=594,r=69;
  const point=(i:number,s:number):[number,number]=>[cx+Math.cos(-Math.PI/2+i*Math.PI/3)*r*s,cy+Math.sin(-Math.PI/2+i*Math.PI/3)*r*s];
  [.25,.5,.75,1].forEach(s=>ORDER.forEach((_,i)=>{const a=point(i,s),b=point((i+1)%6,s);line(p,...a,...b);}));
  ORDER.forEach((k,i)=>{
    const a=point(i,1);line(p,cx,cy,...a);const label=point(i,1.23);text(p,k,label[0]-3,label[1]-5,10,C.muted);
    const v=point(i,profile.riasec[k]/100),n=point((i+1)%6,profile.riasec[ORDER[(i+1)%6]]/100);line(p,...v,...n,C.lime,1.8);
    p.drawCircle({x:v[0],y:H-v[1],size:2.5,color:C.lime});
  });
  text(p,profile.code.split('').join(' · '),404,680,11,C.lime);
  paragraph(p,'Las carreras son una muestra del catálogo. La selección personalizada según tus intereses estará disponible más adelante.',40,721,515,9,C.muted,13,2);
  if(profile.hasTopTie)paragraph(p,'Hay empates en tus intereses principales. Orden de desempate: R, I, A, S, E, C.',40,754,515,8,C.muted,11,2);
  careers.forEach((career,i)=>{
    const q=page(i+2),r=career.reference;
    const {title,occupation,occupationLabel}=employmentForCareer(career.slug);
    text(q,'EXPLORA TU SIGUIENTE PASO',40,105,9,C.lime);
    text(q,career.name,40,130,32);text(q,'Tercer nivel de grado',40,176,11,C.muted);
    text(q,'Descripción de la carrera',40,211,14);
    paragraph(q,career.description,40,239,515,11,C.muted,17,4);
    rectangle(q,40,325,249,203);rectangle(q,302,325,253,203);
    text(q,'INGRESO DE REFERENCIA',56,344,9,C.lime);text(q,money(r.P50),56,370,29);
    text(q,'USD / mes · mediana',56,412,10,C.muted);
    paragraph(q,`P25-P75: ${money(r.P25)} - ${money(r.P75)}`,56,436,216,10,C.fg,15,2);
    paragraph(q,`Profesión: ${r['Profesión (provisional)']}. CIUO ${r.CIUO}.`,56,474,216,9,C.muted,13,3);
    text(q,'DESEMPLEO POR TÍTULO',318,344,9,C.lime);
    if(title){
      text(q,unemploymentRate(title),318,366,27,C.lime);
      paragraph(q,`${title.nombre} · CNTP ${title.codigo}`,318,402,219,9,C.fg,11,2);
      text(q,`IC del 95 % ${confidenceInterval(title)}`,318,430,9,C.muted);
    }else{
      paragraph(q,TITLE_ESTIMATE_UNAVAILABLE,318,373,219,14,C.fg,18,2);
    }
    if(occupation){
      line(q,318,451,539,451);
      text(q,`${occupationLabel} · ${unemploymentRate(occupation)}`,318,459,9,C.fg);
      paragraph(q,`${occupation.nombre} · CIUO ${occupation.codigo}`,318,474,219,8.5,C.muted,10,3);
    }
    text(q,`Ecuador · ENEMDU (INEC) · ${ENEMDU_PERIOD}`,318,511,8,C.muted);
    paragraph(q,`Referencia: ${r['Cantón']}, ${r.Provincia}. Alcance: ${r.Zona}. Fuente: ${career.sourceLabel}. ${r.Registros} registros.`,40,545,515,9,C.muted,13,3);
    text(q,'Universidades',40,604,14);
    const institutions=[...new Set(career.offers.map(o=>o.Universidad))];
    institutions.slice(0,10).forEach((name,j)=>paragraph(q,name,40+(j%2)*266,635+Math.floor(j/2)*25,249,8.5,C.muted,11,2));
    text(q,'Los ingresos son orientativos. No garantizan un salario ni un puesto de trabajo.',40,766,8,C.muted);
  });
  if(pdf.getPageCount()!==4)throw new Error('El PDF debe tener cuatro páginas.');
  return pdf.save();
}
export async function downloadProfilePdf(assessment:Assessment,careers:Career[]) {
  const bytes=await createProfilePdf(assessment,careers);
  const blob=new Blob([new Uint8Array(bytes)],{type:'application/pdf'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='brujula-mi-perfil-y-carreras.pdf';document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
