import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { validateApiAuth } from '@/lib/authValidator';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const OBSIDIAN_VAULT_PATH = 'C:\\Users\\kami-\\Desktop\\2025-2026\\iskool\\obsidean\\brain\\iskool';

const ObsidianQuerySchema = z.object({
  q: z.string().trim().min(1, 'El parámetro de búsqueda "q" es requerido').max(300),
  level: z.string().trim().max(100).optional().default(''),
  grade: z.string().trim().max(100).optional().default(''),
  subject: z.string().trim().max(100).optional().default('')
});

const ObsidianPlanningSchema = z.object({
  title: z.string().trim().min(2, 'El título es obligatorio y debe contener al menos 2 caracteres').max(250),
  teacherName: z.string().trim().max(150).optional(),
  levelName: z.string().trim().max(100).optional(),
  nivel: z.string().trim().max(100).optional(),
  gradeName: z.string().trim().max(100).optional(),
  grado: z.string().trim().max(100).optional(),
  fase: z.string().trim().max(100).optional(),
  subjectName: z.string().trim().max(150).optional(),
  asignatura: z.string().trim().max(150).optional(),
  campoFormativo: z.string().trim().max(200).optional(),
  ejesArticuladores: z.array(z.string()).optional(),
  duration: z.string().trim().max(100).optional(),
  pda: z.string().trim().max(500).optional(),
  preguntasDetonadoras: z.array(z.string()).optional(),
  inicio: z.string().trim().max(5000).optional(),
  desarrollo: z.string().trim().max(5000).optional(),
  cierre: z.string().trim().max(5000).optional(),
  evaluacion: z.string().trim().max(5000).optional(),
  materiales: z.string().trim().max(5000).optional(),
  syncGit: z.boolean().optional(),
  isSuperUser: z.boolean().optional()
});

