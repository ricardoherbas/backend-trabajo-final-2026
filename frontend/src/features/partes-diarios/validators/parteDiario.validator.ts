import { z } from 'zod';

const texto = z.string().optional();

/** Replica validarParteDiario() del backend. */
export const parteDiarioSchema = z.object({
  asignacion_id: z.number({ error: 'Elegí una asignación' }).int('Elegí una asignación').positive('Elegí una asignación'),
  fecha: z.string().min(1, 'Ingresá la fecha'),
  animo: texto,
  alimentacion: texto,
  descanso: texto,
  higiene: texto,
  novedades: texto,
  observaciones: texto,
});

export type ParteDiarioForm = z.infer<typeof parteDiarioSchema>;
