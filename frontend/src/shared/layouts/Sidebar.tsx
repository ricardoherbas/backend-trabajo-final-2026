import { NavLink } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { ETIQUETA_ROL } from '@/core/permissions/roles';
import { rutasDelMenu } from '@/app/router/routes.config';
import { Button } from '@/shared/components/ui/Button';

/** Menú filtrado por rol, generado desde routes.config. */
export function Sidebar({ abierto, onNavegar }: { abierto: boolean; onNavegar: () => void }) {
  const { usuario, rol, cerrarSesion } = useAuth();
  return (
    <aside className={`lateral${abierto ? ' abierto' : ''}`}>
      <div className="marca">Gestión de cuidados</div>
      <nav aria-label="Principal">
        {rutasDelMenu(rol).map((r) => (
          <NavLink key={r.path} to={r.path} onClick={onNavegar} className={({ isActive }) => `enlace${isActive ? ' activo' : ''}`}>
            {r.etiqueta}
          </NavLink>
        ))}
      </nav>
      <div className="usuario">
        <small>{usuario?.email}<br />{rol && ETIQUETA_ROL[rol]}</small>
        <Button variante="secundario" onClick={cerrarSesion}>Cerrar sesión</Button>
      </div>
    </aside>
  );
}
