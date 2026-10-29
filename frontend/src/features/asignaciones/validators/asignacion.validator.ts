import { z } from 'zod';

const idObligatorio = (mensaje: string) =>
  z.number({ error: mensaje }).int(mensaje).positive(mensaje);

/** Replica validarAsignacion() del backend. */
export const asignacionSchema = z.object({
  turno_id: idObligatorio('Elegí un turno'),
  cuidador_id: idObligatorio('Elegí una cuidadora'), // el back usa "cuidador_id"
  paciente_id: idObligatorio('Elegí un paciente'),
  activo: z.boolean(),
});

export type AsignacionForm = z.infer<typeof asignacionSchema>;
