import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="acceso">
      <div className="panel acceso-caja">
        <div className="marca">Gestión de cuidados</div>
        <Suspense fallback={<div className="estado-vista" role="status">Cargando…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}
