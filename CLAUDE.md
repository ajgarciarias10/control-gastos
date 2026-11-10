# Contexto del proyecto para Claude

Las reglas no están aquí: viven en [`AGENTS.md`](AGENTS.md), el nombre que leen
todas las herramientas. Los pasos de trabajo están en
[`docs/agents/procedimiento.md`](docs/agents/procedimiento.md). Este fichero es
solo contexto; si contradice a esos dos, ganan ellos.

## Qué es esto

PWA de control de gastos personales, 100 % local: los datos viven en el navegador (sin cuentas ni servidor).

## Stack y estructura

HTML, CSS y JavaScript sin framework ni paso de construcción: `index.html`, `app.js`, `styles.css`, `service-worker.js`, `manifest.json` e iconos en la raíz.

## Comandos

    # No hay dependencias ni construcción. Para verlo:
    python3 -m http.server 8000   # y abrir http://localhost:8000
    # Este repo no tiene tests de la aplicación: solo el guard de propiedad (node --test tool/agent-guard.test.mjs).

## Dónde se sigue el trabajo

Trabajo abierto: [`docs/BACKLOG.md`](docs/BACKLOG.md). Detalle por funcionalidad:
`docs/trabajo/<slug>/`. Decisiones: `docs/adr/`. No se guardan listas de estado
en este fichero porque quedan obsoletas.
