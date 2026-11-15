"use client";
import { useState } from "react";
import { RIASEC_ITEMS, EMP_ITEMS, CONTEXT_QUESTIONS } from "../data/items";
import Intro from "../components/Intro";
import Progress from "../components/Progress";
import QuestionCard from "../components/QuestionCard";
import ContextCard from "../components/ContextCard";
import Results from "../components/Results";

const initial = () => ({
  screen: "intro", // intro | m1 | m2 | m3 | results
  riasec: Array(RIASEC_ITEMS.length).fill(3),
  emp: Array(EMP_ITEMS.length).fill(3),
  context: {},
  done: {
    m1: Array(RIASEC_ITEMS.length).fill(false),
    m2: Array(EMP_ITEMS.length).fill(false),
    m3: Array(CONTEXT_QUESTIONS.length).fill(false),
  },
  qi: { m1: 0, m2: 0, m3: 0 },
});

const setAt = (arr, i, v) => arr.map((x, j) => (j === i ? v : x));
const LAST = { m1: RIASEC_ITEMS.length - 1, m2: EMP_ITEMS.length - 1 };

export default function Page() {
  const [s, setS] = useState(initial);
  const up = (patch) => setS((p) => ({ ...p, ...patch }));
  const go = (screen) => { up({ screen }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const all = [...s.done.m1, ...s.done.m2, ...s.done.m3];
  const pct = Math.round((all.filter(Boolean).length / all.length) * 100);
  const bar = (active) => <Progress active={active} pct={active === 4 ? 100 : pct} />;

  const answerLikert = (m, field, v) => {
    const i = s.qi[m];
    setS((p) => ({ ...p, [field]: setAt(p[field], i, v), done: { ...p.done, [m]: setAt(p.done[m], i, true) } }));
  };
  const moveQ = (m, d) => setS((p) => ({ ...p, qi: { ...p.qi, [m]: p.qi[m] + d } }));

  if (s.screen === "intro") return <div id="app"><Intro onStart={() => go("m1")} /></div>;

  if (s.screen === "m1" || s.screen === "m2") {
    const m = s.screen, n = m === "m1" ? 1 : 2, i = s.qi[m];
    const cfg = m === "m1"
      ? { title: "Intereses vocacionales", subtitle: "Basado en la teoría RIASEC de Holland: no hay respuestas correctas, responde según lo que realmente disfrutas.", items: RIASEC_ITEMS, answers: s.riasec, field: "riasec", next: "m2", prev: "intro" }
      : { title: "Autoevaluación de empleabilidad", subtitle: "Sobre competencias que el mercado laboral valora, más allá del título académico.", items: EMP_ITEMS, answers: s.emp, field: "emp", next: "m3", prev: "m1" };
    return (
      <div id="app">
        <QuestionCard
          n={n} title={cfg.title} subtitle={cfg.subtitle} items={cfg.items}
          answers={cfg.answers} done={s.done[m]} i={i} header={bar(n)}
          onAnswer={(v) => answerLikert(m, cfg.field, v)}
          onPrev={() => {
            if (i > 0) moveQ(m, -1);
            else {
              if (cfg.prev !== "intro") setS((p) => ({ ...p, qi: { ...p.qi, [cfg.prev]: LAST[cfg.prev] } }));
              go(cfg.prev);
            }
          }}
          onNext={() => (i < cfg.items.length - 1 ? moveQ(m, 1) : go(cfg.next))}
        />
      </div>
    );
  }

  if (s.screen === "m3") {
    const i = s.qi.m3;
    return (
      <div id="app">
        <ContextCard
          questions={CONTEXT_QUESTIONS} context={s.context} done={s.done.m3} i={i} header={bar(3)}
          onAnswer={(key, opt) => setS((p) => ({ ...p, context: { ...p.context, [key]: opt }, done: { ...p.done, m3: setAt(p.done.m3, i, true) } }))}
          onPrev={() => {
            if (i > 0) moveQ("m3", -1);
            else { setS((p) => ({ ...p, qi: { ...p.qi, m2: LAST.m2 } })); go("m2"); }
          }}
          onNext={() => (i < CONTEXT_QUESTIONS.length - 1 ? moveQ("m3", 1) : go("results"))}
        />
      </div>
    );
  }

  return (
    <div id="app">
      <Results riasec={s.riasec} emp={s.emp} context={s.context} header={bar(4)}
        onRestart={() => { setS(initial()); window.scrollTo({ top: 0 }); }} />
    </div>
  );
}
