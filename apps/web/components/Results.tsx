"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  computeResults,
  CONTEXT_QUESTIONS,
  demoCareerRepository,
  RIASEC_LABELS,
} from "@brujula/core";
import type { CareerRecommendation, TestAnswers } from "@brujula/core";
import type { FormBranding } from "@quill/engine/browser";
import { formDesignProps } from "../lib/form-design";
import { FormLogo } from "./public/form-logo";
type Tab = "intereses" | "competencias" | "opciones";
export default function Results({
  answers,
  branding,
  onRestart,
}: {
  answers: TestAnswers;
  branding?: FormBranding | null;
  onRestart: () => void;
}) {
  const profile = useMemo(() => computeResults(answers), [answers]);
  const design = useMemo(() => formDesignProps(branding), [branding]);
  const [tab, setTab] = useState<Tab>("intereses");
  const [career, setCareer] = useState<
    CareerRecommendation | null | undefined
  >();
  const canvas = useRef<HTMLCanvasElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const skills = Object.entries(profile.employability).sort(
    (a, b) => b[1] - a[1],
  );
  const flat = new Set(skills.map(([, v]) => v)).size === 1;
  const top = profile.ranked.slice(0, 2);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    let active = true;
    demoCareerRepository
      .findByProfile(profile)
      .then((v) => {
        if (active) setCareer(v);
      })
      .catch(() => {
        if (active) setCareer(null);
      });
    return () => {
      active = false;
    };
  }, [profile]);
  useEffect(() => {
    if (!canvas.current) return;
    const primary = branding?.primaryColor ?? "#3ddc84",
      foreground = branding?.foreground ?? "#1a1a1c";
    const chart = new Chart(canvas.current, {
      type: "radar",
      data: {
        labels: Object.values(RIASEC_LABELS),
        datasets: [
          {
            label: "Puntaje",
            data: Object.values(profile.riasec),
            borderColor: primary,
            backgroundColor: primary + "26",
            pointBackgroundColor: primary,
            pointRadius: 4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: foreground + "20" },
            angleLines: { color: foreground + "20" },
            pointLabels: {
              font: { family: "Figtree", size: 12 },
              color: foreground,
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [profile, branding?.primaryColor, branding?.foreground]);
  function download() {
    const payload = {
      version: 1,
      source: "brujula-dapta-visual",
      createdAt: new Date().toISOString(),
      answers,
      profile,
      recommendationSource: "local-demo",
      recommendation: career ?? null,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "brujula-resultados-prueba.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="pf results-surface" {...design.attrs} style={design.style}>
      <div className="results-page">
        <header className="results-brand">
          <FormLogo src={branding?.logo} name="Brújula" />
          <span className="complete-chip">
            <span>✓</span> Test completado
          </span>
        </header>
        <div className="results-heading pf-animate">
          <div className="result-eyebrow">UNA MIRADA A LO QUE TE MUEVE</div>
          <h1 ref={heading} tabIndex={-1}>
            Tu punto de partida.
          </h1>
          <p>
            Tus intereses, tus habilidades y algunas rutas que puedes explorar.
          </p>
        </div>
        <section className="profile-summary" aria-label="Resumen de tu perfil">
          <article className="profile-code">
            <div className="result-eyebrow">TU CÓDIGO HOLLAND</div>
            <strong>{profile.code}</strong>
            <span>{top.map(([k]) => RIASEC_LABELS[k]).join(" + ")}</span>
          </article>
          <article className="profile-metric">
            <span className="metric-icon" aria-hidden="true">
              ↗
            </span>
            <div className="result-eyebrow">INTERÉS PRINCIPAL</div>
            <strong>{RIASEC_LABELS[top[0][0]]}</strong>
            <span>{top[0][1]} de 100 puntos</span>
          </article>
          <article className="profile-metric">
            <span className="metric-icon" aria-hidden="true">
              ✳
            </span>
            <div className="result-eyebrow">EMPLEABILIDAD</div>
            <strong>
              {profile.employabilityAverage}
              <small>/100</small>
            </strong>
            <span>Promedio de tus 8 competencias</span>
          </article>
        </section>
        {profile.hasTopTie && (
          <div className="tie-note">
            Hay intereses con el mismo puntaje. Explora también las dimensiones
            empatadas; el orden del código es orientativo.
          </div>
        )}
        <div
          className="result-tabs"
          role="tablist"
          aria-label="Explorar tu perfil"
        >
          {(
            [
              { id: "intereses", label: "Tus intereses", n: "01" },
              { id: "competencias", label: "Tus competencias", n: "02" },
              { id: "opciones", label: "Explora tus opciones", n: "03" },
            ] as const
          ).map((item) => (
            <button
              type="button"
              role="tab"
              key={item.id}
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`panel-${item.id}`}
              onClick={() => setTab(item.id)}
            >
              <span>{item.n}</span>
              {item.label}
            </button>
          ))}
        </div>
        <section
          id="panel-intereses"
          role="tabpanel"
          aria-labelledby="tab-intereses"
          hidden={tab !== "intereses"}
          className="result-panel"
        >
          <div className="result-grid">
            <article className="result-card">
              <div className="result-card-heading">
                <h2>Tu mapa de intereses</h2>
                <span>RIASEC</span>
              </div>
              <p className="card-caption">
                Seis maneras de conectar con lo que disfrutas.
              </p>
              <div className="result-chart">
                <canvas
                  ref={canvas}
                  role="img"
                  aria-label="Gráfico de tus seis intereses RIASEC. Los puntajes se muestran a continuación."
                />
              </div>
            </article>
            <article className="result-card">
              <h2>Así se distribuyen</h2>
              <p className="card-caption">
                Puntajes de 0 a 100 según tus respuestas.
              </p>
              <ol className="dimension-list">
                {profile.ranked.map(([key, value], i) => (
                  <li key={key}>
                    <div className="dimension-label">
                      <span
                        className={`dimension-letter ${i < 2 ? "leading" : ""}`}
                      >
                        {key}
                      </span>
                      <div>
                        <strong>{RIASEC_LABELS[key]}</strong>
                        <div className="mini-track">
                          <i style={{ width: `${value}%` }} />
                        </div>
                      </div>
                      <b>{value}</b>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </div>
          <div className="insight-note">
            <span aria-hidden="true">↗</span>
            <p>
              <strong>El comienzo de una conversación.</strong> Estos resultados
              te ayudan a reconocer tus intereses. Puedes explorarlos con un
              orientador y contrastarlos con las actividades que disfrutas.
            </p>
          </div>
        </section>
        <section
          id="panel-competencias"
          role="tabpanel"
          aria-labelledby="tab-competencias"
          hidden={tab !== "competencias"}
          className="result-panel"
        >
          <div className="result-grid">
            <article className="result-card">
              <h2>Lo que llevas contigo</h2>
              <p className="card-caption">
                Tu autoevaluación de competencias de empleabilidad.
              </p>
              <div className="skills-list">
                {skills.map(([label, value]) => (
                  <div key={label}>
                    <div className="skill-label">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                    <div className="skill-track">
                      <i style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
            <article className="result-card">
              <h2>Tu siguiente paso</h2>
              {flat ? (
                <p className="card-caption">
                  Todas tus competencias tienen el mismo puntaje. Esta
                  autoevaluación no muestra diferencias relativas entre ellas.
                </p>
              ) : (
                <>
                  <div className="skill-group">
                    <span className="small-eyebrow">
                      TUS PUNTAJES MÁS ALTOS
                    </span>
                    {skills
                      .filter(([, v]) => v === skills[0][1])
                      .map(([label, v]) => (
                        <p key={label}>
                          <span>↗ {label}</span>
                          <strong>{v}</strong>
                        </p>
                      ))}
                  </div>
                  <div className="skill-group">
                    <span className="small-eyebrow">
                      DONDE PUEDES SEGUIR CRECIENDO
                    </span>
                    {skills
                      .filter(([, v]) => v === skills.at(-1)![1])
                      .map(([label, v]) => (
                        <p key={label}>
                          <span>{label}</span>
                          <strong>{v}</strong>
                        </p>
                      ))}
                  </div>
                  <p className="card-caption">
                    Son diferencias relativas dentro de tus respuestas, no una
                    evaluación externa de tus capacidades.
                  </p>
                </>
              )}
            </article>
          </div>
        </section>
        <section
          id="panel-opciones"
          role="tabpanel"
          aria-labelledby="tab-opciones"
          hidden={tab !== "opciones"}
          className="result-panel"
        >
          <div className="result-grid">
            <article className="result-card career-result">
              <div className="result-eyebrow">UNA RUTA PARA EXPLORAR</div>
              <h2>
                {career?.area ??
                  (career === undefined
                    ? "Preparando tu sugerencia…"
                    : "Sugerencia pendiente")}
              </h2>
              {career ? (
                <>
                  <div className="career-field">
                    <span>Carreras afines</span>
                    <p>{career.carreras}</p>
                  </div>
                  <div className="career-field">
                    <span>Instituciones de ejemplo</span>
                    <p>{career.instituciones}</p>
                  </div>
                  <div className="career-field">
                    <span>Nota de mercado del prototipo</span>
                    <p>{career.mercado}</p>
                  </div>
                </>
              ) : career === null ? (
                <p className="card-caption">
                  Tu perfil está completo. No hay una sugerencia disponible para
                  este código en el catálogo local.
                </p>
              ) : null}
              <span className="example-label">
                Catálogo de ejemplo · Pendiente de validación
              </span>
            </article>
            <article className="result-card">
              <h2>Lo que nos contaste</h2>
              <dl className="context-details">
                {CONTEXT_QUESTIONS.map((q) => (
                  <div key={q.key}>
                    <dt>{q.q}</dt>
                    <dd>{profile.context[q.key]}</dd>
                  </div>
                ))}
              </dl>
              <p className="card-caption">
                Por ahora, el contexto se muestra junto a tu perfil y todavía no
                modifica la sugerencia.
              </p>
            </article>
          </div>
        </section>
        <footer className="results-footer">
          <div>
            <strong>Tu rumbo sigue abierto.</strong>
            <p>Guarda tu perfil y vuelve a explorarlo cuando quieras.</p>
          </div>
          <div className="result-actions">
            <button
              type="button"
              className="result-button secondary"
              onClick={onRestart}
            >
              Repetir test
            </button>
            <button
              type="button"
              className="result-button secondary"
              disabled={career === undefined}
              onClick={download}
            >
              Descargar JSON
            </button>
            <button
              type="button"
              className="result-button primary"
              onClick={() => window.print()}
            >
              Guardar mi perfil <span aria-hidden="true">↗</span>
            </button>
          </div>
        </footer>
        <p className="result-footnote">
          Prueba orientativa con recomendaciones de ejemplo. Las respuestas se
          borran al recargar. Las carreras e instituciones aún requieren
          validación.
        </p>
      </div>
    </div>
  );
}
