import type { Asignacion } from '@/features/asignaciones/interfaces/asignacion.interface';
import type { Persona } from '@/core/types/persona.interface';

/** el back anida solo nombre y apellido (sin DNI ni telefono). */
export type PersonaBasica = Pick<Persona, 'nombre' | 'apellido'>;

/** asignacion tal como viene dentro de un parte: paciente y cuidadora con persona anidada. */
export type AsignacionDeParte = Omit<Asignacion, 'paciente' | 'cuidadora'> & {
  paciente?: { id?: number; persona?: PersonaBasica | null };
  cuidadora?: { id?: number; persona?: PersonaBasica | null };
};

export interface ParteDiario {
  id: number;
  asignacion_id: number;
  fecha: string;
  animo: string | null;
  alimentacion: string | null;
  descanso: string | null;
  higiene: string | null;
  novedades: string | null;
  observaciones: string | null;
  creado_en: string;
  asignacion?: AsignacionDeParte;
}
export interface DatosCrearParteDiario {
  asignacion_id: number;
  fecha: string;
  animo?: string | null;
  alimentacion?: string | null;
  descanso?: string | null;
  higiene?: string | null;
  novedades?: string | null;
  observaciones?: string | null;
}
export type DatosActualizarParteDiario = Partial<DatosCrearParteDiario>;
