import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@quill/shared/tokens.css";
import "../dapta/public-form.css";
import "./brujula.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Brújula: encuentra tu norte",
  description:
    "Descubre tus intereses y explora posibilidades para tu futuro con Brújula RIASEC-36.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
