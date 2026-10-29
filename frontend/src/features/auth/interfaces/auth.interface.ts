import type { Rol } from '@/core/permissions/roles';
import type { Persona } from '@/core/types/persona.interface';

export interface UsuarioSesion {
  id: number;
  persona_id: number;
  email: string;
  rol: Rol;
  activo: boolean;
}

export interface DatosLogin {
  email: string;
  password: string;
}

export interface RespuestaLogin {
  token: string;
  usuario: UsuarioSesion;
}

/** GET /auth/perfil: el usuario con su persona anidada */
export interface PerfilUsuario extends UsuarioSesion {
  creado_en: string;
  actualizado_en: string;
  persona: Persona;
}

/**
 * POST /auth/registro. El validador del backend exige además nombre,
 * apellido y dni (aunque el service solo usa código, email y password).
 */
export interface DatosRegistroFamiliar {
  codigo_vinculacion: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
  email: string;
  password: string;
}
