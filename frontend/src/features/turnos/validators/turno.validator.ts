import { z } from 'zod';
import { DIAS_SEMANA } from '@/core/types/dia-semana.type';

const HORA = /^\d{2}:\d{2}(:\d{2})?$/;

/** Replica validarTurno() del backend. */
export const turnoSchema = z
  .object({
    dia_semana: z.enum(DIAS_SEMANA, { error: 'Elegí un día de la semana' }),
    hora_inicio: z.string().regex(HORA, 'Ingresá la hora de inicio'),
    hora_fin: z.string().regex(HORA, 'Ingresá la hora de fin'),
    activo: z.boolean(),
  })
  // Regla entre dos campos: el back responde 400 si hora_fin <= hora_inicio.
  .refine((t) => t.hora_fin > t.hora_inicio, {
    error: 'La hora de fin debe ser posterior a la de inicio',
    path: ['hora_fin'],
  });

export type TurnoForm = z.infer<typeof turnoSchema>;
