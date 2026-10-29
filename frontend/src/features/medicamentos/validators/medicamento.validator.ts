import { z } from 'zod';

export const medicamentoSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá el nombre del medicamento'),
  presentacion: z.string().trim().min(1, 'Ingresá la presentación'),
  cantidad: z
    .number({ error: 'Ingresá la cantidad' })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0'),
});
export type MedicamentoForm = z.infer<typeof medicamentoSchema>;
