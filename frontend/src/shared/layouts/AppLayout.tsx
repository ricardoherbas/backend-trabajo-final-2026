import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  return (
    <div className="app">
      <div className="barra-movil">
        <span>Gestión de cuidados</span>
        <button type="button" aria-expanded={menuAbierto} onClick={() => setMenuAbierto((v) => !v)}>Menú</button>
      </div>
      <Sidebar abierto={menuAbierto} onNavegar={() => setMenuAbierto(false)} />
      <div className="contenido">
        <main className="pagina">
          <Suspense fallback={<div className="estado-vista" role="status">Cargando…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
