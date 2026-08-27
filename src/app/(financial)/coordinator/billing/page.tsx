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
  Landmark,
  CreditCard,
  Receipt,
  DollarSign,
  RefreshCw,
  Printer,
  AlertCircle
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

  // Estado para el modal de Registro de Pago Manual (Caja / Ventanilla / Transferencia)
  const [manualPaymentRecord, setManualPaymentRecord] = useState<FamilyBillingRecord | null>(null);
  const [manualMethod, setManualMethod] = useState<'cash' | 'spei' | 'terminal_card' | 'check'>('cash');
  const [manualReference, setManualReference] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualAutoInvoice, setManualAutoInvoice] = useState<boolean>(true);
  const [manualNotes, setManualNotes] = useState<string>('');
  const [isProcessingManualPayment, setIsProcessingManualPayment] = useState<boolean>(false);

  // Estado para visualización de Recibo Oficial de Pago
  const [viewReceiptRecord, setViewReceiptRecord] = useState<{
    record: FamilyBillingRecord;
    receiptNumber: string;
    paidAt: string;
    paymentMethod: string;
    reference: string;
    notes?: string;
  } | null>(null);

  // KPIs dinámicos calculados en tiempo real basados en los registros activos
  const totalTarget = useMemo(() => records.reduce((acc, r) => acc + r.amount, 0), [records]);
  const totalCollected = useMemo(() => records.filter(r => r.status === 'paid').reduce((acc, r) => acc + r.amount, 0), [records]);
  const collectionPercentage = totalTarget > 0 ? ((totalCollected / totalTarget) * 100).toFixed(1) : '0.0';
  const overdueTotal = useMemo(() => records.filter(r => r.status === 'overdue').reduce((acc, r) => acc + r.amount, 0), [records]);
  const delinquencyRate = totalTarget > 0 ? ((overdueTotal / totalTarget) * 100).toFixed(1) : '0.0';

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

  // Apertura del modal de pago manual
  const handleOpenManualPayment = (record: FamilyBillingRecord) => {
    setManualPaymentRecord(record);
    setManualMethod('cash');
    setManualReference(`VOU-${Date.now().toString().slice(-6)}`);
    setManualAmount(record.amount);
    setManualDate(new Date().toISOString().split('T')[0]);
    setManualAutoInvoice(record.autoInvoice);
    setManualNotes('');
  };

  // Confirmar y aplicar el pago manual
  const handleConfirmManualPayment = () => {
    if (!manualPaymentRecord) return;
    setIsProcessingManualPayment(true);

    setTimeout(() => {
      const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const formattedDate = new Date(manualDate + 'T12:00:00').toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      // 1. Actualizar el registro a 'paid'
      setRecords(prev => prev.map(r => {
        if (r.id === manualPaymentRecord.id) {
          return {
            ...r,
            status: 'paid',
            paidAt: formattedDate,
            autoInvoice: manualAutoInvoice
          };
        }
        return r;
      }));

      setIsProcessingManualPayment(false);
      const paidRecord = { ...manualPaymentRecord, status: 'paid' as const, paidAt: formattedDate };
      setManualPaymentRecord(null);

      // 2. Abrir comprobante oficial
      setViewReceiptRecord({
        record: paidRecord,
        receiptNumber: receiptNum,
        paidAt: formattedDate,
        paymentMethod: 
          manualMethod === 'cash' ? 'Efectivo en Ventanilla' :
          manualMethod === 'spei' ? 'Transferencia Bancaria / SPEI' :
          manualMethod === 'terminal_card' ? 'Tarjeta en Terminal Física' : 'Cheque',
        reference: manualReference,
        notes: manualNotes
      });

      showToast(`Pago de $${manualAmount.toFixed(2)} registrado exitosamente. Folio: ${receiptNum}`);
    }, 600);
  };

  // Revertir pago a pendiente (para control de auditoría / corrección)
  const handleRevertPayment = (recordId: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'pending',
          paidAt: undefined
        };
      }
      return r;
    }));
    showToast('El estatus del cargo ha sido revertido a Pendiente.');
  };

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

  const handleExportConciliation = () => {
    const headers = ['Folio de Cargo', 'Familia / Tutor', 'Alumno', 'Grado / Grupo', 'Concepto', 'Monto (MXN)', 'Fecha de Vencimiento', 'Estatus', 'Fecha de Pago', 'Facturacion'];
    const rows = filteredRecords.map(r => [
      r.invoiceNumber,
      `"${r.parentName}"`,
      `"${r.studentName}"`,
      `"${r.grade} ${r.group}"`,
      `"${r.concept}"`,
      r.amount.toFixed(2),
      `"${r.dueDate}"`,
      r.status === 'paid' ? 'Pagado' : r.status === 'overdue' ? 'Vencido' : 'Pendiente',
      r.paidAt || 'N/A',
      r.autoInvoice ? 'CFDI 4.0' : 'Interno'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Conciliacion_Cobranza_CAM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Informe de conciliación exportado exitosamente en formato CSV.');
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

        <div className="flex items-center gap-2.5">
          <Link
            href="/coordinator/fiscal"
            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-3.5 py-2.5 rounded-lg border border-blue-200 transition-colors text-xs shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Facturación SAT CFDI 4.0</span>
          </Link>

          <Link
            href="/coordinator"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-300 transition-colors text-xs shadow-sm"
          >
            <span>Coordinación</span>
          </Link>

          <button
            onClick={handleExportConciliation}
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenManualPayment(item)}
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors shadow-sm"
                          title="Registrar pago recibido en efectivo, cheque o transferencia"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Cobrar en Caja</span>
                        </button>
                        <button
                          onClick={() => handleOpenReminderModal(item)}
                          className="inline-flex items-center gap-1 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors shadow-sm"
                          title="Enviar Magic Link para pago automático en línea"
                        >
                          <Send className="w-3 h-3" />
                          <span className="hidden sm:inline">Recordatorio</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewReceiptRecord({
                            record: item,
                            receiptNumber: `REC-${new Date().getFullYear()}-${item.id.replace('inv-', '00')}`,
                            paidAt: item.paidAt || '24 Agosto 2026',
                            paymentMethod: 'Conciliación Directa / Caja',
                            reference: item.invoiceNumber
                          })}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 font-semibold px-2.5 py-1 rounded-lg text-[11px] transition-colors border border-slate-200"
                          title="Ver o imprimir recibo oficial"
                        >
                          <Receipt className="w-3 h-3 text-emerald-600" />
                          <span>Recibo</span>
                        </button>
                        <button
                          onClick={() => handleRevertPayment(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Revertir pago a pendiente (Auditoría)"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
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
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recordatorio de Cobro y Magic Link</h3>
                  <p className="text-xs text-slate-500">Familia: {activeModalRecord.parentName} • Alumno: {activeModalRecord.studentName}</p>
                </div>
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
                    <a
                      href={magicLinkResult.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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

      {/* Modal de Registro de Pago Manual (Caja / Ventanilla) */}
      {manualPaymentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Registrar Pago Manual en Caja</h3>
                  <p className="text-xs text-slate-500">Conciliación directa de colegiatura o cuota</p>
                </div>
              </div>
              <button
                onClick={() => setManualPaymentRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ficha Resumen del Cargo */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Folio de Cargo:</span>
                <span className="font-mono font-bold text-slate-800">{manualPaymentRecord.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alumno:</span>
                <span className="font-bold text-slate-900">{manualPaymentRecord.studentName} ({manualPaymentRecord.grade} "{manualPaymentRecord.group}")</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tutor Responsable:</span>
                <span className="text-slate-800">{manualPaymentRecord.parentName}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-700">Monto del Adeudo:</span>
                <span className="font-mono font-black text-emerald-700">${manualPaymentRecord.amount.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Formulario de Conciliación Manual */}
            <div className="space-y-3.5 text-xs">
              
              {/* Selector de Método de Pago */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Método de Pago Recibido:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: 'Efectivo', desc: 'Ventanilla' },
                    { id: 'spei', label: 'SPEI / Transf.', desc: 'Bancarizado' },
                    { id: 'terminal_card', label: 'Tarjeta (TPV)', desc: 'Terminal física' },
                    { id: 'check', label: 'Cheque', desc: 'Institucional' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setManualMethod(m.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        manualMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs">{m.label}</div>
                      <div className="text-[9px] text-slate-400 font-normal">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Referencia o Folio de Voucher */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Folio / Voucher / Ref:</label>
                  <input
                    type="text"
                    value={manualReference}
                    onChange={(e) => setManualReference(e.target.value)}
                    placeholder="Ej. AUT-891230"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fecha de Cobro:</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Monto Cobrado */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monto Cobrado (MXN):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 pl-7 font-mono font-bold text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Facturación Fiscal SAT CFDI 4.0 */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <input
                  type="checkbox"
                  id="chkAutoInvoice"
                  checked={manualAutoInvoice}
                  onChange={(e) => setManualAutoInvoice(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chkAutoInvoice" className="text-[11px] text-slate-700">
                  <strong className="block text-blue-900 font-bold">Timbrado Fiscal Automático CFDI 4.0 (SAT)</strong>
                  Generar y enviar la factura electrónica al correo fiscal del tutor inmediatamente tras el cobro.
                </label>
              </div>

              {/* Notas de Caja */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observaciones / Notas Internas:</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Ej. Pago en ventanilla escolar entregado por la madre de familia"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

            </div>

            {/* Botones de Confirmación */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setManualPaymentRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmManualPayment}
                disabled={isProcessingManualPayment || manualAmount <= 0}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                {isProcessingManualPayment ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Conciliando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmar y Aplicar Pago</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Comprobante / Recibo Oficial de Pago */}
      {viewReceiptRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Encabezado del Recibo */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  CAM
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Colegio Anglo Mexicano</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Recibo Oficial de Pago • Control Escolar</p>
                </div>
              </div>
              <button
                onClick={() => setViewReceiptRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge de Estatus Conciliado */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-xs">Pago Conciliado & Acreditado</div>
                  <div className="text-[10px] text-emerald-600">Estatus: Al Corriente en Plataforma</div>
                </div>
              </div>
              <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-emerald-300 text-emerald-900">
                {viewReceiptRecord.receiptNumber}
              </span>
            </div>

            {/* Detalles del Recibo */}
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Alumno:</span>
                <span className="font-bold text-slate-900">{viewReceiptRecord.record.studentName} ({viewReceiptRecord.record.grade} "{viewReceiptRecord.record.group}")</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Tutor:</span>
                <span className="text-slate-800">{viewReceiptRecord.record.parentName}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Concepto:</span>
                <span className="font-medium text-slate-800">{viewReceiptRecord.record.concept}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Método de Pago:</span>
                <span className="font-semibold text-slate-800">{viewReceiptRecord.paymentMethod}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Fecha de Acreditación:</span>
                <span className="text-slate-800">{viewReceiptRecord.paidAt}</span>
              </div>
              <div className="p-3 flex justify-between bg-slate-50 rounded-b-xl text-sm">
                <span className="font-bold text-slate-800">Total Liquidado:</span>
                <span className="font-mono font-black text-emerald-700">${viewReceiptRecord.record.amount.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[10px] text-slate-400">
                CFDI 4.0: {viewReceiptRecord.record.autoInvoice ? 'Timbrado y enviado por correo' : 'Comprobante interno'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewReceiptRecord(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
