import { useQuery } from '@tanstack/react-query';
import { PageHeader } from './PageHeader';
import { StateView } from './StateView';
import { DataTable, type Columna } from './DataTable';

interface Props<T extends { id: number }> {
  titulo: string;
  descripcion?: string;
  claveQuery: string;
  cargar: () => Promise<T[]>;
  columnas: Columna<T>[];
}

/**
 * Listado genérico de solo lectura. Es el punto de partida de los módulos
 * que todavía no tienen alta/edición: se reemplaza por una página propia
 * cuando el módulo se completa.
 */
export function ListadoSoloLectura<T extends { id: number }>({ titulo, descripcion, claveQuery, cargar, columnas }: Props<T>) {
  const { data, isLoading, error } = useQuery({ queryKey: [claveQuery], queryFn: cargar });
  return (
    <>
      <PageHeader titulo={titulo} descripcion={descripcion} />
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={!!data && data.length === 0}>
          <DataTable columnas={columnas} filas={data ?? []} clave={(f) => f.id} />
        </StateView>
      </div>
    </>
  );
}
