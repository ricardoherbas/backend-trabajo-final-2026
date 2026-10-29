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

export interface UsuarioCreado {
  id: number;
  persona_id: number;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}
