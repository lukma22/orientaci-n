// Local adapter for the native Dapta renderer. No network, storage, or database.
import { computeScore } from "@quill/engine/browser";
import { computeResults, FORM_CONFIG } from "@brujula/core";
import type {
  BookingCallbackInput,
  SubmissionVisit,
  UploadPresignInput,
} from "@quill/types";

export interface SubmitVerdict {
  ok: boolean;
  score?: number;
  outcome?: string | null;
  message?: string;
  error?: string;
}
export type PublicFormEvent = {
  type: string;
  stepIndex?: number | null;
  stepKey?: string | null;
};
export async function submitForm(
  _account: string,
  _slug: string,
  payload: {
    sessionId: string;
    data: Record<string, unknown>;
    partial?: boolean;
    locale?: "en" | "es";
    captchaToken?: string;
    hp?: string;
    visit?: SubmissionVisit;
  },
): Promise<SubmitVerdict> {
  const answers = Object.fromEntries(
    Object.entries(payload.data).filter(
      (pair): pair is [string, string] => typeof pair[1] === "string",
    ),
  );
  try {
    if (!payload.partial) computeResults(answers);
    return {
      ok: true,
      score: computeScore(FORM_CONFIG, answers),
      outcome: null,
    };
  } catch {
    return {
      ok: false,
      message: "Completa todas las preguntas para ver tu perfil.",
    };
  }
}
export async function recordEvent(
  _account: string,
  _slug: string,
  _payload: { sessionId: string } & PublicFormEvent,
): Promise<void> {}
export async function recordEvents(
  _account: string,
  _slug: string,
  _payload: { sessionId: string; events: PublicFormEvent[] },
): Promise<void> {}
export async function recordBooking(
  _account: string,
  _slug: string,
  _payload: BookingCallbackInput,
): Promise<void> {}
type UploadVerdict =
  | { ok: true; upload: { url: string; key: string; contentType: string } }
  | { ok: false; message: string };
export async function presignUpload(
  _account: string,
  _slug: string,
  _payload: UploadPresignInput,
): Promise<UploadVerdict> {
  return { ok: false, message: "Esta prueba no utiliza carga de archivos." };
}
