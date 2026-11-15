# Arquitectura y conexión futura

## Recorrido

Portada → registro → renderer Dapta (36 preguntas) → tres cierres de etapa → cálculo RIASEC → dashboard → fichas de carrera / descarga PDF / ventana de correo.

`Page` conserva el registro y entrega la configuración al renderer. Dapta mantiene respuestas por `riasec_01`…`riasec_36`, valida sus opciones y controla los movimientos. La extensión `brujulaStages` añade el progreso y los hitos sin reemplazar el motor ni los controles. Bloquea los clics durante la salida de una pregunta y durante los mensajes para evitar saltos y respuestas duplicadas. Los hitos no se repiten al revisar una etapa ya completada.

Las etapas agrupan 12 preguntas por comodidad visual. Cada una contiene dos preguntas de cada dimensión; no representan categorías RIASEC diferentes. Las seis preguntas de una misma dimensión se suman a través de las tres etapas.

El adaptador `localAssessmentGateway.complete` recalcula el perfil mediante `@brujula/core`, crea un objeto versionado `Assessment` y lo guarda en la sesión de la pestaña. El dashboard y las fichas usan ese mismo objeto. Las fichas son rutas de Next.js; la portada carga el resultado al volver, evitando perder el perfil.

`localCareerGateway.list` devuelve las tres carreras de muestra con ofertas e ingresos de `Carreras.xlsx`. Ordena instituciones según la ubicación elegida y selecciona una referencia sin promediar percentiles. La selección de carreras no depende todavía del perfil.

`createProfilePdf` recibe exactamente el `Assessment` del dashboard y sus tres objetos `Career`. Compone cuatro páginas vectoriales A4 y `downloadProfilePdf` descarga el archivo. No requiere backend, impresora ni una pestaña adicional.

## Fronteras para la siguiente iteración

- `AssessmentGateway.complete(participant, answers)`: sustituir por una petición al backend que valide el registro y las 36 respuestas, recalcule el perfil y guarde la versión del instrumento.
- `CareerGateway`: sustituir el catálogo de muestra por un servicio consultable. El matching requiere perfiles RIASEC de carreras revisados, reglas de ranking, empates y pruebas propias; no se implementa un C-Index sin su especificación.
- `AssessmentGateway.email(assessment, email)`: futuro servicio autenticado/protegido de envío. El frontend actual no envía correos.
- `dapta/transport.ts`: adaptador local heredado; puede sustituirse por el contrato HTTP de Dapta si se usa su API. Evitar guardar la misma respuesta desde ambos adaptadores.
- El servidor deberá generar sus identificadores y controlar versiones, validación y duplicados. Definir esquema, retención y permisos antes de persistir.

## Compatibilidad

Se conservaron los paquetes de Dapta, sus licencias, las fuentes locales, el tipo de aplicación y los comandos de uso. Se reemplazaron las preguntas antiguas y el cálculo de dos letras por RIASEC-36 y tres letras. Los campos de competencias/contexto de `TestResults` quedan vacíos por compatibilidad; no se muestran ni se interpretan como medidas de esta evaluación.

`AppearancePanel.tsx` y `Results.tsx` corresponden a la interfaz anterior y no se montan. El único tema activo en esta entrega es el oscuro. Las referencias anteriores se conservan únicamente como documentación histórica.
