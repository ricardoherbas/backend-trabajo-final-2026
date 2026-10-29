import { z } from 'zod';

export const MEDIOS_PAGO = ['efectivo', 'tarjeta', 'transferencia', 'qr', 'obra_social'] as const;
export const ESTADOS_PAGO = ['pendiente', 'pagado', 'vencido'] as const;

export const pagoSchema = z.object({
  paciente_id: z.number({ error: 'Elegí un paciente' }).int().positive('Elegí un paciente'),
  periodo: z.string().min(1, 'Elegí el mes del período'),
  monto: z.number({ error: 'Ingresá el monto' }).min(0, 'El monto no puede ser negativo'),
  estado: z.enum(ESTADOS_PAGO),
  medio_pago: z.enum(MEDIOS_PAGO).or(z.literal('')).optional(),
  fecha_pago: z.string().optional(),
  observaciones: z.string().optional(),
});
export type PagoForm = z.infer<typeof pagoSchema>;

/** Registrar un cobro: medio y fecha son obligatorios. */
export const cobroSchema = z.object({
  medio_pago: z.enum(MEDIOS_PAGO, { error: 'Elegí cómo se pagó' }),
  fecha_pago: z.string().min(1, 'Ingresá la fecha de pago'),
});
export type CobroForm = z.infer<typeof cobroSchema>;
