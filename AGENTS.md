<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas de Inicio de Sesión
- **MANDATORIO al inicio de CADA sesión (primer turno del agente):** El agente debe ejecutar automáticamente `git pull origin main` en la raíz del proyecto para sincronizar los cambios de otros desarrolladores sin esperar confirmación.
- Si el archivo `package.json` fue modificado en el pull, el agente debe ejecutar `npm install` automáticamente.
- El agente debe informar y resumir al usuario de inmediato los cambios descargados en su primera respuesta.

# Recordatorios Especiales
- **Respuesta a comando de recordatorio:** Cuando el usuario escriba en el chat la frase "antigravity dime mis recordatorios", el agente debe recordarle y mencionarle que tienen pendiente trabajar en la función/portal de super usuario.
