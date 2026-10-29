import type { DatosCrearTurno, Turno } from '../interfaces/turno.interface';
import type { TurnoForm } from '../validators/turno.validator';

/** El back devuelve 'HH:MM:SS'; para mostrar y para <input type="time"> alcanza con 'HH:MM'. */
export const hhmm = (hora: string): string => hora.slice(0, 5);

/** Texto corto para tablas y selects: "lunes 08:00–16:00". */
export const etiquetaTurno = (t: Turno): string =>
  `${t.dia_semana} ${hhmm(t.hora_inicio)}–${hhmm(t.hora_fin)}`;

export const turnoAFormulario = (t: Turno): TurnoForm => ({
  dia_semana: t.dia_semana,
  hora_inicio: hhmm(t.hora_inicio),
  hora_fin: hhmm(t.hora_fin),
  activo: t.activo,
});

/** El back exige todos los campos también al actualizar, así que se manda siempre el objeto completo. */
export const formularioAPayload = (f: TurnoForm): DatosCrearTurno => ({ ...f });
