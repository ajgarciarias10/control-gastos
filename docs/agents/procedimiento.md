# Procedimiento

El único procedimiento ejecutable: los pasos, en orden, de empezar un ticket a
cerrarlo. [`AGENTS.md`](../../AGENTS.md) lleva las invariantes y gana si algo
de aquí lo contradice.

## 1. Antes de tocar nada

1. `git status` y `git branch --show-current`. Si el árbol tiene trabajo
   sin commitear de otro, PARA: no crees rama, no edites, no commitees. Informa.
2. Comprueba que estás en la rama que nombra el ticket. Si no, para y dilo.
3. Comprueba la base por sus ficheros, no por su nombre:
   `git ls-tree --name-only <base>` debe mostrar los ficheros que vas a tocar.
4. Lee el ticket. Si se contradice o contradice `AGENTS.md`, o pide algo que el
   código no puede hacer, para e informa con evidencia.
5. Si entras como **relevo** de otro agente: lee `## Comentarios` del ticket,
   `git status` y `git log --oneline -5`. Continúa desde ahí.

## 2. Hacer cambios

1. Una rama por tarea.
2. Toca solo `Ficheros en propiedad:`.
3. Un cambio lógico por commit; el arreglo y su prueba van juntos.
4. Sin firma de agente en los mensajes de commit.
5. Un arreglo trae una prueba que falla en el código roto y pasa en el
   arreglado; ejecútala contra el roto primero.
6. Sin dependencias nuevas sin preguntar. Respeta el estilo existente. No
   refactorices lo vecino.

## 3. Cerrar un ticket

1. Ejecuta la suite completa de la zona que tocaste. Nada rojo se commitea.
2. Empuja **tu** rama (no `main`). Esa es la cola de revisión.
3. No hagas merge. Solo el dueño integra.
4. Informa con esta plantilla (etiquetas en inglés, contenido en el idioma del
   dueño):

        TASK: <una línea>
        BRANCH: <nombre>
        COMMIT: <hash corto>
        FILES CHANGED: <lista>
        TESTS: <comandos y resultados, antes y después>
        BLOCKERS OR FINDINGS: <lo que quede fuera de alcance y merezca aviso>
        WHAT I DID NOT DO: <lista explícita>
        NOT VERIFIED: <lo que necesita navegador, datos reales o al dueño>

## 4. Integración (solo el dueño o el coordinador)

Revisa la rama empujada y ejecuta
`node tool/agent-guard.mjs --branch <rama> --base <base>`. Código 0: nadie se
salió de sus ficheros. 1: alguien sí. 2: no hay base fiable y no se dictamina.
Después, la suite completa, y solo entonces integra.

## 5. Cuando algo va mal

- Un comando falla: lee el error, no lo repitas a ciegas.
- Fallan las pruebas tras tu cambio: revierte, investiga, reintenta.
- Descubres a mitad de tarea que la base es incorrecta: para.
- Commiteaste en la rama equivocada: no empujes; informa.
- Un agente delegado se interrumpió (cuota, coste, reinicio): reanuda la misma
  sesión o entra como relevo (§1.5); no empieces de cero.
