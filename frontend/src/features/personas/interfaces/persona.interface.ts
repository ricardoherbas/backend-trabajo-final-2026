import type { Persona } from '@/core/types/persona.interface';

/** Datos que acepta el backend en POST /personas y PUT /personas/:id. */
export interface DatosPersona {
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
}
export type DatosCrearPersona = DatosPersona;
export type DatosActualizarPersona = DatosPersona;

/** El backend responde { mensaje, persona }. */
export interface RespuestaPersona {
  mensaje: string;
  persona: Persona;
}