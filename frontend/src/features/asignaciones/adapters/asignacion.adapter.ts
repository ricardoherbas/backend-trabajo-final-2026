import { etiquetaTurno } from '@/features/turnos/adapters/turno.adapter';
import type { Asignacion, DatosCrearAsignacion, PersonaResumen } from '../interfaces/asignacion.interface';
import type { AsignacionForm } from '../validators/asignacion.validator';

/** Funciones que traducen un id a un nombre (ver hooks/useNombres.ts). */
export interface Nombres {
  /** Usa la persona anidada si viene; si no, busca por ID; si no, "Paciente #id". */
  paciente: (id: number, persona?: PersonaResumen | null) => string;
  cuidadora: (id: number, persona?: PersonaResumen | null) => string;
}

/** "Apellido, Nombre" o null si la persona no vino anidada. */
export const nombrePersona = (persona?: PersonaResumen | null): string | null =>
  persona ? `${persona.apellido}, ${persona.nombre}` : null;

/** "María Pérez · Ana Gómez · lunes 08:00–16:00". Se usa en tablas y en el select de partes diarios. */
export const etiquetaAsignacion = (a: Asignacion, nombres: Nombres): string =>
  [
    nombres.paciente(a.paciente_id, a.paciente?.persona),
    nombres.cuidadora(a.cuidador_id, a.cuidadora?.persona),
    a.turno ? etiquetaTurno(a.turno) : `Turno #${a.turno_id}`,
  ].join(' · ');

export const asignacionAFormulario = (a: Asignacion): AsignacionForm => ({
  turno_id: a.turno_id,
  cuidador_id: a.cuidador_id,
  paciente_id: a.paciente_id,
  activo: a.activo,
});

export const formularioAPayload = (f: AsignacionForm): DatosCrearAsignacion => ({ ...f });