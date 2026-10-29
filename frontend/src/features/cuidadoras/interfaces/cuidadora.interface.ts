import type { Persona } from '@/core/types/persona.interface';

export interface Cuidadora {
  id: number;
  persona_id: number;
  persona?: Persona;
}
export interface DatosCrearCuidadora { persona_id: number }
