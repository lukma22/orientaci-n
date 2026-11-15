# Brújula · versión final del frontend (0.4.2)

Aplicación local sobre la base original de Next.js, React, TypeScript y Dapta Forms. No requiere una base de datos ni credenciales.

## Arranque en Mac

Necesitas Node.js 22 o 24 (incluye npm). Descomprime el ZIP, abre la carpeta **brujula-dapta-final** en VS Code y abre Terminal → Nuevo terminal. La carpeta correcta contiene este README y `package.json`.

Copia el bloque completo:

```bash
npm ci && npm run dev
```

Abre http://localhost:3000. Mantén la terminal abierta. Para apagarlo, pulsa **Control + C**. Si ya hay otra versión corriendo, detenla antes de arrancar esta.

Desde Terminal del Mac puedes escribir `cd ` (con un espacio), arrastrar la carpeta descomprimida a la ventana y pulsar Enter antes de pegar los comandos.

Si necesitas otro puerto: `npm run dev -- --port 3001`. Luego abre http://localhost:3001.

## Qué incluye esta entrega

1. Portada que presenta Brújula y el botón «Encontrar mi rumbo».
2. Registro breve: nombre; etapa académica con tres opciones (Bachillerato, Educación superior, Reorientación profesional); provincia y cantón opcionales y vinculados entre sí. Hay 24 provincias y 222 cantones, incluidos en un JSON separado.
3. Las 36 preguntas del cuadernillo proporcionado, en su mismo orden y con la escala Nada / Poco / Neutral / Bastante / Totalmente.
4. Una pregunta a la vez, avance automático al responder y botón Atrás para revisar selecciones.
5. Tres etapas de 12 preguntas. Barra vertical a la izquierda, círculos de 26 px (24 px en móvil), llenado con onda y check al cerrar cada etapa.
6. Tras las preguntas 12, 24 y 36, la pregunta se sustituye por un mensaje central de aproximadamente 4,2 segundos. La brújula hace una vuelta completa y se estabiliza en el norte. Se continúa sin pulsar otro botón.
7. Fundidos y desplazamientos cortos en todas las preguntas; respeta la preferencia de reducir movimiento.
8. Tema oscuro fijo: fondo `#0a0c0e`, acento `#d3e750`.
9. Dashboard con las tres carreras del diseño aprobado, barras de intereses, gráfico RIASEC y acciones inferiores uniformes.
10. Cada carrera tiene su página `/carreras/[slug]`, detalles e ingresos del Excel. Se puede volver al dashboard sin repetir el test; también funciona al recargar la ficha dentro de la misma pestaña.
11. Ventana de correo con el fondo oscurecido. El envío real queda pendiente del backend.
12. Descarga directa de un PDF A4 de **exactamente cuatro páginas**: dashboard, Derecho, Ciencia de Datos y Comunicación. Es vectorial, lleva el nombre y los puntajes actuales y se genera en el navegador.
13. Tasas de desempleo de la ENEMDU en el dashboard, las fichas y el PDF. La sección «Explorar tasas de desempleo» del dashboard permite consultar títulos, ocupaciones, actividades económicas, categorías ocupacionales y la serie general.

## Puntajes y carreras: alcance real

El perfil RIASEC **sí se calcula** con las respuestas. Cada dimensión agrupa seis preguntas, suma de 6 a 30 y se normaliza con `(suma - 6) / 24 × 100`, redondeando a entero. El código contiene las tres dimensiones más altas. Si hay empate, el orden es R, I, A, S, E, C y se informa en el dashboard y PDF.

Las tres carreras **son una muestra para demostrar el frontend**, tal como se acordó. Sus datos académicos y de ingresos se extraen del Excel, pero no son el resultado de un matching validado. El Excel no contiene perfiles RIASEC de carreras ni la matriz/fórmula C-Index; esa asociación debe definirse antes de implementar recomendaciones reales. Nombre, etapa y ubicación no modifican el puntaje.

La ubicación prioriza las instituciones del catálogo y selecciona una fila de ingresos del cantón o provincia, cuando existe; de lo contrario se usa una referencia de Quito indicando su ubicación real. Los percentiles no se promedian entre filas ni se inventan tasas de empleabilidad. P50 es la mediana y P25–P75 contiene el 50 % central de los ingresos de la fuente. Estos importes son orientativos y la asociación carrera–profesión es provisional según el Excel.

Las tasas de las fichas son estimaciones nacionales con 11 trimestres de la ENEMDU del INEC, de enero de 2023 a septiembre de 2025. La tasa por título usa la población activa que declaró ese título, con sus factores de expansión. El indicador por ocupación o actividad usa el trabajo principal de los ocupados y el último trabajo de los desempleados con experiencia. Los grupos ocupacionales más amplios se presentan como contexto. Las revisiones CIIU 4.0 y 4.1 conservan sus períodos respectivos.

## Estructura de archivos

