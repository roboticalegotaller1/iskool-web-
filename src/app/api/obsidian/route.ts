import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OBSIDIAN_VAULT_PATH = 'C:\\Users\\kami-\\Desktop\\2025-2026\\iskool\\obsidean\\brain\\iskool';

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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const levelParam = searchParams.get('level') || '';
    const gradeParam = searchParams.get('grade') || '';
    const subjectParam = searchParams.get('subject') || '';
    
    if (!query || !fs.existsSync(OBSIDIAN_VAULT_PATH)) {
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
    const planning = await request.json();
    if (!planning || !planning.title) {
      return NextResponse.json({ success: false, error: 'Datos de planeación inválidos' }, { status: 400 });
    }

    if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
      return NextResponse.json({ success: false, error: 'Bóveda de Obsidian no encontrada' }, { status: 404 });
    }

    // Clasificación jerárquica: Nivel Escolar -> Grado/Fase -> Materia
    const levelFolder = sanitizeFolderName(planning.levelName || planning.nivel || 'General');
    const gradeFolder = sanitizeFolderName(planning.gradeName || planning.grado || planning.fase || 'General');
    const subjectFolder = sanitizeFolderName(planning.subjectName || planning.asignatura || 'General');

    // Directorio de destino estructurado
    const targetDir = path.join(OBSIDIAN_VAULT_PATH, 'planeaciones', levelFolder, gradeFolder, subjectFolder);
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

