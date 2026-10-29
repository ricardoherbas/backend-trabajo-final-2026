import type { RolUsuario } from '@/core/types/rol-usuario.type';

export type Rol = RolUsuario;

export const ETIQUETA_ROL: Record<Rol, string> = {
  administrador: 'Administrador',
  secretaria: 'Secretaria',
  cuidadora: 'Cuidadora',
  familiar: 'Familiar',
};

export const tieneRol = (rol: Rol | null, permitidos: Rol[]): boolean =>
  rol !== null && permitidos.includes(rol);
