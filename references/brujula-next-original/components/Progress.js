// Pasos + barra de progreso (se llena al 100% en resultados)
export default function Progress({ active, pct }) {
  const labels = ["Intereses", "Empleabilidad", "Contexto laboral", "Resultados"];
  return (
    <>
      <div className="steps">
        {labels.map((l, i) => {
          const n = i + 1;
          const cls = n === active ? "active" : n < active ? "done" : "";
          return (
            <div key={l} className={`step ${cls}`}>
              <span className="num">{n}</span>{l}
            </div>
          );
        })}
      </div>
      <div className="progress">
        <div className="progress-meta">
          <span>{active === 4 ? "¡Test completado!" : "Tu progreso"}</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${pct === 100 ? "full" : ""}`} style={{ width: pct + "%" }} />
        </div>
      </div>
    </>
  );
}
