import type { Persona } from '@/core/types/persona.interface';

export interface Familiar {
  id: number;
  persona_id: number;
  persona?: Persona;
}
export interface DatosCrearFamiliar { persona_id: number }
