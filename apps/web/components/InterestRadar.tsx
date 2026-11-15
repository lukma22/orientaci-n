import { RIASEC_LABELS, type RiasecScores, type RiasecDimension } from '@brujula/core';
const ORDER: RiasecDimension[]=['R','I','A','S','E','C'];
export default function InterestRadar({scores}: {scores:RiasecScores}) {
  const point=(i:number,scale:number)=>[200+Math.cos(-Math.PI/2+i*Math.PI/3)*82*scale,121+Math.sin(-Math.PI/2+i*Math.PI/3)*82*scale];
  const points=(scale:number)=>ORDER.map((_,i)=>point(i,scale).join(',')).join(' ');
  return <svg viewBox="0 0 400 245" role="img" aria-label={`Gráfico de tus seis intereses: ${ORDER.map(k=>`${RIASEC_LABELS[k]} ${scores[k]}`).join(', ')}`}>
    {[.25,.5,.75,1].map(s=><polygon key={s} points={points(s)} fill="none" stroke="#303940" strokeWidth="1"/>)}
    {ORDER.map((k,i)=>{const [x,y]=point(i,1);const [tx,ty]=point(i,1.25);return <g key={k}>
      <line x1="200" y1="121" x2={x} y2={y} stroke="#303940"/>
      <text x={tx} y={ty} fill="#a7b2ba" fontSize="10" textAnchor={i===0||i===3?'middle':i<3?'start':'end'} dominantBaseline="middle">{RIASEC_LABELS[k]}</text>
    </g>;})}
    <polygon points={ORDER.map((k,i)=>point(i,scores[k]/100).join(',')).join(' ')} fill="#d3e75024" stroke="#d3e750" strokeWidth="2"/>
    {ORDER.map((k,i)=>{const [cx,cy]=point(i,scores[k]/100);return <circle key={k} cx={cx} cy={cy} r="3" fill="#d3e750"/>;})}
  </svg>;
}
