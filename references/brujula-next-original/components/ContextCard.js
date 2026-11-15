// Tarjeta de una pregunta de opción única (módulo 3)
export default function ContextCard({ questions, context, done, i, header, onAnswer, onPrev, onNext }) {
  const cq = questions[i];
  const last = i === questions.length - 1;
  return (
    <div className="wizard">
      {header}
      <div className="module-head">
        <div className="eyebrow">Módulo 3</div>
        <h2>Contexto y preferencias de mercado laboral</h2>
        <p style={{ color: "var(--ink-600)", fontSize: ".92rem" }}>Esta información ayuda a ajustar las recomendaciones a tu realidad, no a limitar tus opciones.</p>
      </div>
      <div className="q-count">Pregunta {i + 1} de {questions.length}</div>
      <div className="item q-card" key={i}>
        <p className="prompt">{cq.q}</p>
        <div className="choice-opts">
          {cq.opts.map(opt => (
            <div key={opt} className={`choice-opt ${context[cq.key] === opt ? "sel" : ""}`} onClick={() => onAnswer(cq.key, opt)}>{opt}</div>
          ))}
        </div>
      </div>
      <div className="nav-row">
        <button className="btn ghost" onClick={onPrev}>Atrás</button>
        <button className="btn" disabled={!done[i]} onClick={onNext}>{last ? "Ver mis resultados" : "Siguiente"}</button>
      </div>
    </div>
  );
}
