import { RIASEC_ITEMS, EMP_ITEMS } from "../data/items";

// Misma lógica del HTML original, sin cambios.
export function computeRiasec(riasec){
  const sums = {R:0,I:0,A:0,S:0,E:0,C:0};
  RIASEC_ITEMS.forEach((item,i)=>{ sums[item[0]] += riasec[i]; });
  const scores = {};
  Object.keys(sums).forEach(k=>{ scores[k] = Math.round(((sums[k]-5)/(25-5))*100); });
  return scores;
}
export function computeEmp(emp){
  const groups = {};
  EMP_ITEMS.forEach((item,i)=>{
    if(!groups[item[0]]) groups[item[0]] = [];
    groups[item[0]].push(emp[i]);
  });
  const scores = {};
  Object.keys(groups).forEach(k=>{
    const vals = groups[k];
    const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
    scores[k] = Math.round(((avg-1)/4)*100);
  });
  return scores;
}
export function topPair(riasecScores){
  const sorted = Object.entries(riasecScores).sort((a,b)=>b[1]-a[1]);
  const letters = [sorted[0][0], sorted[1][0]].sort();
  return {key:letters.join(""), top:sorted};
}
