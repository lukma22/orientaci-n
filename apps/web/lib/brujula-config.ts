import { findThemePreset } from "@quill/engine/browser";
import { formConfigSchema } from "@quill/types";
import { FORM_CONFIG, QUESTIONS } from "@brujula/core";
export type ThemeId = "dforms" | "control-room" | "ocean";
export type TransitionId = "slide" | "fade" | "none";
export interface Appearance {
  theme: ThemeId;
  transition: TransitionId;
  autoAdvance: boolean;
}
export const DEFAULT_APPEARANCE: Appearance = {
  theme: "control-room",
  transition: "fade",
  autoAdvance: true,
};
export const THEMES = [
  { id: "dforms", label: "Claro", color: "#3ddc84", background: "#ffffff" },
  {
    id: "control-room",
    label: "Oscuro",
    color: "#d3e750",
    background: "#0a0c0e",
  },
  { id: "ocean", label: "Océano", color: "#1f6feb", background: "#f4f8fb" },
] as const;
export function readAppearance(raw: string | null): Appearance {
  try {
    const v = JSON.parse(raw ?? "{}") as Partial<Appearance>;
    return {
      theme: THEMES.some((t) => t.id === v.theme)
        ? v.theme!
        : DEFAULT_APPEARANCE.theme,
      transition: ["slide", "fade", "none"].includes(v.transition ?? "")
        ? v.transition!
        : DEFAULT_APPEARANCE.transition,
      autoAdvance: typeof v.autoAdvance === "boolean" ? v.autoAdvance : false,
    };
  } catch {
    return { ...DEFAULT_APPEARANCE };
  }
}
export function buildNativeConfig(appearance: Appearance = DEFAULT_APPEARANCE) {
  const preset = findThemePreset(appearance.theme)!;
  const counts = { m1: 0, m2: 0, m3: 0 };
  const names = {
    m1: "Etapa 1",
    m2: "Etapa 2",
    m3: "Etapa 3",
  };
  const totals = { m1: 12, m2: 12, m3: 12 };
  return formConfigSchema.parse({
    ...FORM_CONFIG,
    labels: { back: "Atrás", next: "Continuar", submit: "Ver mi perfil" },
    branding: {
      themePreset: preset.id,
      background: preset.background,
      foreground: preset.foreground,
      primaryColor: preset.primaryColor,
      fontFamily: preset.font,
      radius: "round",
      buttonStyle: preset.buttonStyle,
      buttonFullWidth: true,
      progressStyle: "bar",
      contentWidth: "wide",
      contentAlign: "left",
      transition: appearance.transition,
      logo:
        appearance.theme === "control-room"
          ? "/brujula-dark.svg"
          : "/brujula-light.svg",
    },
    cover: {
      enabled: false,
      eyebrow: "TU FUTURO, TU CAMINO",
      headline: "Tu próximo paso empieza por ti.",
      subheadline:
        "Descubre lo que te mueve, reconoce tus habilidades y explora hacia dónde puedes ir.",
      trustBadge: "30 intereses · 16 competencias · 6 preferencias",
      ctaText: "Encontrar mi rumbo",
      bannerText: null,
    },
    steps: QUESTIONS.map((q) => ({
      ...q.step,
      helper: `${names[q.module]} · Pregunta ${QUESTIONS.indexOf(q)+1} de 36`,
      optionLayout: q.kind === "context" ? "cards" : "list",
      options: q.step.options!.map((o, i) => ({
        ...o,
        label: q.kind === "likert" ? `${o.value} · ${o.label}` : o.label,
        ...(q.kind === "context" ? { icon: String.fromCharCode(65 + i) } : {}),
      })),
    })),
    reveal: {
      enabled: false,
      headline: "Tu perfil está tomando forma.",
      subtitle:
        "Reuniendo tus intereses y competencias para mostrar tus resultados.",
      durationMs: 1600,
      loader: "bar",
      loaderSize: "lg",
      textSize: "lg",
    },
  });
}
