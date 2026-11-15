export default function Intro({ onStart }) {
  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-kicker">Orientación vocacional y de empleabilidad</div>
          <h1>Brújula: encuentra tu ruta entre lo que te gusta y lo que el mercado necesita</h1>
          <p className="lead">Un instrumento de tres módulos que combina intereses vocacionales, competencias de empleabilidad y contexto del mercado laboral y la oferta de educación superior en Ecuador.</p>
          <div className="hero-modules">
            <div className="hero-module"><div className="n">I.</div><div className="t">Intereses</div><div className="d">30 ítems sobre lo que disfrutas hacer (modelo RIASEC).</div></div>
            <div className="hero-module"><div className="n">II.</div><div className="t">Empleabilidad</div><div className="d">16 ítems sobre competencias transversales que piden los empleadores.</div></div>
            <div className="hero-module"><div className="n">III.</div><div className="t">Contexto laboral</div><div className="d">Preferencias sobre sector, modalidad y movilidad.</div></div>
          </div>
          <button className="start-btn" onClick={onStart}>Comenzar el test — toma unos 10 minutos</button>
        </div>
      </div>
      <div className="wizard" style={{ paddingTop: 36 }}>
        <div className="panel">
          <h3>¿Qué vas a obtener al final?</h3>
          <p style={{ fontSize: ".92rem", color: "var(--ink-600)" }}>Un perfil de intereses (código Holland), un mapa de tus competencias de empleabilidad con fortalezas y áreas a desarrollar, y una selección de áreas de carrera con ejemplos de instituciones de educación superior en Ecuador y su relación con el mercado laboral actual.</p>
          <div className="notice">Este instrumento es orientativo: acompaña, no reemplaza, el acompañamiento de un/a orientador/a vocacional o consejero/a académico/a.</div>
        </div>
      </div>
    </>
  );
}
