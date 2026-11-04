import type { Persona } from '@/core/types/persona.interface';
import type { RolUsuario } from '@/core/types/rol-usuario.type';

export interface DatosCrearUsuario {
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
  email: string;
  password: string;
  rol: RolUsuario;
}

/** PUT /usuarios/:id: todos los campos son opcionales; el password solo se manda si se completó. */
export type DatosActualizarUsuario = Partial<DatosCrearUsuario>;

export interface UsuarioCreado {
  id: number;
  persona_id: number;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}

/** Fila del listado (GET /usuarios): el usuario con su persona anidada, sin password. */
export interface Usuario extends UsuarioCreado {
  persona?: Persona;
}

/** Respuesta de PATCH /usuarios/:id/activar y /desactivar. */
export interface EstadoUsuario {
  id: number;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}