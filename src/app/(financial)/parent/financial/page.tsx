'use client';

/**
 * Portal Financiero del Padre — Estado de Cuenta y Cobranza (ISkool)
 * Cero Gamificación • Seguridad Bancaria • Fondos Claros • Estilo Corporativo
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Receipt, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Landmark, 
  User, 
  Calendar, 
  Building2, 
  Search,
  Filter,
  Check,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ChargeItem {
  id: string;
  invoiceNumber: string;
  concept: string;
  studentName: string;
  studentGrade: string;
  category: string;
  dueDate: string;
  subtotal: number;
  discount: number;
  surcharge: number;
  total: number;
  status: 'pending' | 'overdue' | 'paid';
}

interface PaymentRecord {
  id: string;
  receiptNumber: string;
  concept: string;
  studentName: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  cfdiUuid?: string;
  status: 'succeeded';
}

export default function ParentFinancialStatementPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'tax'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [taxFormSaved, setTaxFormSaved] = useState<boolean>(false);

  // Formulario Fiscal SAT
  const [taxData, setTaxData] = useState({
    rfc: 'LOAI840512AB3',
    taxName: 'ISRAEL LÓPEZ ÁNGELES',
    taxRegime: '605', // Sueldos y Salarios
    postalCode: '06700',
    cfdiUse: 'D10', // Colegiaturas
    billingEmail: 'israel.lopez@ejemplo.com'
  });

  // Datos estructurados de cargos pendientes
  const pendingCharges: ChargeItem[] = [
    {
      id: 'inv-001',
      invoiceNumber: 'COL-2026-00452',
      concept: 'Colegiatura de Septiembre 2026',
      studentName: 'Mateo López Mendoza',
      studentGrade: '3º de Secundaria — Grupo A',
      category: 'Colegiatura',
      dueDate: '10 de Septiembre de 2026',
      subtotal: 3600.00,
      discount: 150.00, // Descuento pronto pago
      surcharge: 0.00,
      total: 3450.00,
      status: 'pending'
    },
    {
      id: 'inv-002',
      invoiceNumber: 'COL-2026-00489',
      concept: 'Taller Extraescolar de Robótica y Programación (Mensual)',
      studentName: 'Mateo López Mendoza',
      studentGrade: '3º de Secundaria — Grupo A',
      category: 'Extraescolar',
      dueDate: '15 de Septiembre de 2026',
      subtotal: 800.00,
      discount: 0.00,
      surcharge: 0.00,
      total: 800.00,
      status: 'pending'
    }
  ];

  // Historial de pagos liquidados
  const paymentHistory: PaymentRecord[] = [
    {
      id: 'pay-001',
      receiptNumber: 'REC-2026-08102',
      concept: 'Inscripción Anual Ciclo 2026-2027',
      studentName: 'Mateo López Mendoza',
      amount: 4500.00,
      paymentMethod: 'Tarjeta de Crédito (Visa ***4012)',
      paidAt: '12 de Agosto de 2026, 11:24 hrs',
      cfdiUuid: '4A8B9C1D-2E3F-4A5B-6C7D-8E9F0A1B2C3D',
      status: 'succeeded'
    },
    {
      id: 'pay-002',
      receiptNumber: 'REC-2026-08103',
      concept: 'Paquete de Libros y Materiales Digitales',
      studentName: 'Mateo López Mendoza',
      amount: 2250.00,
      paymentMethod: 'Transferencia SPEI',
      paidAt: '12 de Agosto de 2026, 11:30 hrs',
      cfdiUuid: '9F8E7D6C-5B4A-3F2E-1D0C-B9A8F7E6D5C4',
      status: 'succeeded'
    },
    {
      id: 'pay-003',
      receiptNumber: 'REC-2026-07011',
      concept: 'Colegiatura de Agosto 2026 (Curso Propedéutico)',
      studentName: 'Mateo López Mendoza',
      amount: 3600.00,
      paymentMethod: 'Tarjeta de Débito (Mastercard ***8831)',
      paidAt: '05 de Agosto de 2026, 09:15 hrs',
      cfdiUuid: '1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D',
      status: 'succeeded'
    }
  ];

  const totalPending = pendingCharges.reduce((acc, c) => acc + c.total, 0);
  const totalPaid = paymentHistory.reduce((acc, p) => acc + p.amount, 0);

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Se ha generado y descargado su Estado de Cuenta Oficial en formato PDF.');
    }, 1200);
  };

  const handleSaveTaxForm = (e: React.FormEvent) => {
    e.preventDefault();
    setTaxFormSaved(true);
    setTimeout(() => setTaxFormSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado del Estado de Cuenta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Control de Cobranza Institucional</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Estado de Cuenta Escolar</h1>
          <p className="text-sm text-slate-500 mt-1">Consulte los cargos vigentes, realice pagos con tarjeta o SPEI y descargue sus comprobantes fiscales.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-300 transition-colors text-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{isExporting ? 'Generando PDF...' : 'Descargar Estado de Cuenta'}</span>
          </button>

          <Link
            href="/pay/magic/demo-token"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-xs shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pagar Saldo Pendiente</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Saldo Pendiente */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Saldo Total Pendiente</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">${totalPending.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-normal">MXN</span></div>
          <div className="text-xs text-amber-700 font-medium mt-1">2 cargos por vencer en septiembre</div>
        </div>

        {/* Próximo Vencimiento */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Próximo Vencimiento</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900">10 Septiembre 2026</div>
          <div className="text-xs text-slate-500 mt-1">Colegiatura Septiembre 2026</div>
        </div>

        {/* Total Pagado en el Ciclo */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pagado (Ciclo 2026-2027)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">${totalPaid.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-normal">MXN</span></div>
          <div className="text-xs text-emerald-700 font-medium mt-1">3 comprobantes emitidos</div>
        </div>

        {/* Facturación Electrónica */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Facturación SAT (CFDI)</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono truncate">{taxData.rfc}</div>
          <div className="text-xs text-slate-500 mt-1">Uso: D10 • Colegiaturas (Deducible)</div>
        </div>

      </div>

      {/* Pestañas Principales */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Barra de Pestañas */}
        <div className="border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Próximos Vencimientos</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingCharges.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Historial de Pagos y Recibos</span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {paymentHistory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tax')}
              className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'tax'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Datos Fiscales SAT (CFDI 4.0)</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO PESTAÑA 1: PRÓXIMOS VENCIMIENTOS */}
        {activeTab === 'pending' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold">Folio</th>
                    <th className="py-3 px-4 font-semibold">Concepto</th>
                    <th className="py-3 px-4 font-semibold">Alumno</th>
                    <th className="py-3 px-4 font-semibold">Fecha Límite</th>
                    <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
                    <th className="py-3 px-4 font-semibold text-right">Descuento</th>
                    <th className="py-3 px-4 font-semibold text-right">Total</th>
                    <th className="py-3 px-4 font-semibold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingCharges.map((charge) => (
                    <tr key={charge.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{charge.invoiceNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{charge.concept}</div>
                        <div className="text-[11px] text-slate-500">{charge.category}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{charge.studentName}</div>
                        <div className="text-[11px] text-slate-500">{charge.studentGrade}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{charge.dueDate}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">${charge.subtotal.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-medium">
                        {charge.discount > 0 ? `-$${charge.discount.toFixed(2)}` : '$0.00'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        ${charge.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/checkout/${charge.id}?ref=${encodeURIComponent(charge.invoiceNumber)}`}
                          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                        >
                          <span>Pagar</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ficha Resumen de Liquidación */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-600">
                  Los pagos realizados con Tarjeta Bancaria o SPEI se reflejan automáticamente en el sistema en menos de 60 segundos.
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-700 font-semibold text-sm">Total por Liquidar: <span className="text-slate-900 font-mono font-bold text-base">${totalPending.toFixed(2)} MXN</span></span>
                <Link
                  href="/checkout/all"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Pagar Todo el Saldo
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 2: HISTORIAL DE PAGOS */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold">Folio Recibo</th>
                    <th className="py-3 px-4 font-semibold">Fecha y Hora</th>
                    <th className="py-3 px-4 font-semibold">Concepto</th>
                    <th className="py-3 px-4 font-semibold">Método de Pago</th>
                    <th className="py-3 px-4 font-semibold text-right">Monto Liquidado</th>
                    <th className="py-3 px-4 font-semibold">Folio Fiscal SAT (UUID)</th>
                    <th className="py-3 px-4 font-semibold text-center">Comprobante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{payment.receiptNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600">{payment.paidAt}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{payment.concept}</td>
                      <td className="py-3.5 px-4 text-slate-600">{payment.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">${payment.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 max-w-[150px] truncate" title={payment.cfdiUuid}>
                        {payment.cfdiUuid || 'En proceso de timbrado'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => alert(`Descargando comprobante oficial ${payment.receiptNumber}...`)}
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA 3: PERFIL FISCAL SAT */}
        {activeTab === 'tax' && (
          <div className="p-6 max-w-3xl">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Datos Fiscales para Timbrado de Colegiaturas (CFDI 4.0)</h2>
              <p className="text-xs text-slate-500 mt-1">
                La información aquí registrada se utiliza automáticamente para emitir las facturas electrónicas deducibles de impuestos ante el SAT.
              </p>
            </div>

            {taxFormSaved && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Sus datos fiscales han sido actualizados exitosamente en el sistema de facturación.</span>
              </div>
            )}

            <form onSubmit={handleSaveTaxForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RFC (Persona Física o Moral)</label>
                  <input
                    type="text"
                    value={taxData.rfc}
                    onChange={(e) => setTaxData({ ...taxData, rfc: e.target.value.toUpperCase() })}
                    maxLength={13}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600 uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Código Postal Fiscal</label>
                  <input
                    type="text"
                    value={taxData.postalCode}
                    onChange={(e) => setTaxData({ ...taxData, postalCode: e.target.value })}
                    maxLength={5}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Razón Social / Nombre Completo Registrado en el SAT</label>
                <input
                  type="text"
                  value={taxData.taxName}
                  onChange={(e) => setTaxData({ ...taxData, taxName: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Régimen Fiscal SAT</label>
                  <select
                    value={taxData.taxRegime}
                    onChange={(e) => setTaxData({ ...taxData, taxRegime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados</option>
                    <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                    <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                    <option value="601">601 - General de Ley Personas Morales</option>
                    <option value="616">616 - Sin obligaciones fiscales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Uso de CFDI</label>
                  <select
                    value={taxData.cfdiUse}
                    onChange={(e) => setTaxData({ ...taxData, cfdiUse: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="D10">D10 - Pagos por servicios educativos (Colegiaturas)</option>
                    <option value="G03">G03 - Gastos en general</option>
                    <option value="S01">S01 - Sin efectos fiscales</option>
                    <option value="CP01">CP01 - Pagos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico de Recepción de Facturas</label>
                <input
                  type="email"
                  value={taxData.billingEmail}
                  onChange={(e) => setTaxData({ ...taxData, billingEmail: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Guardar Datos Fiscales
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