| Ruta | Responsabilidad |
|---|---|
| `apps/web/app/page.tsx` | Coordina portada → registro → test → dashboard. |
| `apps/web/components/StartFlow.tsx` | Portada y formulario de registro. |
| `apps/web/dapta/form-renderer.tsx` | Renderer original de Dapta, con extensión localizada para hitos y transiciones. |
| `apps/web/components/public/step-input.tsx` | Controles reales de respuesta de Dapta. |
| `apps/web/components/StageProgress.tsx` | Progreso vertical, llenado, check, mensajes y brújula. |
| `apps/web/components/Dashboard.tsx` | Dashboard, detalles de carrera y ventanas emergentes. |
| `apps/web/components/InterestRadar.tsx` | Gráfico SVG de los seis puntajes reales. |
| `apps/web/app/carreras/[slug]/page.tsx` | Rutas de las fichas de carrera con regreso al perfil. |
| `apps/web/lib/assessment.ts` | Contrato del servicio de resultados y adaptador local; memoria temporal de la pestaña. |
| `apps/web/lib/career-service.ts` | Acceso al catálogo de muestra, ubicación y referencias de ingresos. |
| `apps/web/lib/export-pdf.ts` | PDF de cuatro páginas y descarga directa. |
| `apps/web/lib/brujula-config.ts` | Configuración Dapta del tema oscuro y preguntas. |
| `apps/web/app/brujula.css` y `dashboard.css` | Tema, diseños adaptables y animaciones. |
| `apps/web/data/ecuador.json` | Provincias y cantones, sin mezclar datos con el formulario. |
| `apps/web/data/carreras-muestra.json` | Datos reales del Excel para las tres fichas de demostración. |
| `apps/web/data/desempleo-enemdu-brujula.json` | Tasas agregadas, muestras, intervalos, códigos y fuentes. |
| `apps/web/data/catalogo-academico.json` | 2.489 ofertas de la hoja Maestra para la próxima integración. |
| `packages/brujula-core/src/items.ts` | Texto y dimensión de las 36 preguntas. |
| `packages/brujula-core/src/form-config.ts` | Escala, validación Dapta y tres etapas. |
| `packages/brujula-core/src/scoring.ts` | Fórmulas RIASEC y código de tres letras. |
| `packages/engine`, `shared`, `types`, `config` | Paquetes de Dapta (`@quill`) conservados. |
| `docs/ARQUITECTURA.md` | Flujo de datos y puntos de conexión futura. |
| `docs/VALIDACION.md` | Verificaciones y límites de esta entrega. |
| `docs/sources/` | Excel y PDF originales que sirven de referencia. |
| `scripts/import-catalog.py` | Regenera los JSON desde el Excel; no es necesario para usar la web. |
| `references/` | Referencias originales de las iteraciones anteriores. |

## Persistencia y futura conexión

Esta versión no hace llamadas a un backend de negocio. El perfil completado y el registro se conservan temporalmente en `sessionStorage` de esta pestaña para poder abrir carreras, volver y recargar. No existe una cuenta ni una base de datos. El cuestionario en curso permanece en memoria; recargar antes de terminar vuelve al inicio. «Repetir test» borra el resultado de la sesión tras confirmación. La descarga permite guardar una copia duradera en PDF.

Los contratos `AssessmentGateway` y `CareerGateway` separan la pantalla de sus fuentes de datos. Se podrán implementar adaptadores HTTP para guardar registros/respuestas, recibir los resultados calculados y consultar carreras sin reescribir los controles. El servidor deberá volver a validar y recalcular; los cálculos del navegador no deben ser la autoridad al guardar. No se incluyen claves de servidor en el frontend.

El envío de correo y el guardado de opiniones no están conectados: el correo se muestra como próximo; la opinión solo confirma la interacción de la prueba local.

## Verificación técnica

```bash
npm test
npm run typecheck
npm run build
```

Se incluyen pruebas de navegador actualizadas en `e2e/`. Para ejecutarlas en tu equipo, instala el navegador de pruebas con `npx playwright install chromium` y ejecuta `npm run test:e2e`. No necesitas hacerlo para usar la página.

El PDF usa `pdf-lib` y una fuente incluida en el proyecto, sin servicios externos. El formato del PDF se genera con los mismos datos del dashboard; no es una captura que se corte entre páginas.

No se publica nada ni se sincroniza con Git en esta entrega.

## Corrección visual 0.4.1

Se retira la cabecera y barra horizontal antigua durante las preguntas. El contador, la pregunta y sus opciones quedan juntos, sin la separación de la tarjeta anterior. El cuestionario se ajusta a la altura de la ventana y conserva solo el progreso vertical. En ventanas excepcionalmente pequeñas queda un desplazamiento interno sin barra visible para que ninguna respuesta sea inaccesible. El dashboard y las fichas largas conservan su desplazamiento normal. Las fichas y el PDF muestran hasta diez universidades reales, sin el texto de opciones adicionales.
