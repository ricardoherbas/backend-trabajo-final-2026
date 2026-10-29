import { formatFecha } from '@/shared/utils/formatFecha';
import type { DatosCrearTratamiento, Tratamiento } from '../interfaces/tratamiento.interface';
import type { TratamientoForm } from '../validators/tratamiento.validator';

/** Formulario → payload del backend ('' → null). */
export const formularioAPayload = (f: TratamientoForm): DatosCrearTratamiento => ({
  paciente_id: f.paciente_id,
  medicamento_id: f.medicamento_id,
  dosis: f.dosis.trim(),
  frecuencia: f.frecuencia.trim(),
  horario: f.horario?.trim() || null,
  desde: f.desde || null,
  hasta: f.hasta || null,
  activa: f.activa ?? true,
});

export const tratamientoAFormulario = (t: Tratamiento): TratamientoForm => ({
  paciente_id: t.paciente_id,
  medicamento_id: t.medicamento_id,
  dosis: t.dosis,
  frecuencia: t.frecuencia,
  horario: t.horario ?? '',
  desde: t.desde?.slice(0, 10) ?? '',
  hasta: t.hasta?.slice(0, 10) ?? '',
  activa: t.activa,
});

export const textoVigencia = (t: Tratamiento): string => {
  if (!t.desde && !t.hasta) return '—';
  if (t.desde && !t.hasta) return `Desde ${formatFecha(t.desde)}`;
  if (!t.desde && t.hasta) return `Hasta ${formatFecha(t.hasta)}`;
  return `${formatFecha(t.desde)} a ${formatFecha(t.hasta)}`;
};
