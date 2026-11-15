'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="panel error-panel">
    <h1>No pudimos mostrar esta pantalla</h1>
    <p>Intenta cargarla de nuevo. Si el problema continúa, recarga la página para empezar una nueva prueba.</p>
    <button type="button" className="btn" onClick={reset}>Volver a intentar</button>
  </main>;
}
