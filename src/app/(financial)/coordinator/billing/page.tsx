'use client';

/**
 * Dashboard de Cobranza del Coordinador — Analítica, Filtros y Recordatorios (ISkool)
 * Cero Gamificación • Seguridad Bancaria • Marca Blanca
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Send, 
  Copy, 
  MessageSquare, 
  Mail, 
  Download, 
  FileText, 
  Check, 
  ExternalLink,
  Users,
  ShieldCheck,
  ChevronDown,
  X,
  Zap,
  ArrowUpRight,
  Landmark
} from 'lucide-react';

interface FamilyBillingRecord {
  id: string;
  invoiceNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  level: string; // 'Primaria' | 'Secundaria' | 'Preparatoria'
  grade: string; // '1º', '2º', '3º', '4º'
  group: string; // 'A' | 'B'
  concept: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  autoInvoice: boolean;
  paidAt?: string;
}

export default function CoordinatorBillingDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Estado del modal de recordatorio Magic Link
  const [activeModalRecord, setActiveModalRecord] = useState<FamilyBillingRecord | null>(null);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [magicLinkResult, setMagicLinkResult] = useState<{
    paymentUrl: string;
    whatsAppMessage: string;
    emailSubject: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Datos estructurados de la matrícula institucional
  const [records, setRecords] = useState<FamilyBillingRecord[]>([
    {
      id: 'inv-101',
      invoiceNumber: 'COL-2026-00452',
      parentName: 'Israel López Ángeles',
      parentPhone: '5541982301',
      parentEmail: 'israel.lopez@ejemplo.com',
      studentName: 'Mateo López Mendoza',
      level: 'Secundaria',
      grade: '3º',
      group: 'A',
      concept: 'Colegiatura de Septiembre 2026',
      amount: 3450.00,
      dueDate: '10 Septiembre 2026',
      status: 'pending',
      autoInvoice: true
    },
    {
      id: 'inv-102',
      invoiceNumber: 'COL-2026-00453',
      parentName: 'Claudia Mendoza Ruiz',
      parentPhone: '5589123456',
      parentEmail: 'claudia.mendoza@ejemplo.com',
      studentName: 'Sofía Mendoza Ruiz',
      level: 'Primaria',
      grade: '1º',
      group: 'B',
      concept: 'Colegiatura de Septiembre 2026',
      amount: 3200.00,
      dueDate: '10 Septiembre 2026',
      status: 'pending',
      autoInvoice: false
    },
    {
      id: 'inv-103',
      invoiceNumber: 'COL-2026-00389',
      parentName: 'Roberto Garza Treviño',
      parentPhone: '5512349876',
      parentEmail: 'roberto.garza@ejemplo.com',
      studentName: 'Emiliano Garza Torres',
      level: 'Secundaria',
      grade: '2º',
      group: 'A',
      concept: 'Colegiatura de Agosto 2026 (Extemporánea)',
      amount: 3600.00,
      dueDate: '15 Agosto 2026',
      status: 'overdue',
      autoInvoice: true
    },
    {
      id: 'inv-104',
      invoiceNumber: 'COL-2026-00410',
      parentName: 'Mariana Valencia Soto',
      parentPhone: '5578901234',
      parentEmail: 'mariana.valencia@ejemplo.com',
      studentName: 'Valentina Soto Valencia',
      level: 'Preparatoria',
      grade: '1º',
      group: 'A',
      concept: 'Colegiatura de Septiembre 2026',
      amount: 3950.00,
      dueDate: '10 Septiembre 2026',
      status: 'paid',
      autoInvoice: true,
      paidAt: '24 Agosto 2026'
    },
    {
      id: 'inv-105',
      invoiceNumber: 'COL-2026-00411',
      parentName: 'Fernando Alatorre Cruz',
      parentPhone: '5534567890',
      parentEmail: 'fernando.alatorre@ejemplo.com',
      studentName: 'Santiago Alatorre Díaz',
      level: 'Primaria',
      grade: '4º',
      group: 'A',
      concept: 'Colegiatura de Septiembre 2026',
      amount: 3200.00,
      dueDate: '10 Septiembre 2026',
      status: 'paid',
      autoInvoice: true,
      paidAt: '22 Agosto 2026'
    },
    {
      id: 'inv-106',
      invoiceNumber: 'COL-2026-00392',
      parentName: 'Lucía Benítez Mora',
      parentPhone: '5567890123',
      parentEmail: 'lucia.benitez@ejemplo.com',
      studentName: 'Diego Benítez Morales',
      level: 'Secundaria',
      grade: '1º',
      group: 'B',
      concept: 'Cuota de Laboratorio y Robótica',
      amount: 1250.00,
      dueDate: '20 Agosto 2026',
      status: 'overdue',
      autoInvoice: false
    }
  ]);

  // KPIs de cobranza
  const totalTarget = 560000.00;
  const totalCollected = 485250.00;
  const collectionPercentage = ((totalCollected / totalTarget) * 100).toFixed(1);
  const overdueTotal = 32850.00;
  const delinquencyRate = 9.4;

  // Filtrado reactivo de registros
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchLevel = selectedLevel === 'all' || r.level === selectedLevel;
      const matchGrade = selectedGrade === 'all' || r.grade === selectedGrade;
      const matchGroup = selectedGroup === 'all' || r.group === selectedGroup;
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;

      return matchSearch && matchLevel && matchGrade && matchGroup && matchStatus;
    });
  }, [records, searchTerm, selectedLevel, selectedGrade, selectedGroup, selectedStatus]);

  const handleOpenReminderModal = async (record: FamilyBillingRecord) => {
    setActiveModalRecord(record);
    setIsSendingLink(true);
    setMagicLinkResult(null);

    try {
      const res = await fetch('/api/billing/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: record.id,
          parentName: record.parentName,
          studentName: record.studentName,
          concept: record.concept,
          invoiceNumber: record.invoiceNumber,
          amount: record.amount,
          dueDate: record.dueDate
        })
      });

      const json = await res.json();
      if (json.success) {
        setMagicLinkResult({
          paymentUrl: json.paymentUrl,
          whatsAppMessage: json.whatsAppMessage,
          emailSubject: json.emailSubject
        });
        showToast(`Recordatorio generado exitosamente para la familia ${record.parentName}.`);
      }
    } catch (e) {
      showToast(`Error al despachar el enlace: ${(e as any).message}`);
    } finally {
      setIsSendingLink(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCopyWhatsApp = () => {
    if (magicLinkResult?.whatsAppMessage) {
      navigator.clipboard.writeText(magicLinkResult.whatsAppMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
      showToast('Mensaje de WhatsApp copiado al portapapeles.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Formal de Notificación */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-5 py-3.5 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Landmark className="w-4 h-4" />
            <span>Coordinación Administrativa y Financiera</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Cobranza y Conciliación</h1>
          <p className="text-sm text-slate-500 mt-1">Supervisión en tiempo real de recaudación, morosidad y despacho de Magic Links institucionales.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/coordinator"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-300 transition-colors text-xs shadow-sm"
          >
            <span>Volver a Coordinación</span>
          </Link>

          <button
            onClick={() => alert('Generando informe ejecutivo consolidado en formato Excel / PDF...')}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-xs shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Conciliación</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales (3 KPIs Requeridos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Recaudación del Mes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recaudación del Mes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">${totalCollected.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Meta mensual: ${totalTarget.toLocaleString('es-MX')}</span>
              <span className="font-semibold text-emerald-700">{collectionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${collectionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Índice de Morosidad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Índice de Morosidad</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">{delinquencyRate}%</div>
          
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">↓ 2.3%</span>
            <span>Reducción respecto al mes anterior</span>
          </div>
        </div>

        {/* KPI 3: Total Vencido (Cartera Vencida) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Vencido</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-700 font-mono">${overdueTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          
          <div className="mt-3 text-xs text-slate-500">
            <span>9 cargos extemporáneos con acción de cobro activa</span>
          </div>
        </div>

      </div>

      {/* Data Table de Familias y Filtros de Cobranza */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Barra de Búsqueda y Filtros */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por alumno, tutor o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            
            {/* Filtro de Nivel */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              <option value="all">Todos los Niveles</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Preparatoria">Preparatoria</option>
            </select>

            {/* Filtro de Grado */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              <option value="all">Todos los Grados</option>
              <option value="1º">1º Grado</option>
              <option value="2º">2º Grado</option>
              <option value="3º">3º Grado</option>
              <option value="4º">4º Grado</option>
            </select>

            {/* Filtro de Grupo */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              <option value="all">Grupo A / B</option>
              <option value="A">Grupo A</option>
              <option value="B">Grupo B</option>
            </select>

            {/* Filtro de Estatus */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              <option value="all">Todos los Estatus</option>
              <option value="paid">Al Corriente (Pagado)</option>
              <option value="pending">Pendiente de Pago</option>
              <option value="overdue">Vencido (Mora)</option>
            </select>

          </div>
        </div>

        {/* Tabla de Cobranza */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4 font-semibold">Folio</th>
                <th className="py-3 px-4 font-semibold">Tutor / Familia</th>
                <th className="py-3 px-4 font-semibold">Alumno</th>
                <th className="py-3 px-4 font-semibold">Grado y Grupo</th>
                <th className="py-3 px-4 font-semibold">Concepto</th>
                <th className="py-3 px-4 font-semibold text-right">Monto</th>
                <th className="py-3 px-4 font-semibold">Fecha Límite</th>
                <th className="py-3 px-4 font-semibold text-center">Estatus</th>
                <th className="py-3 px-4 font-semibold text-center">Factura Auto</th>
                <th className="py-3 px-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{item.invoiceNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.parentName}</div>
                    <div className="text-[11px] text-slate-500">{item.parentPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{item.studentName}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                      {item.level} {item.grade} "{item.group}"
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-[180px] truncate" title={item.concept}>
                    {item.concept}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.dueDate}</td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'paid' ? (
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase">
                        Pagado
                      </span>
                    ) : item.status === 'overdue' ? (
                      <span className="bg-rose-100 text-rose-800 font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase">
                        Vencido
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.autoInvoice ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-semibold">
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span>Sí (CFDI)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Manual</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status !== 'paid' ? (
                      <button
                        onClick={() => handleOpenReminderModal(item)}
                        className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Enviar Recordatorio</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Conciliado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No se encontraron registros de cobranza con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Modal / Drawer de Despacho de Magic Link */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recordatorio de Cobro y Magic Link</h3>
                <p className="text-xs text-slate-500">Familia: {activeModalRecord.parentName} • Alumno: {activeModalRecord.studentName}</p>
              </div>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSendingLink ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-600 font-medium">Generando token criptográfico seguro de 48 horas...</p>
              </div>
            ) : magicLinkResult ? (
              <div className="space-y-4 text-xs">
                
                {/* Enlace Directo */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Enlace Seguro de Pago (Sin Contraseña):</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                    <input
                      type="text"
                      readOnly
                      value={magicLinkResult.paymentUrl}
                      className="w-full bg-transparent font-mono text-[11px] text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(magicLinkResult.paymentUrl);
                        showToast('Enlace copiado al portapapeles.');
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                {/* Vista Previa del Mensaje Institucional de WhatsApp */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mensaje Institucional Formateado (WhatsApp):</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Tono Oficial ISkool</span>
                  </div>
                  <textarea
                    rows={6}
                    readOnly
                    value={magicLinkResult.whatsAppMessage}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 text-[11px] font-sans leading-relaxed focus:outline-none"
                  />
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleCopyWhatsApp}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
                  </button>

                  <a
                    href={`https://wa.me/52${activeModalRecord.parentPhone}?text=${encodeURIComponent(magicLinkResult.whatsAppMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    <span>Abrir WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
}
