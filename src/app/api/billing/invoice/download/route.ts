import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const receiptId = req.nextUrl.searchParams.get('receipt_id') || 'REC-2026-08102';
  const format = req.nextUrl.searchParams.get('format') || 'xml'; // 'xml' | 'pdf'
  const uuid = req.nextUrl.searchParams.get('uuid') || '4A8B9C1D-2E3F-4A5B-6C7D-8E9F0A1B2C3D';
  const rfcReceptor = req.nextUrl.searchParams.get('rfc') || 'LOAI840512AB3';
  const amount = req.nextUrl.searchParams.get('amount') || '4500.00';
  const concept = req.nextUrl.searchParams.get('concept') || 'Inscripción Anual Ciclo 2026-2027';

  if (format === 'xml') {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Serie="F" Folio="${receiptId}" Fecha="${new Date().toISOString()}" Sello="SIMULATED_SAT_DIGITAL_SEAL_OFICIAL_MEXICO" FormaPago="04" NoCertificado="30001000000500003416" SubTotal="${amount}" Moneda="MXN" Total="${amount}" TipoDeComprobante="I" Exportacion="01" MetodoPago="PUE" LugarExpedicion="06700">
  <cfdi:Emisor Rfc="ISK180312AB9" Nombre="COLEGIO ISKOOL MEXICO" RegimenFiscal="603"/>
  <cfdi:Receptor Rfc="${rfcReceptor}" Nombre="ISRAEL LOPEZ ANGELES" DomicilioFiscalReceptor="06700" RegimenFiscalReceptor="605" UsoCFDI="D10"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="86121500" NoIdentificacion="${receiptId}" Cantidad="1" ClaveUnidad="E48" Unidad="Servicio" Descripcion="${concept}" ValorUnitario="${amount}" Importe="${amount}" ObjetoImp="01"/>
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd" Version="1.1" UUID="${uuid}" FechaTimbrado="${new Date().toISOString()}" RfcProvCertif="SAT970701NN3" SelloCFD="SIMULATED_CFD_SEAL" NoCertificadoSAT="00001000000504465028" SelloSAT="SIMULATED_SAT_STAMP"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="CFDI_4_0_${receiptId}_${uuid.slice(0, 8)}.xml"`
      }
    });
  }

  // Si es PDF, devolvemos respuesta exitosa con metadatos para descarga
  return NextResponse.json({
    success: true,
    message: `Factura oficial ${receiptId} en formato PDF lista para descarga.`,
    receiptNumber: receiptId,
    uuid: uuid,
    downloadUrl: `/api/billing/invoice/download?receipt_id=${receiptId}&format=xml&uuid=${uuid}`
  });
}
