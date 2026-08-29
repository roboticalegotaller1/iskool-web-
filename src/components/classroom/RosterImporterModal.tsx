"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSchoolAdminStore } from '@/store/useSchoolAdminStore';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clipboard,
  Trash2
} from 'lucide-react';
import { ImportedStudentRow } from '@/types/classroom';

interface Props {
  onClose: () => void;
  onSuccess?: (count: number) => void;
}

export const RosterImporterModal: React.FC<Props> = ({
  onClose,
  onSuccess
}) => {
  const { detailedStudents, groupsList, addStudent } = useSchoolAdminStore();
  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<ImportedStudentRow[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  // Parsear texto copiado de Excel / CSV
  const handleParseText = () => {
    if (!rawText.trim()) return;

    const lines = rawText.trim().split(/\r?\n/);
    const rows: ImportedStudentRow[] = [];

    lines.forEach((line) => {
      // Separadores: Tabuladores (\t), comas (,) o punto y coma (;)
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else {
        parts = line.split(',');
      }

      const cleanParts = parts.map(p => p.trim());
      if (cleanParts.length >= 2) {
        const firstName = cleanParts[0] || '';
        const lastName = cleanParts[1] || '';
        const groupName = cleanParts[2] || '4º A - Primaria';
        const guardianEmail = cleanParts[3] || '';
        const guardianPhone = cleanParts[4] || '';

        // Ignorar encabezados comunes si vienen en la primera fila
        if (firstName.toLowerCase() === 'nombre' || firstName.toLowerCase() === 'first name') return;

        rows.push({
          firstName,
          lastName,
          groupName,
          guardianEmail,
          guardianPhone
        });
      }
    });

    setParsedRows(rows);
    setIsParsed(true);
  };

  const handleApplyImport = () => {
    if (parsedRows.length === 0) return;

    let importedCount = 0;
    parsedRows.forEach((row, idx) => {
      const matchedGroup = groupsList.find(g => 
        g.name.toLowerCase().includes(row.groupName.toLowerCase()) || 
        g.id.toLowerCase().includes(row.groupName.toLowerCase())
      );

      const targetGroupId = matchedGroup?.id || groupsList[0]?.id || 'grp-4a';
      const fullName = `${row.firstName} ${row.lastName}`.trim();

      addStudent({
        id: `std-imp-${Date.now()}-${idx}`,
        name: fullName,
        firstName: row.firstName,
        lastName: row.lastName,
        email: `${row.firstName.toLowerCase().replace(/\s+/g, '')}@escuela.edu.mx`,
        groupId: targetGroupId,
        groupName: matchedGroup?.name || row.groupName,
        curp: `CURP${Date.now()}${idx}`,
        guardianName: 'Tutor Responsable',
        guardianEmail: row.guardianEmail || 'tutor@familia.com',
        guardianPhone: row.guardianPhone || '55-1234-5678',
        attendancePercentage: 100,
        gradeAverage: 9.5,
        conductStatus: 'excelente',
        notes: 'Estudiante importado mediante el Módulo de Aula Digital.',
        avatarConfig: {
          style: 'adventurer',
          seed: fullName,
          background: 'indigo'
        }
      });
      importedCount++;
    });

    if (onSuccess) onSuccess(importedCount);
    onClose();
  };

  // Cargar ejemplo de prueba
  const handleLoadExample = () => {
    const example = `Mateo	Morales González	4º A - Primaria	padre.mateo@gmail.com	5511223344
Sofía	Reyes Martínez	4º A - Primaria	madre.sofia@gmail.com	5522334455
Lucas	Hernández Silva	4º A - Primaria	lucas.tutor@gmail.com	5533445566
Valentina	Castro Mendoza	4º A - Primaria	vale.familia@gmail.com	5544556677
Diego	Navarro Peña	4º A - Primaria	tutor.diego@gmail.com	5555667788`;
    setRawText(example);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-scale-in my-auto flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                Gestión de Listas
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Importador Universal de Alumnos (Excel / CSV)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {!isParsed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Copia y pega la tabla de tus alumnos desde Excel o CSV:
                </label>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Pegar Lista de Ejemplo
                </button>
              </div>

              <textarea
                rows={8}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Nombre [Tab] Apellidos [Tab] Grupo [Tab] Correo Tutor [Tab] Teléfono&#10;Mateo	Morales	4º A - Primaria	tutor@gmail.com	5512345678"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={handleParseText}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    rawText.trim()
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Clipboard className="w-4 h-4" />
                  <span>Analizar y Previsualizar Columnas</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Se detectaron <strong className="text-cyan-600">{parsedRows.length} alumnos</strong> listos para importar:
                </div>
                <button
                  type="button"
                  onClick={() => setIsParsed(false)}
                  className="text-xs font-bold text-slate-500 hover:underline"
                >
                  Modificar texto
                </button>
              </div>

              {/* Tabla de Previsualización */}
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-zinc-800 text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Nombre Completo</th>
                      <th className="p-3">Grupo Asignado</th>
                      <th className="p-3">Contacto Tutor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-850">
                        <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800 dark:text-zinc-200">
                          {row.firstName} {row.lastName}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-zinc-400">{row.groupName}</td>
                        <td className="p-3 text-slate-500 dark:text-zinc-400">{row.guardianEmail || 'N/D'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Al importar, se generarán sus avatares iniciales y saldo de bienvenida automáticamente.</span>
              </div>
            </div>
          )}

        </div>

        {/* Pie */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
          >
            Cancelar
          </button>
          {isParsed && (
            <button
              type="button"
              onClick={handleApplyImport}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Importar {parsedRows.length} Alumnos</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
