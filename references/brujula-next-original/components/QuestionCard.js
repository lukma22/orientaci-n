// Tarjeta de una pregunta de escala 1-5 (módulos 1 y 2)
export default function QuestionCard({ n, title, subtitle, items, answers, done, i, header, onAnswer, onPrev, onNext }) {
  const last = i === items.length - 1;
  return (
    <div className="wizard">
      {header}
      <div className="module-head">
        <div className="eyebrow">Módulo {n}</div>
        <h2>{title}</h2>
        <p style={{ color: "var(--ink-600)", fontSize: ".92rem" }}>{subtitle}</p>
      </div>
      <div className="q-count">Pregunta {i + 1} de {items.length}</div>
      <div className="item q-card" key={i}>
        <p className="prompt">{items[i][1]}</p>
        <div className="scale">
          <span className="scale-label">Muy en desacuerdo</span>
          <div className="dots">
            {[1, 2, 3, 4, 5].map(v => (
              <div key={v} className={`dot ${done[i] && answers[i] === v ? "sel" : ""}`} onClick={() => onAnswer(v)}>{v}</div>
            ))}
          </div>
          <span className="scale-label right">Muy de acuerdo</span>
        </div>
      </div>
      <div className="nav-row">
        <button className="btn ghost" onClick={onPrev}>{n === 1 && i === 0 ? "Volver al inicio" : "Atrás"}</button>
        <button className="btn" disabled={!done[i]} onClick={onNext}>{last ? "Continuar al siguiente módulo" : "Siguiente"}</button>
      </div>
    </div>
  );
}
