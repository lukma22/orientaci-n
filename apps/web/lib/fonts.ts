import type { FormFont } from '@quill/engine/browser';

const SANS_FALLBACK = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const SERIF_FALLBACK = 'ui-serif, Georgia, "Times New Roman", serif';

/**
 * The `font-family` value for each curated face. `custom` is absent on purpose:
 * its family name comes from the author's config, so the caller builds that
 * stack itself (see `formFontStack`).
 */
const CURATED_STACKS: Record<Exclude<FormFont, 'custom'>, string> = {
  figtree: `var(--font-figtree), Figtree, ${SANS_FALLBACK}`,
  poppins: `var(--font-poppins), Poppins, ${SANS_FALLBACK}`,
  inter: `var(--font-inter), Inter, ${SANS_FALLBACK}`,
  'dm-sans': `var(--font-dm-sans), "DM Sans", ${SANS_FALLBACK}`,
  'space-grotesk': `var(--font-space-grotesk), "Space Grotesk", ${SANS_FALLBACK}`,
  manrope: `var(--font-manrope), Manrope, ${SANS_FALLBACK}`,
  'work-sans': `var(--font-work-sans), "Work Sans", ${SANS_FALLBACK}`,
  fraunces: `var(--font-fraunces), Fraunces, ${SERIF_FALLBACK}`,
  playfair: `var(--font-playfair), "Playfair Display", ${SERIF_FALLBACK}`,
};

/**
 * The CSS `font-family` a resolved design should render with.
 *
 * A custom face is quoted and given the same fallback chain as the curated ones,
 * so a font file that 404s degrades to a system sans rather than to an unstyled
 * serif. `resolveDesign` has already guaranteed that `custom` implies a complete
 * `customFont`, so there is no half-configured case to handle here.
 */
export function formFontStack(font: FormFont, customName?: string | null): string {
  if (font === 'custom') {
    const name = customName?.trim();
    return name ? `"${name.replace(/"/g, '')}", ${SANS_FALLBACK}` : CURATED_STACKS.figtree;
  }
  return CURATED_STACKS[font];
}

/**
 * The `@font-face` rule for an author-supplied face, or null when there isn't
 * one. `font-display: swap` keeps the form readable while the file loads — a
 * form that renders invisible text until a third-party font arrives is worse
 * than one that reflows.
 */
export function customFontFace(name: string, url: string): string {
  // The family name is quoted and its own quotes stripped; the URL is quoted and
  // validated as http(s) by the schema. Both sinks are inside a CSS string, so
  // neither can terminate the rule and inject a new one.
  const family = name.replace(/["\\]/g, '');
  const src = url.replace(/["\\)]/g, '');
  return `@font-face{font-family:"${family}";src:url("${src}");font-display:swap;}`;
}
