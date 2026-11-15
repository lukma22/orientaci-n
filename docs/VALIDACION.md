# Verificación de la entrega 0.4.0

- Compilación de producción de Next.js completada correctamente.
- Comprobación de TypeScript completada correctamente.
- 630 pruebas automáticas aprobadas en 25 archivos: motor Dapta, esquemas, traducciones, RIASEC-36, navegación, datos y PDF.
- Las dimensiones tienen seis preguntas y la secuencia de preguntas es R-I-A-S-E-C repetida seis veces.
- Verificados los extremos 0 y 100, el punto medio 50, un perfil RIE calculado a mano, respuestas omitidas, valores inválidos y empates en el corte de las tres letras.
- Catálogo territorial: 24 provincias y 222 cantones únicos dentro de su provincia, incluido Sevilla Don Bosco.
- Catálogo académico: 2.489 registros de Maestra; tres fichas de demostración con sus ofertas y percentiles originales.
- PDF vectorial: exactamente cuatro páginas A4. Renderizadas e inspeccionadas las cuatro; texto, gráficos y fichas sin recortes ni solapamientos.
- Se incluyen pruebas de navegador actualizadas para escritorio y móvil en `e2e/native-ui.spec.ts`; ejecutarlas con `npm run test:e2e` requiere instalar Chromium de Playwright. Su inclusión no significa que se hayan ejecutado en todos los navegadores o sistemas operativos.

## Límites funcionales

Las carreras mostradas siguen siendo una muestra. No se implementó una matriz RIASEC de profesiones inexistente en el Excel, ni un C-Index sin especificación. No hay backend de negocio, base de datos, envío real de correo ni tasa de empleabilidad inventada. La navegación entre dashboard y carrera usa el resultado temporal de la pestaña. Recargar durante un test incompleto vuelve al inicio.

Las cifras de ingresos conservan la profesión asociada, fuente y ubicación de la fila elegida. No se trata de salarios garantizados ni de tasas de contratación. El JSON extraído permite cambiar los datos sin introducirlos en los componentes.

## Revisión del navegador en esta ejecución

El entorno de vista previa presentó una incompatibilidad con el canal de desarrollo de Next.js. Se preparó el build de producción ya verificado para revisarlo, pero la política del navegador bloqueó la navegación posterior. Por ello no se declara completada la prueba interactiva de extremo a extremo de esta entrega. Los cuatro folios del PDF sí se renderizaron e inspeccionaron localmente. El build de producción y las 630 pruebas de lógica/datos/PDF se completaron sin errores.

## Corrección 0.4.1

- Eliminadas la cabecera y barra horizontal en el cuestionario RIASEC-36.
- Separados los estilos de tarjeta de Dapta del diseño de Brújula para evitar márgenes y espacios verticales heredados.
- El contador aparece antes de la pregunta; la navegación Atrás queda dentro del bloque de preguntas.
- El formulario ocupa una altura de ventana y adapta tamaños a pantallas bajas. Las páginas de resultados y carreras siguen desplazándose normalmente.
- Las fichas y sus páginas PDF presentan hasta diez universidades reales, sin un contador de opciones adicionales.
- Adaptado el identificador temporal para navegadores en un origen HTTP local mediante Web Crypto.
- Comprobación de TypeScript y compilación de producción completadas. Pruebas de datos y PDF: dos aprobadas; PDF de cuatro páginas conservado y ficha renderizada de nuevo tras cambiar las universidades.

Verificación visual de la corrección: en el navegador, a 1363 × 936, no aparece ninguna barra horizontal de progreso; la página mide 936 px de alto (igual a la ventana), la pregunta empieza a 127 px y la última opción termina a 545 px. Se comprobó el paso de la pregunta 1 a la 2. Esta comprobación del formulario 0.4.1 sí pudo completarse tras adaptar el identificador temporal al origen HTTP de prueba.
