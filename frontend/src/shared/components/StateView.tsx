import type { ReactNode } from 'react';
import { obtenerMensajeError } from '@/core/api/errors';

interface Props {
  cargando?: boolean;
  error?: unknown;
  vacio?: boolean;
  textoVacio?: string;
  children: ReactNode;
}

/** Resuelve los tres estados comunes de una consulta: cargando, error y vacío. */
export function StateView({ cargando, error, vacio, textoVacio = 'Todavía no hay registros.', children }: Props) {
  if (cargando) return <div className="estado-vista" role="status">Cargando…</div>;
  if (error) {
    return (
      <div className="estado-vista">
        <strong>No se pudo cargar la información</strong>
        {obtenerMensajeError(error)}
      </div>
    );
  }
  if (vacio) return <div className="estado-vista"><strong>Sin resultados</strong>{textoVacio}</div>;
  return <>{children}</>;
}