function cleanString(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function sanitizeFolderName(str: string): string {
  if (!str) return 'General';
  const clean = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const safe = clean.replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_');
  return safe || 'General';
}

function getAllMarkdownFiles(dirPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;
  const list = fs.readdirSync(dirPath);
  for (const file of list) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

function formatSpanishDateInLetters(dateInput?: string | Date): string {
  const d = dateInput ? (typeof dateInput === 'string' && dateInput.includes('de') ? null : new Date(dateInput)) : new Date();
  if (!d || isNaN(d.getTime())) {
    if (typeof dateInput === 'string' && dateInput.length > 0) return dateInput;
    return formatSpanishDateInLetters(new Date());
  }
  const day = d.getDate();
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return `${day} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Validación de Sesión y Autenticación
    const auth = await validateApiAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { found: false, error: auth.error || 'No autorizado. Se requiere sesión activa.' },
        { status: 401 }
      );
    }

    // 2. Sanitización y validación de parámetros con Zod
    const { searchParams } = new URL(request.url);
    const parsedQuery = ObsidianQuerySchema.safeParse({
      q: searchParams.get('q') || '',
      level: searchParams.get('level') || '',
      grade: searchParams.get('grade') || '',
      subject: searchParams.get('subject') || ''
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { found: false, error: parsedQuery.error.issues[0]?.message || 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { q: query, level: levelParam, grade: gradeParam, subject: subjectParam } = parsedQuery.data;
    
    if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
      return NextResponse.json({ found: false, note: null });
    }

    const cleanQuery = cleanString(query);
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    const planningsDir = path.join(OBSIDIAN_VAULT_PATH, 'planeaciones');
    if (!fs.existsSync(planningsDir)) {
      return NextResponse.json({ found: false, note: null });
    }

    const allFiles = getAllMarkdownFiles(planningsDir);
    let bestMatch: { filename: string; filePath: string; content: string; score: number } | null = null;

    for (const filePath of allFiles) {
      const filename = path.basename(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanContent = cleanString(content);

      let score = 0;
      queryWords.forEach(word => {
        if (cleanContent.includes(word)) score += 1;
      });

      // Bonus por coincidencia exacta de nivel, grado o asignatura si están parametrizados
      if (levelParam && cleanContent.includes(cleanString(levelParam))) score += 2;
      if (gradeParam && cleanContent.includes(cleanString(gradeParam))) score += 2;
      if (subjectParam && cleanContent.includes(cleanString(subjectParam))) score += 2;

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { filename, filePath, content, score };
      }
    }

    if (bestMatch && bestMatch.score >= Math.max(1, Math.floor(queryWords.length * 0.25))) {
      const rawContent = bestMatch.content;
      
      // Extracción YAML Frontmatter si existe
      const titleYaml = rawContent.match(/^title:\s*"?(.*?)"?$/m);
      const titleMd = rawContent.match(/^#\s*(?:Planeación Didáctica:\s*)?(.*)$/m);
      const title = titleYaml ? titleYaml[1].trim() : (titleMd ? titleMd[1].trim() : bestMatch.filename.replace('.md', ''));

      const campoYaml = rawContent.match(/^campo_formativo:\s*"?(.*?)"?$/m);
      const campoMd = rawContent.match(/\*\*Campo Formativo:\*\*\s*(?:\[\[)?(.*?)(?:\]\])?$/m);
      const campoFormativo = campoYaml ? campoYaml[1].trim() : (campoMd ? campoMd[1].trim() : 'Saberes y Pensamiento Científico');

      const levelYaml = rawContent.match(/^grado:\s*"?(.*?)"?$/m) || rawContent.match(/^nivel:\s*"?(.*?)"?$/m) || rawContent.match(/^fase:\s*"?(.*?)"?$/m);
      const levelMd = rawContent.match(/\*\*Nivel \/ Fase:\*\*\s*(?:\[\[)?(.*?)(?:\]\])?$/m) || rawContent.match(/\*\*Grado:\*\*\s*(?:\[\[)?(.*?)(?:\]\])?$/m);
      const levelName = levelYaml ? levelYaml[1].trim() : (levelMd ? levelMd[1].trim() : 'Fase 6');

      const subjectYaml = rawContent.match(/^disciplina:\s*"?(.*?)"?$/m) || rawContent.match(/^asignatura:\s*"?(.*?)"?$/m);
      const subjectMd = rawContent.match(/\*\*Disciplina \/ Materia:\*\*\s*(?:\[\[)?(.*?)(?:\]\])?$/m) || rawContent.match(/\*\*Asignatura:\*\*\s*(?:\[\[)?(.*?)(?:\]\])?$/m);
      const subjectName = subjectYaml ? subjectYaml[1].trim() : (subjectMd ? subjectMd[1].trim() : 'Matemáticas');

      const pdaBlock = rawContent.match(/## 🎯 Proceso de Desarrollo de Aprendizaje[\s\S]*?```(?:text)?\n([\s\S]*?)```/);
      const pdaMd = rawContent.match(/\*\*PDA:\*\*\s*(.*)/);
      const pda = pdaBlock ? pdaBlock[1].trim() : (pdaMd ? pdaMd[1].trim() : query);

      const durationYaml = rawContent.match(/^temporalidad:\s*"?(.*?)"?$/m);
      const durationMd = rawContent.match(/\*\*Duración:\*\*\s*(.*)/);
      const duration = durationYaml ? durationYaml[1].trim() : (durationMd ? durationMd[1].trim() : '2 semanas (10 sesiones de 50 min)');

      // Preguntas detonadoras
      const preguntasBlock = rawContent.match(/## ❓ Preguntas Detonadoras[\s\S]*?\n([\s\S]*?)(?=\n##|$)/);
      const preguntas: string[] = [];
      if (preguntasBlock) {
        const lines = preguntasBlock[1].split('\n');
        for (const l of lines) {
          const cleanL = l.replace(/^[-*•\d.]+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
          if (cleanL.length > 5) preguntas.push(cleanL);
        }
      }

      // Secuencia didáctica
      const inicioMatch = rawContent.match(/(?:### 🚀 Sesiones 1 y 2|### Inicio)[\s\S]*?\n([\s\S]*?)(?=### 🔬|### Desarrollo|### Cierre|$)/);
      const desarrolloMatch = rawContent.match(/(?:### 🔬 Sesiones 3 a 7|### Desarrollo)[\s\S]*?\n([\s\S]*?)(?=### 🏁|### Cierre|## 📊|$)/);
      const cierreMatch = rawContent.match(/(?:### 🏁 Sesiones 8 a 10|### Cierre)[\s\S]*?\n([\s\S]*?)(?=## 📊|## 📦|$)/);
      const evalMatch = rawContent.match(/(?:## 📊 Rúbrica Analítica|### Evaluación Formativa)[\s\S]*?\n([\s\S]*?)(?=## 📦|## 🔗|$)/);
      const matMatch = rawContent.match(/(?:## 📦 Materiales, Recursos|### Materiales)[\s\S]*?\n([\s\S]*?)(?=## 🔗|$)/);

      // Fecha en letras
      const createdMatch = rawContent.match(/created_at:\s*"?(.*?)"?$/m) || rawContent.match(/fecha_creacion:\s*"?(.*?)"?$/m);
      const createdAt = formatSpanishDateInLetters(createdMatch ? createdMatch[1] : new Date());

      return NextResponse.json({
        found: true,
        source: 'obsidian',
        filename: bestMatch.filename,
        planning: {
          id: 'plan-obsidian-' + Date.now(),
          title,
          levelName,
          subjectName,
          campoFormativo,
          ejesArticuladores: ['Pensamiento Crítico', 'Apropiación de las Culturas a través de la Lectura y la Escritura'],
          pda,
          duration,
          preguntasDetonadoras: preguntas.length > 0 ? preguntas : [
            `¿Cómo aplicamos ${title} en situaciones de la vida real?`,
            `¿Qué implicaciones tiene este aprendizaje en nuestra comunidad?`
          ],
          inicio: inicioMatch ? inicioMatch[1].trim() : 'Actividades de inicio recuperadas desde Obsidian.',
          desarrollo: desarrolloMatch ? desarrolloMatch[1].trim() : 'Actividades de desarrollo recuperadas desde Obsidian.',
          cierre: cierreMatch ? cierreMatch[1].trim() : 'Actividades de cierre recuperadas desde Obsidian.',
          evaluacion: evalMatch ? evalMatch[1].trim() : 'Evaluación formativa recuperada desde Obsidian.',
          materiales: matMatch ? matMatch[1].trim() : 'Materiales registrados en nota de Obsidian.',
          createdAt,
          isFromObsidian: true
        }
      });
    }

    return NextResponse.json({ found: false, note: null });
  } catch (error: any) {
    console.error("Error al buscar en Obsidian:", error);
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validación de Sesión y Autenticación
    const auth = await validateApiAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'No autorizado. Se requiere sesión activa.' },
        { status: 401 }
      );
    }

    // 2. Sanitización y validación con Zod
    const body = await request.json().catch(() => null);
    const parsedPlanning = ObsidianPlanningSchema.safeParse(body);

    if (!parsedPlanning.success) {
      return NextResponse.json(
        { success: false, error: parsedPlanning.error.issues[0]?.message || 'Datos de planeación inválidos' },
        { status: 400 }
      );
    }

    const planning = parsedPlanning.data;

    if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
      return NextResponse.json({ success: false, error: 'Bóveda de Obsidian no encontrada' }, { status: 404 });
    }

    // Clasificación jerárquica: Nivel Escolar -> Grado/Fase -> Materia (con protección anti-traversal)
    const levelFolder = sanitizeFolderName(planning.levelName || planning.nivel || 'General');
    const gradeFolder = sanitizeFolderName(planning.gradeName || planning.grado || planning.fase || 'General');
    const subjectFolder = sanitizeFolderName(planning.subjectName || planning.asignatura || 'General');

    // Directorio de destino estructurado dentro del vault
    const targetDir = path.join(OBSIDIAN_VAULT_PATH, 'planeaciones', levelFolder, gradeFolder, subjectFolder);
    
    // Verificación de seguridad de ruta (evita Path Traversal)
    const resolvedPath = path.resolve(targetDir);
    if (!resolvedPath.startsWith(path.resolve(OBSIDIAN_VAULT_PATH))) {
      return NextResponse.json({ success: false, error: 'Ruta no permitida' }, { status: 403 });
    }

    fs.mkdirSync(targetDir, { recursive: true });

    const safeTitle = planning.title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().replace(/\s+/g, '_');
    const filename = `Planeacion_${safeTitle}_${Date.now()}.md`;
    const filePath = path.join(targetDir, filename);

    const formattedSpanishDate = formatSpanishDateInLetters(new Date());

    const tagLevel = levelFolder.toLowerCase();
    const tagGrade = gradeFolder.toLowerCase();
    const tagSubject = subjectFolder.toLowerCase();

    const markdownContent = `---
tags: [iskool, planeacion_nem, segundo_cerebro, nivel_${tagLevel}, grado_${tagGrade}, materia_${tagSubject}]
nivel: "${planning.levelName || ''}"
grado: "${planning.gradeName || planning.grado || ''}"
asignatura: "${planning.subjectName || ''}"
campo_formativo: "${planning.campoFormativo || ''}"
fecha_creacion: "${formattedSpanishDate}"
created_at: "${formattedSpanishDate}"
updated_at: "${formattedSpanishDate}"
---

# ${planning.title}

**Docente:** ${planning.teacherName || 'Prof. Israel López Ángeles'}  
**Nivel / Fase:** ${planning.levelName || ''}  
**Grado:** ${planning.gradeName || planning.grado || 'No especificado'}  
**Asignatura:** ${planning.subjectName || ''}  
**Campo Formativo:** ${planning.campoFormativo || ''}  
**Duración:** ${planning.duration || '2 sesiones de 50 minutos (Total: 100 min)'}  
**PDA:** ${planning.pda || ''}  
**Fecha:** ${formattedSpanishDate}

---

${planning.preguntasDetonadoras && planning.preguntasDetonadoras.length > 0 ? `## Preguntas Detonadoras para el Salón\n${planning.preguntasDetonadoras.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}\n\n---\n` : ''}
## Secuencia Didáctica (Dosificación por Bloques de 50 min)

### Inicio
${planning.inicio || ''}

### Desarrollo
${planning.desarrollo || ''}

### Cierre
${planning.cierre || ''}

---

### Evaluación Formativa y Rúbrica Analítica
${planning.evaluacion || ''}

### Materiales, Recursos y Evidencias Entregables
${planning.materiales || ''}
`;

    fs.writeFileSync(filePath, markdownContent, 'utf8');
    console.log(`✅ Planeación guardada en Obsidian estructurada por Nivel/Grado/Materia: ${filePath}`);

    // Sincronización Automática con Git (Commit & Push al repositorio remoto del Segundo Cerebro)
    let gitSyncStatus = 'skipped';
    let gitMessage = '';
    const isIsrael = (planning.teacherName || '').toLowerCase().includes('israel') || Boolean(planning.isSuperUser);

    if (planning.syncGit || isIsrael) {
      try {
        const safeCommitTitle = planning.title.replace(/["`$]/g, '').trim();
        const commitMsg = `feat(planeacion): ${safeCommitTitle} - ${planning.teacherName || 'Prof. Israel López Ángeles'} (Gemini NEM)`;
        
        await execPromise(`git -C "${OBSIDIAN_VAULT_PATH}" add -A`);
        await execPromise(`git -C "${OBSIDIAN_VAULT_PATH}" commit -m "${commitMsg}"`).catch((e) => {
          // Si no hay cambios nuevos para commitear, no es un error crítico
          console.log('Git commit notice:', e.message);
        });
        await execPromise(`git -C "${OBSIDIAN_VAULT_PATH}" push origin main`);
        gitSyncStatus = 'synced_and_pushed';
        gitMessage = 'Sincronizado y publicado en GitHub (Bóveda Obsidian)';
        console.log(`🚀 [Git Auto-Push]: Planeación "${planning.title}" sincronizada y enviada a GitHub.`);
      } catch (gitErr: any) {
        gitSyncStatus = 'local_only';
        gitMessage = `Guardado localmente. Git remoto: ${gitErr?.message || 'Pendiente de sincronizar'}`;
        console.warn('Aviso Git Obsidian:', gitErr?.message || gitErr);
      }
    }

    return NextResponse.json({
      success: true,
      filename,
      vaultPath: filePath,
      levelFolder,
      gradeFolder,
      subjectFolder,
      gitSyncStatus,
      gitMessage
    });
  } catch (error: any) {
    console.error("Error al guardar en Obsidian:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

