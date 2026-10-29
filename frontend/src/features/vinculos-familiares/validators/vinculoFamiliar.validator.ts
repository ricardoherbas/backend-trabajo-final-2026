import { z } from 'zod';

const idObligatorio = (mensaje: string) =>
  z.number({ error: mensaje }).int(mensaje).positive(mensaje);

export const vinculoSchema = z.object({
  familiar_id: idObligatorio('Elegí un familiar'),
  paciente_id: idObligatorio('Elegí un paciente'),
  parentesco: z.string().min(1, 'Ingresá el parentesco'),
  es_contacto_principal: z.boolean().optional(),
});
export type VinculoForm = z.infer<typeof vinculoSchema>;
