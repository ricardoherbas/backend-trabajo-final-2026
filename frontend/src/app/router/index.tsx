import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { AppLayout } from '@/shared/layouts/AppLayout';
import { useAuth } from '@/core/auth/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { RUTAS_PRIVADAS, RUTAS_PUBLICAS, rutaInicial } from './routes.config';

function Inicio() {
  const { rol } = useAuth();
  return <Navigate to={rutaInicial(rol)} replace />;
}

function SinAcceso() {
  return (
    <div className="estado-vista">
      <strong>No tenés acceso a esta pantalla</strong>
      Tu rol no tiene permisos para ver esta sección.
    </div>
  );
}

function NoEncontrada() {
  return (
    <div className="estado-vista">
      <strong>Pantalla no encontrada</strong>
      Revisá la dirección o volvé al inicio.
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: RUTAS_PUBLICAS.map(({ path, Componente }) => ({ path, element: <Componente /> })),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Inicio /> },
          { path: '/sin-acceso', element: <SinAcceso /> },
          // Cada ruta se envuelve con su propio guard de roles (una sola fuente: routes.config)
          ...RUTAS_PRIVADAS.map(({ path, roles, Componente }) => ({
            path,
            element: <ProtectedRoute roles={roles} />,
            children: [{ index: true, element: <Componente /> }],
          })),
          { path: '*', element: <NoEncontrada /> },
        ],
      },
    ],
  },
]);
