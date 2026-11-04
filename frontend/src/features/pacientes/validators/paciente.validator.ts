import { z } from 'zod';
import { personaSchema } from '@/features/personas/validators/persona.validator';

export const pacienteSchema = z.object({
  persona_id: z
    .number({ error: 'Ingresá el ID de la persona' })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0'),
  direccion: z.string().optional(),
  obra_social: z.string().optional(),
  observaciones: z.string().optional(),
  activo: z.boolean().optional(),
});
export type PacienteForm = z.infer<typeof pacienteSchema>;

/** Alta: datos de la persona + datos del paciente (el persona_id lo resuelve el alta en dos pasos). */
export const pacienteAltaSchema = personaSchema.extend({
  direccion: z.string().optional(),
  obra_social: z.string().optional(),
  observaciones: z.string().optional(),
});
export type PacienteAltaForm = z.infer<typeof pacienteAltaSchema>;