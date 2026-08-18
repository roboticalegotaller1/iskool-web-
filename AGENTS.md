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

# Reglas para la Creación y Consulta de Planeaciones (Cuentas de Profesor)
- **1. Consulta Prioritaria en Bóveda Obsidian (Vault-First / Cache-First):**
  - Cuando un profesor solicita o requiere una planeación dentro del sistema ISkool, el sistema **primero revisa en la bóveda de Obsidian** (`planeaciones/`) si ya existe un nodo/archivo adecuado para el contenido, PDA o tema solicitado.
  - Si la planeación existe en Obsidian, se recupera directamente y se entrega al profesor al instante, evitando duplicaciones y consumo innecesario de IA.
- **2. Generación con IA exclusivamente en ausencia (Fallback Pedagógico):**
  - **Solo en caso de no existir una planeación previa** en la bóveda o base de datos de ISkool, el sistema procede a generarla con IA aplicando los más altos estándares pedagógicos oficiales (NEM 2024, PDA textual de la SEP, 10 sesiones de 50 min con Inicio/Desarrollo/Cierre, rúbrica analítica y entregables tangibles).
- **3. Persistencia Automática en Obsidian y Sincronización Git:**
  - Toda planeación creada con IA se guarda de forma inmediata como archivo Markdown (`.md`) con Frontmatter YAML y enlaces bidireccionales `[[...]]` dentro de la estructura de carpetas de Obsidian correspondiente (Fase, Grado, Disciplina).
  - Se actualiza el MOC (Índice Maestro) y se asegura la sincronización con los repositorios locales y remotos de Git.
- **4. Despliegue en la Interfaz del Profesor:**
  - Una vez asegurada su persistencia en Obsidian, la planeación se presenta en el panel docente de ISkool para su consulta, edición y aplicación en clase.
