import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { validateApiAuth } from '@/lib/authValidator';

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
  inicio: z.string().trim().max(5000).optional(),
  desarrollo: z.string().trim().max(5000).optional(),
  cierre: z.string().trim().max(5000).optional(),
  evaluacion: z.string().trim().max(5000).optional(),
  materiales: z.string().trim().max(5000).optional()
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

    if (bestMatch && bestMatch.score >= Math.max(1, Math.floor(queryWords.length * 0.3))) {
      const titleMatch = bestMatch.content.match(/# (.*)/);
      const campoMatch = bestMatch.content.match(/\*\*Campo Formativo:\*\* (.*)/);
      const pdaMatch = bestMatch.content.match(/\*\*PDA:\*\* (.*)/);
      const levelMatch = bestMatch.content.match(/\*\*Nivel \/ Fase:\*\* (.*)/);
      const subjectMatch = bestMatch.content.match(/\*\*Asignatura:\*\* (.*)/);
      const inicioMatch = bestMatch.content.match(/### Inicio\n([\s\S]*?)(?=### Desarrollo|### Cierre|$)/);
      const desarrolloMatch = bestMatch.content.match(/### Desarrollo\n([\s\S]*?)(?=### Cierre|### Evaluacion|$)/);
      const cierreMatch = bestMatch.content.match(/### Cierre\n([\s\S]*?)(?=### Evaluacion|### Materiales|$)/);
      const evalMatch = bestMatch.content.match(/### Evaluación Formativa\n([\s\S]*?)(?=### Materiales|$)/);
      const matMatch = bestMatch.content.match(/### Materiales\n([\s\S]*?)$/);

      return NextResponse.json({
        found: true,
        source: 'obsidian',
        filename: bestMatch.filename,
        planning: {
          id: 'plan-obsidian-' + Date.now(),
          title: titleMatch ? titleMatch[1].trim() : bestMatch.filename.replace('.md', ''),
          levelName: levelMatch ? levelMatch[1].trim() : '',
          subjectName: subjectMatch ? subjectMatch[1].trim() : '',
          campoFormativo: campoMatch ? campoMatch[1].trim() : 'Saberes y Pensamiento Científico',
          ejesArticuladores: ['Pensamiento Crítico', 'Apropiación de las Culturas'],
          pda: pdaMatch ? pdaMatch[1].trim() : query,
          duration: '4 horas lectivas',
          inicio: inicioMatch ? inicioMatch[1].trim() : 'Actividades de inicio recuperadas desde Obsidian.',
          desarrollo: desarrolloMatch ? desarrolloMatch[1].trim() : 'Actividades de desarrollo recuperadas desde Obsidian.',
          cierre: cierreMatch ? cierreMatch[1].trim() : 'Actividades de cierre recuperadas desde Obsidian.',
          evaluacion: evalMatch ? evalMatch[1].trim() : 'Evaluación formativa recuperada desde Obsidian.',
          materiales: matMatch ? matMatch[1].trim() : 'Materiales registrados en nota de Obsidian.',
          createdAt: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
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

    const timestamp = new Date().toISOString();

    const tagLevel = levelFolder.toLowerCase();
    const tagGrade = gradeFolder.toLowerCase();
    const tagSubject = subjectFolder.toLowerCase();

    const markdownContent = `---
tags: [iskool, planeacion_nem, segundo_cerebro, nivel_${tagLevel}, grado_${tagGrade}, materia_${tagSubject}]
nivel: "${planning.levelName || ''}"
grado: "${planning.gradeName || planning.grado || ''}"
asignatura: "${planning.subjectName || ''}"
campo_formativo: "${planning.campoFormativo || ''}"
fecha_creacion: "${timestamp}"
---

# ${planning.title}

**Docente:** ${planning.teacherName || 'Prof. Israel López'}  
**Nivel / Fase:** ${planning.levelName || ''}  
**Grado:** ${planning.gradeName || planning.grado || 'No especificado'}  
**Asignatura:** ${planning.subjectName || ''}  
**Campo Formativo:** ${planning.campoFormativo || ''}  
**Duración:** ${planning.duration || '4 horas'}  
**PDA:** ${planning.pda || ''}  

---

## Secuencia Didáctica NEM

### Inicio
${planning.inicio || ''}

### Desarrollo
${planning.desarrollo || ''}

### Cierre
${planning.cierre || ''}

---

### Evaluación Formativa
${planning.evaluacion || ''}

### Materiales
${planning.materiales || ''}
`;

    fs.writeFileSync(filePath, markdownContent, 'utf8');
    console.log(`✅ Planeación guardada en Obsidian estructurada por Nivel/Grado/Materia: ${filePath}`);

    return NextResponse.json({
      success: true,
      filename,
      vaultPath: filePath,
      levelFolder,
      gradeFolder,
      subjectFolder
    });
  } catch (error: any) {
    console.error("Error al guardar en Obsidian:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

