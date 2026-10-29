import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { formatFecha } from '@/shared/utils/formatFecha';
import { useNombres } from '@/features/asignaciones/hooks/useNombres';
import { useEliminarParteDiario, usePartesDiarios } from '../hooks/usePartesDiarios';
import type { ParteDiario } from '../interfaces/parteDiario.interface';

export default function PartesDiariosPage() {
  const { rol } = useAuth();
  const { data, isLoading, error } = usePartesDiarios();
  const nombres = useNombres();
  const eliminar = useEliminarParteDiario();
  const [aEliminar, setAEliminar] = useState<ParteDiario | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // Los más recientes primero (las fechas 'YYYY-MM-DD' se ordenan bien como texto).
  const ordenados = useMemo(() => [...(data ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha)), [data]);

  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setErrorEliminar(null);
    eliminar.mutate(aEliminar.id, {
      onSuccess: () => setAEliminar(null),
      onError: (e) => setErrorEliminar(obtenerMensajeError(e)),
    });
  };

  return (
    <>
      <PageHeader
        titulo="Partes diarios"
        descripcion="Registro diario de cada paciente."
        accion={<Link className="btn btn-primario" to="/partes-diarios/nuevo">Nuevo parte</Link>}
      />
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={ordenados.length === 0} textoVacio="Todavía no hay partes diarios.">
          <DataTable
            filas={ordenados}
            clave={(p) => p.id}
            columnas={[
              { titulo: 'Fecha', render: (p) => formatFecha(p.fecha) },
              { titulo: 'Paciente', render: (p) => (p.asignacion ? nombres.paciente(p.asignacion.paciente_id) : `Asignación #${p.asignacion_id}`) },
              { titulo: 'Cuidadora', render: (p) => (p.asignacion ? nombres.cuidadora(p.asignacion.cuidador_id) : '—') },
              { titulo: 'Ánimo', render: (p) => p.animo ?? '—' },
              { titulo: 'Novedades', render: (p) => p.novedades ?? '—' },
            ]}
            acciones={(p) => (
              <>
                <Link className="btn btn-texto btn-chico" to={`/partes-diarios/${p.id}/editar`}>Editar</Link>
                {tieneRol(rol, ['administrador']) && <Button variante="texto" chico onClick={() => setAEliminar(p)}>Eliminar</Button>}
              </>
            )}
          />
        </StateView>
      </div>

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar parte diario"
        mensaje={errorEliminar ?? `¿Eliminar el parte del ${aEliminar ? formatFecha(aEliminar.fecha) : ''}? Esta acción no se puede deshacer.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
