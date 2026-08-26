/**
 * Servicio Criptográfico de Enlaces Mágicos de Cobranza (MagicLinkService)
 * Genera y valida tokens seguros con expiración para pago directo sin fricción ni contraseñas.
 * Cero Gamificación • Seguridad Bancaria • Cifrado SHA-256 + HMAC
 */

import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';
import { MagicLink, Invoice } from '@/types';

export interface CreateMagicLinkOptions {
  invoiceId: string;
  parentId: string;
  schoolId: string;
  hoursValid?: number; // Default: 48 horas
  metadata?: Record<string, any>;
}

export interface MagicLinkValidationResult {
  isValid: boolean;
  errorCode?: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'ALREADY_USED' | 'INVOICE_NOT_FOUND' | 'ALREADY_PAID';
  errorMessage?: string;
  magicLink?: MagicLink;
  invoice?: Invoice;
  temporaryPaymentToken?: string;
}

export class MagicLinkService {
  private static instance: MagicLinkService;
  private readonly secretKey: string = process.env.PAYMENT_GATEWAY_SECRET || 'iskool_secure_financial_key_2026';
  private readonly appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://iskool.edu.mx';

  private constructor() {}

  public static getInstance(): MagicLinkService {
    if (!MagicLinkService.instance) {
      MagicLinkService.instance = new MagicLinkService();
    }
    return MagicLinkService.instance;
  }

  /**
   * Genera un token criptográfico seguro de 32 bytes y lo persiste hasheado (SHA-256) en la base de datos
   */
  public async createMagicLink(options: CreateMagicLinkOptions): Promise<{
    rawToken: string;
    tokenHash: string;
    expiresAt: string;
    paymentUrl: string;
  }> {
    const hours = options.hoursValid && options.hoursValid > 0 ? options.hoursValid : 48;
    
    // Generar 32 bytes de entropía criptográfica (256 bits)
    const rawToken = crypto.randomBytes(32).toString('hex');
    
    // Hash unidireccional SHA-256 para almacenamiento seguro
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    const paymentUrl = `${this.appUrl}/pay/magic/${rawToken}`;

    // Persistencia en Supabase
    const { error } = await supabase
      .from('magic_links')
      .insert({
        token_hash: tokenHash,
        school_id: options.schoolId,
        parent_id: options.parentId,
        invoice_id: options.invoiceId,
        expires_at: expiresAt,
        is_used: false,
        metadata: options.metadata || {}
      });

    if (error) {
      // Si la base de datos en modo local o mock no está conectada, registramos el log de auditoría
      console.warn('[MagicLinkService] Registro en base de datos local:', error.message);
    }

    return {
      rawToken,
      tokenHash,
      expiresAt,
      paymentUrl
    };
  }

  /**
   * Valida un token entrante verificando hash, caducidad, estatus de uso y estado del cargo
   */
  public async validateToken(
    rawToken: string, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<MagicLinkValidationResult> {
    if (!rawToken || typeof rawToken !== 'string' || rawToken.length < 32) {
      return {
        isValid: false,
        errorCode: 'INVALID_TOKEN',
        errorMessage: 'El enlace de pago es inválido o no posee el formato de seguridad requerido.'
      };
    }

    // Calcular el hash SHA-256 del token provisto
    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');

    // Consultar el registro en la base de datos
    const { data: linkData, error } = await supabase
      .from('magic_links')
      .select('*, invoice:invoices(*)')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (error || !linkData) {
      return {
        isValid: false,
        errorCode: 'INVALID_TOKEN',
        errorMessage: 'El enlace de pago no fue encontrado en el registro institucional o ha sido revocado.'
      };
    }

    // 1. Verificación de uso previo
    if (linkData.is_used) {
      return {
        isValid: false,
        errorCode: 'ALREADY_USED',
        errorMessage: 'Este enlace de acceso seguro ya fue utilizado con anterioridad para realizar el pago.'
      };
    }

    // 2. Verificación de vigencia temporal
    const now = new Date();
    const expiresAt = new Date(linkData.expires_at);
    if (now > expiresAt) {
      return {
        isValid: false,
        errorCode: 'EXPIRED_TOKEN',
        errorMessage: 'El enlace de pago ha expirado por motivos de seguridad bancaria. Solicite uno nuevo a la administración escolar.'
      };
    }

    // 3. Verificación del estado del cargo
    const invoice = linkData.invoice as Invoice | undefined;
    if (invoice && invoice.status === 'paid') {
      return {
        isValid: false,
        errorCode: 'ALREADY_PAID',
        errorMessage: 'El cargo asociado a este enlace ya se encuentra completamente liquidado.',
        invoice
      };
    }

    // Generar un token temporal HMAC de sesión firmado para el checkout seguro
    const sessionPayload = `${linkData.invoice_id}:${linkData.parent_id}:${Date.now()}`;
    const temporaryPaymentToken = crypto
      .createHmac('sha256', this.secretKey)
      .update(sessionPayload)
      .digest('hex');

    return {
      isValid: true,
      magicLink: linkData as MagicLink,
      invoice,
      temporaryPaymentToken
    };
  }

  /**
   * Marca el Magic Link como consumido tras la inicialización del pago
   */
  public async markTokenAsUsed(tokenHash: string, ipAddress?: string, userAgent?: string): Promise<boolean> {
    const { error } = await supabase
      .from('magic_links')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        ip_address: ipAddress || null,
        user_agent: userAgent || null
      })
      .eq('token_hash', tokenHash);

    return !error;
  }
}

export const magicLinkService = MagicLinkService.getInstance();
