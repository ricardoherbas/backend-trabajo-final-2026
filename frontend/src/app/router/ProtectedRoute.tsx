import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import type { Rol } from '@/core/permissions/roles';

/** Guard: exige sesión y, si se indica, uno de los roles permitidos. */
export function ProtectedRoute({ roles }: { roles?: Rol[] }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <div className="estado-vista" role="status">Cargando…</div>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/sin-acceso" replace />;
  return <Outlet />;
}
