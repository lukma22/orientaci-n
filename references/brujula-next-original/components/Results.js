import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { RIASEC_LABELS } from "../data/items";
import { MATCH_DB } from "../data/matchDb";
import { computeRiasec, computeEmp, topPair } from "../lib/scoring";

export default function Results({ riasec, emp, context, header, onRestart }) {
  const riasecScores = computeRiasec(riasec);
  const empScores = computeEmp(emp);
  const { key, top } = topPair(riasecScores);
  const match = MATCH_DB[key] || MATCH_DB["IC"];
  const topCodeLabel = top.slice(0, 3).map(t => RIASEC_LABELS[t[0]]).join(" · ");
  const empSorted = Object.entries(empScores).sort((a, b) => b[1] - a[1]);
  const strengths = empSorted.slice(0, 2);
  const growth = empSorted.slice(-2);
  const empAvg = Math.round(Object.values(empScores).reduce((a, b) => a + b, 0) / Object.values(empScores).length);

  const canvasRef = useRef(null);
  useEffect(() => {
    const chart = new Chart(canvasRef.current.getContext("2d"), {
      type: "radar",
      data: {
        labels: Object.keys(riasecScores).map(k => RIASEC_LABELS[k]),
        datasets: [{
          label: "Puntaje",
          data: Object.keys(riasecScores).map(k => riasecScores[k]),
          backgroundColor: "rgba(30,74,65,0.18)", borderColor: "#1E4A41",
          pointBackgroundColor: "#B8863B", pointBorderColor: "#B8863B", borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: "#D2CBB8" }, angleLines: { color: "#D2CBB8" }, pointLabels: { font: { family: "IBM Plex Sans", size: 11 }, color: "#221F1C" } } }
      }
    });
    return () => chart.destroy();
  }, []);

  return (
    <>
      <div className="wizard" style={{ paddingBottom: 0 }}>{header}</div>
      <div className="results">
        <div style={{ color: "var(--gold-600)", fontFamily: "'Newsreader',serif", fontStyle: "italic" }}>Tu perfil</div>
        <h2 className="code">{key} — {match.area}</h2>
        <p className="subcode">Código Holland dominante: {top[0][0]}{top[1][0]} ({topCodeLabel})</p>

        <div className="grid2">
          <div className="panel">
            <h3>Perfil de intereses (RIASEC)</h3>
            <canvas ref={canvasRef} height="240" />
          </div>
          <div className="panel">
            <h3>Competencias de empleabilidad</h3>
            <p style={{ fontSize: ".85rem", color: "var(--ink-600)", marginBottom: 14 }}>Promedio general: <strong>{empAvg}/100</strong></p>
            {empSorted.map(([k, v]) => (
              <div className="bar-row" key={k}>
                <div className="lbl"><span>{k}</span><span>{v}</span></div>
                <div className="bar-track"><div className={`bar-fill ${v >= 70 ? "gold" : ""}`} style={{ width: v + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid2">
          <div className="panel">
            <h3>Fortalezas y áreas a desarrollar</h3>
            <ul className="strength-list">
              {strengths.map(([k, v]) => <li key={k}><span className="str">↑ {k}</span><span>{v}</span></li>)}
              {growth.map(([k, v]) => <li key={k}><span className="dev">↓ {k}</span><span>{v}</span></li>)}
            </ul>
          </div>
          <div className="panel">
            <h3>Tu contexto declarado</h3>
            {Object.values(context).map(v => <span className="tag" key={v}>{v}</span>)}
            <p style={{ marginTop: 12, fontSize: ".85rem", color: "var(--ink-600)" }}>Estas preferencias se contrastan con la nota de mercado de tu área recomendada.</p>
          </div>
        </div>

        <div className="career-card">
          <h3>Área de carrera recomendada: {match.area}</h3>
          <div className="field"><div className="k">Carreras afines</div><div className="v">{match.carreras}</div></div>
          <div className="field"><div className="k">Ejemplos de instituciones en Ecuador</div><div className="v">{match.instituciones}</div></div>
          <div className="field"><div className="k">Panorama de mercado laboral</div><div className="v">{match.mercado}</div></div>
        </div>

        <div className="notice">
          Las carreras, instituciones y notas de mercado son orientativas y con fines de entrenamiento del instrumento. Para una versión institucional, se recomienda validar y actualizar periódicamente esta base con datos de SENESCYT, INEC, Banco Central del Ecuador y el Ministerio del Trabajo, e idealmente vincularla con un módulo de seguimiento a graduados.
        </div>

        <div className="restart-row">
          <button className="btn ghost" onClick={onRestart}>Repetir el test</button>
          <button className="btn" onClick={() => window.print()}>Guardar / imprimir resultados</button>
        </div>
      </div>
    </>
  );
}
