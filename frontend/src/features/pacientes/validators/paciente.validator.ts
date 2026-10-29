import { z } from 'zod';

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
