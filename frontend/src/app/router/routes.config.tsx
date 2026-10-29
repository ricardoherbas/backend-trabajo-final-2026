import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { Rol } from '@/core/permissions/roles';

/**
 * UNICA FUENTE de rutas y permisos del front.
 * Lo leen: el router, el ProtectedRoute y el Sidebar.
 * Los roles replican los verificarRol(...) de cada archivo de routes/ del backend.
 */
export interface RutaApp {
  path: string;
  etiqueta: string;
  roles: Rol[];
  /** true → aparece en el menú lateral */
  menu?: boolean;
  Componente: LazyExoticComponent<ComponentType>;
}

const TODOS: Rol[] = ['administrador', 'secretaria', 'cuidadora', 'familiar'];
const ADMIN: Rol[] = ['administrador'];
const ADMIN_SEC: Rol[] = ['administrador', 'secretaria'];
const ADMIN_SEC_CUID: Rol[] = ['administrador', 'secretaria', 'cuidadora'];

export const RUTAS_PUBLICAS = [
  { path: '/login', Componente: lazy(() => import('@/features/auth/pages/LoginPage')) },
  { path: '/registro', Componente: lazy(() => import('@/features/auth/pages/RegistroFamiliarPage')) },
  { path: '/recuperar-password', Componente: lazy(() => import('@/features/auth/pages/RecuperarPasswordPage')) },
  // El backend arma este link en el email de recuperación: /restablecer-password?token=...
  { path: '/restablecer-password', Componente: lazy(() => import('@/features/auth/pages/RestablecerPasswordPage')) },
];

export const RUTAS_PRIVADAS: RutaApp[] = [
  { path: '/usuarios', etiqueta: 'Usuarios', roles: ADMIN, menu: true, Componente: lazy(() => import('@/features/usuarios/pages/UsuariosPage')) },

  { path: '/pacientes', etiqueta: 'Pacientes', roles: ADMIN_SEC, menu: true, Componente: lazy(() => import('@/features/pacientes/pages/PacientesPage')) },
  { path: '/pacientes/nuevo', etiqueta: 'Nuevo paciente', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/pacientes/pages/PacienteFormPage')) },
  { path: '/pacientes/:id', etiqueta: 'Ficha del paciente', roles: TODOS, Componente: lazy(() => import('@/features/pacientes/pages/PacienteDetallePage')) },
  { path: '/pacientes/:id/editar', etiqueta: 'Editar paciente', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/pacientes/pages/PacienteFormPage')) },

  { path: '/familiares', etiqueta: 'Familiares', roles: ADMIN, menu: true, Componente: lazy(() => import('@/features/familiares/pages/FamiliaresPage')) },
  { path: '/vinculos-familiares', etiqueta: 'Vínculos y QR', roles: ADMIN_SEC, menu: true, Componente: lazy(() => import('@/features/vinculos-familiares/pages/VinculosPage')) },
  { path: '/cuidadoras', etiqueta: 'Cuidadoras', roles: ADMIN, menu: true, Componente: lazy(() => import('@/features/cuidadoras/pages/CuidadorasPage')) },
  { path: '/turnos', etiqueta: 'Turnos', roles: ADMIN_SEC_CUID, menu: true, Componente: lazy(() => import('@/features/turnos/pages/TurnosPage')) },
  { path: '/asignaciones', etiqueta: 'Asignaciones', roles: ADMIN_SEC_CUID, menu: true, Componente: lazy(() => import('@/features/asignaciones/pages/AsignacionesPage')) },
  { path: '/medicamentos', etiqueta: 'Medicamentos', roles: ADMIN_SEC_CUID, menu: true, Componente: lazy(() => import('@/features/medicamentos/pages/MedicamentosPage')) },

  { path: '/tratamientos', etiqueta: 'Tratamientos', roles: ADMIN_SEC_CUID, menu: true, Componente: lazy(() => import('@/features/tratamientos/pages/TratamientosPage')) },
  { path: '/tratamientos/nuevo', etiqueta: 'Nuevo tratamiento', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/tratamientos/pages/TratamientoFormPage')) },
  { path: '/tratamientos/:id/editar', etiqueta: 'Editar tratamiento', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/tratamientos/pages/TratamientoFormPage')) },

  { path: '/partes-diarios', etiqueta: 'Partes diarios', roles: ADMIN_SEC_CUID, menu: true, Componente: lazy(() => import('@/features/partes-diarios/pages/PartesDiariosPage')) },
  { path: '/partes-diarios/nuevo', etiqueta: 'Nuevo parte diario', roles: ADMIN_SEC_CUID, Componente: lazy(() => import('@/features/partes-diarios/pages/ParteDiarioFormPage')) },
  { path: '/partes-diarios/:id/editar', etiqueta: 'Editar parte diario', roles: ADMIN_SEC_CUID, Componente: lazy(() => import('@/features/partes-diarios/pages/ParteDiarioFormPage')) },

  { path: '/pagos', etiqueta: 'Pagos', roles: ADMIN_SEC, menu: true, Componente: lazy(() => import('@/features/pagos/pages/PagosPage')) },
  { path: '/pagos/nuevo', etiqueta: 'Nuevo pago', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/pagos/pages/PagoFormPage')) },
  { path: '/pagos/:id/editar', etiqueta: 'Editar pago', roles: ADMIN_SEC, Componente: lazy(() => import('@/features/pagos/pages/PagoFormPage')) },

  { path: '/perfil', etiqueta: 'Mi perfil', roles: TODOS, menu: true, Componente: lazy(() => import('@/features/perfil/pages/PerfilPage')) },
];

export const rutasDelMenu = (rol: Rol | null): RutaApp[] =>
  RUTAS_PRIVADAS.filter((r) => r.menu && rol && r.roles.includes(rol));

/** Primera pantalla del menú a la que puede entrar el rol. */
export const rutaInicial = (rol: Rol | null): string => rutasDelMenu(rol)[0]?.path ?? '/login';