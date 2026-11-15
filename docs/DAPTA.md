# Dapta en esta versión

Se conserva la procedencia del código en `dapta-ui-source.json`, `upstream-manifest.json`, `THIRD_PARTY_NOTICES.md` y las licencias de los paquetes.

El test usa `FormRenderer`, `StepInput`, `FormProgress`, los tokens y el motor `@quill/engine/browser`. Se añade la opción local `brujulaStages` para animaciones y cierre de etapas. El esquema de configuración y la validación siguen siendo los de Dapta.

La portada, registro, dashboard y exportación del perfil son componentes propios de Brújula. El catálogo extraído del Excel se mantiene fuera de los componentes. No se usa la consola administrativa ni el constructor visual de Dapta en esta entrega local.
