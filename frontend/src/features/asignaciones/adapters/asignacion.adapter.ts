import { etiquetaTurno } from '@/features/turnos/adapters/turno.adapter';
import type { Asignacion, DatosCrearAsignacion } from '../interfaces/asignacion.interface';
import type { AsignacionForm } from '../validators/asignacion.validator';

/** Funciones que traducen un id a un nombre (ver hooks/useNombres.ts). */
export interface Nombres {
  paciente: (id: number) => string;
  cuidadora: (id: number) => string;
}

/** "María Pérez · Ana Gómez · lunes 08:00–16:00". Se usa en tablas y en el select de partes diarios. */
export const etiquetaAsignacion = (a: Asignacion, nombres: Nombres): string =>
  [
    nombres.paciente(a.paciente_id),
    nombres.cuidadora(a.cuidador_id),
    a.turno ? etiquetaTurno(a.turno) : `Turno #${a.turno_id}`,
  ].join(' · ');

export const asignacionAFormulario = (a: Asignacion): AsignacionForm => ({
  turno_id: a.turno_id,
  cuidador_id: a.cuidador_id,
  paciente_id: a.paciente_id,
  activo: a.activo,
});

export const formularioAPayload = (f: AsignacionForm): DatosCrearAsignacion => ({ ...f });
