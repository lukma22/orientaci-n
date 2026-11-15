import { useEffect, useRef, useState } from "react";
import type { Appearance } from "../lib/brujula-config";
import { DEFAULT_APPEARANCE, THEMES } from "../lib/brujula-config";
export function AppearancePanel({
  value,
  onChange,
}: {
  value: Appearance;
  onChange: (value: Appearance) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div className="appearance" ref={root}>
      <button
        type="button"
        className="studio-action"
        ref={trigger}
        aria-expanded={open}
        aria-controls="appearance-panel"
        onClick={() => setOpen(!open)}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 17h16" />
          <circle cx="9" cy="7" r="3" fill="var(--background)" />
          <circle cx="15" cy="17" r="3" fill="var(--background)" />
        </svg>
        Apariencia
      </button>
      {open && (
        <section
          id="appearance-panel"
          className="appearance-panel"
          aria-label="Personalizar apariencia"
        >
          <div className="appearance-title">
            <div>
              <span className="small-eyebrow">HAZLA TUYA</span>
              <h2>A tu manera.</h2>
            </div>
            <button
              type="button"
              className="close-panel"
              aria-label="Cerrar apariencia"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <fieldset>
            <legend>Tema</legend>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`theme-card ${value.theme === t.id ? "selected" : ""}`}
                  aria-pressed={value.theme === t.id}
                  onClick={() => onChange({ ...value, theme: t.id })}
                >
                  <span
                    className="theme-preview"
                    style={{ background: t.background }}
                  >
                    <i style={{ background: t.color }} />
                    <i style={{ background: t.color }} />
                    <i style={{ background: t.color }} />
                  </span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Transición entre preguntas</legend>
            <div className="segmented">
              {(
                [
                  { id: "slide", label: "Deslizar" },
                  { id: "fade", label: "Fundido" },
                  { id: "none", label: "Sin animación" },
                ] as const
              ).map((o) => (
                <button
                  type="button"
                  key={o.id}
                  aria-pressed={value.transition === o.id}
                  className={value.transition === o.id ? "selected" : ""}
                  onClick={() => onChange({ ...value, transition: o.id })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="auto-switch">
            <span>
              <strong>Avance automático</strong>
              <small>Pasar a la siguiente pregunta al elegir.</small>
            </span>
            <input
              type="checkbox"
              checked={value.autoAdvance}
              onChange={(e) =>
                onChange({ ...value, autoAdvance: e.target.checked })
              }
            />
          </label>
          <div className="appearance-foot">
            <span>Tu elección se guarda en este navegador.</span>
            <button
              type="button"
              onClick={() => onChange({ ...DEFAULT_APPEARANCE })}
            >
              Restablecer
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
