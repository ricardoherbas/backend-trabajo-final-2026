import { z } from 'zod';

export const tratamientoSchema = z
  .object({
    paciente_id: z.number({ error: 'Elegí un paciente' }).int().positive('Elegí un paciente'),
    medicamento_id: z.number({ error: 'Elegí un medicamento' }).int().positive('Elegí un medicamento'),
    dosis: z.string().trim().min(1, 'Ingresá la dosis'),
    frecuencia: z.string().trim().min(1, 'Ingresá la frecuencia'),
    horario: z.string().optional(),
    desde: z.string().optional(),
    hasta: z.string().optional(),
    activa: z.boolean().optional(),
  })
  .refine((d) => !d.desde || !d.hasta || d.hasta >= d.desde, {
    path: ['hasta'],
    message: 'La fecha hasta no puede ser anterior a desde',
  });
export type TratamientoForm = z.infer<typeof tratamientoSchema>;
