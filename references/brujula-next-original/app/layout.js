import "./globals.css";

export const metadata = {
  title: "Brújula — Test de orientación vocacional y empleabilidad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
