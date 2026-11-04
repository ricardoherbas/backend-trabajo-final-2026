import type { Turno } from '@/features/turnos/interfaces/turno.interface';
import type { Persona } from '@/core/types/persona.interface';

/** El backend anida solo nombre y apellido (sin DNI, teléfono ni fecha de nacimiento). */
export type PersonaResumen = Pick<Persona, 'nombre' | 'apellido'>;

/** Paciente / cuidadora tal como vienen anidados en una asignación. */
export interface PacienteAsignado {
  id?: number;
  persona?: PersonaResumen | null;
}
export interface CuidadoraAsignada {
  id?: number;
  persona?: PersonaResumen | null;
}

export interface Asignacion {
  id: number;
  turno_id: number;
  cuidador_id: number; // el backend usa "cuidador_id"; el include se llama "cuidadora"
  paciente_id: number;
  activo: boolean;
  creado_en: string;
  turno?: Turno;
  cuidadora?: CuidadoraAsignada;
  paciente?: PacienteAsignado;
}
export interface DatosCrearAsignacion {
  turno_id: number;
  cuidador_id: number;
  paciente_id: number;
  activo?: boolean;
}
export type DatosActualizarAsignacion = Partial<DatosCrearAsignacion>;