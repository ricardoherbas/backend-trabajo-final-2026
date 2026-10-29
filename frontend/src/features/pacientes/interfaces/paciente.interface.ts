import type { Persona } from '@/core/types/persona.interface';

export interface Paciente {
  id: number;
  persona_id: number;
  direccion: string | null;
  obra_social: string | null;
  observaciones: string | null;
  activo: boolean;
  creado_en: string;
  persona?: Persona;
}

export interface DatosCrearPaciente {
  persona_id: number;
  direccion?: string | null;
  obra_social?: string | null;
  observaciones?: string | null;
}

/** El validador del backend exige persona_id también al actualizar. */
export interface DatosActualizarPaciente extends DatosCrearPaciente {
  activo?: boolean;
}
