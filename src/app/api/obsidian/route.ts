import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OBSIDIAN_VAULT_PATH = 'C:\\Users\\kami-\\Desktop\\2025-2026\\iskool\\obsidean\\brain\\iskool';

function cleanString(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query || !fs.existsSync(OBSIDIAN_VAULT_PATH)) {
      return NextResponse.json({ found: false, note: null });
    }

    const cleanQuery = cleanString(query);
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 3);

    const planningsDir = path.join(OBSIDIAN_VAULT_PATH, 'planeaciones');
    if (!fs.existsSync(planningsDir)) {
      return NextResponse.json({ found: false, note: null });
    }

    const files = fs.readdirSync(planningsDir);
    let bestMatch: { filename: string; content: string; score: number } | null = null;

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const filePath = path.join(planningsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanContent = cleanString(content);

      let score = 0;
      queryWords.forEach(word => {
        if (cleanContent.includes(word)) score += 1;
      });

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { filename: file, content, score };
      }
    }

    if (bestMatch && bestMatch.score >= Math.max(1, Math.floor(queryWords.length * 0.4))) {
      const titleMatch = bestMatch.content.match(/# (.*)/);
      const campoMatch = bestMatch.content.match(/\*\*Campo Formativo:\*\* (.*)/);
      const pdaMatch = bestMatch.content.match(/\*\*PDA:\*\* (.*)/);
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

    const planningsDir = path.join(OBSIDIAN_VAULT_PATH, 'planeaciones');
    fs.mkdirSync(planningsDir, { recursive: true });

    const safeTitle = planning.title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().replace(/\s+/g, '_');
    const filename = `Planeacion_${safeTitle}_${Date.now()}.md`;
    const filePath = path.join(planningsDir, filename);

    const timestamp = new Date().toISOString();
    const markdownContent = `---
tags: [iskool, planeacion_nem, segundo_cerebro]
asignatura: "${planning.subjectName || ''}"
nivel: "${planning.levelName || ''}"
campo_formativo: "${planning.campoFormativo || ''}"
fecha_creacion: "${timestamp}"
---

# ${planning.title}

**Docente:** ${planning.teacherName || 'Prof. Israel López'}  
**Nivel / Fase:** ${planning.levelName || ''}  
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
    console.log(`✅ Planeación guardada en Obsidian: ${filePath}`);

    return NextResponse.json({
      success: true,
      filename,
      vaultPath: filePath
    });
  } catch (error: any) {
    console.error("Error al guardar en Obsidian:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
