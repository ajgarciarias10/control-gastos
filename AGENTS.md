# Reglas para cualquier agente que trabaje en este repositorio

Claude, Codex, Gemini, opencode y cualquier otra herramienta leen **este mismo
fichero**. Hay una sola copia a propósito: dos versiones acabarían
contradiciéndose. Léelo entero antes de tocar nada.

## Cómo trabajamos

1. **Una rama por trabajo**, con el nombre de lo que hace (`feature/...`,
   `fix/...`, `docs/...`), nunca de quién lo escribe. No hagas commits grandes
   en la rama en la que te encontraste.
2. **El ticket manda.** El trabajo que cambia algo llega como
   `docs/trabajo/<slug>/tickets/NN-<nombre>.md` (plantilla en
   `docs/plantillas/ticket.md`). Solo puedes tocar los ficheros de
   `Ficheros en propiedad:`. Si necesitas algo más, para y dilo: se arregla el
   ticket, no la conversación.
3. **Un worktree por agente.** No compartas checkout con otro agente y no
   trabajes ni mergees en el checkout compartido.
4. **Un cambio lógico, un commit, con su prueba.** Nada validado se queda sin
   commitear y nada rojo se commitea. Un arreglo trae una prueba que falla antes
   y pasa después.
5. **Empuja solo tu rama.** Solo el dueño integra en `main` o en la rama de
   integración. Ningún agente hace merge, force-push ni despliega.
6. **Sin firmas de agente** en commits ni PRs (`Co-Authored-By`, nombres de
   herramienta). El autor es el dueño del proyecto.
7. **Pregunta antes de añadir una dependencia** o técnica que no esté ya en el
   repo. «Solo para probar» cuenta como añadirla.
8. **Lee al llamado antes de escribir un rescate.** Antes de un `try/catch`,
   `||`, `??` o valor por defecto que rescate el camino principal, lee ese
   camino y averigua qué trata de verdad como fallo.
9. **Lo descartado se retira en el mismo turno**: la sección del doc, la rama,
   el fichero sin uso. La historia queda en git.
10. **Disciplina de coste.** Usa el modelo más barato que cumpla el ticket. El
    más caro solo con permiso del dueño. No releas lo que ya leíste.

## Si te quedas sin cuota o sin contexto

Esto vale aunque no haya servicio automático de relevo. Antes de parar:

1. Commitea lo que esté probado y empuja **tu** rama.
2. Escribe en `## Comentarios` del ticket: qué está hecho, qué falta, el
   siguiente paso exacto y qué no has podido comprobar.
3. Para. No dejes cambios sin commitear: quien te releve entra **en el mismo
   worktree** y encuentra el trabajo tal como lo dejaste.

Si entras como relevo: lee `## Comentarios`, ejecuta `git status` y
`git log --oneline -5`, y continúa. No empieces de cero.

## Varios agentes a la vez

- Di qué ficheros vas a tocar antes de empezar, si el ticket no lo deja cerrado.
- Antes de crear una rama o worktree, comprueba con
  `git ls-tree --name-only <base>` que la base tiene los ficheros que tu tarea
  va a tocar. «La rama principal» es ambiguo hasta que lo compruebas.
- La comprobación de propiedad es automática:
  `node tool/agent-guard.mjs --branch <rama> --base origin/main`
  (0: nadie se salió; 1: alguien sí; 2: no hay base fiable).

## Reglas propias de este proyecto

- Los gastos del usuario están en `localStorage`/almacenamiento del navegador: ningún cambio puede borrarlos ni cambiar su formato sin migración y copia previa.
- No se añaden servidores, cuentas ni envío de datos a terceros: la privacidad local es la promesa del producto.
- Si se cambia `service-worker.js`, sube la versión de la caché para que los móviles reciban la actualización.
- La app no tiene tests: lo que se afirme como verificado debe haberse probado a mano en el navegador y decirse así.

## Dónde está el resto

| Fichero | Qué contiene |
|---|---|
| `CLAUDE.md` | Contexto del proyecto: stack, estructura, cómo ejecutarlo |
| `docs/agents/procedimiento.md` | Los pasos, en orden, del pre-vuelo al cierre |
| `docs/plantillas/ticket.md` | La plantilla de ticket |
| `docs/BACKLOG.md` | Qué está abierto ahora mismo |
| `docs/adr/` | Decisiones ya tomadas; no las revivas sin motivo nuevo |

Si algo de esos ficheros contradice este, gana este.
