import { useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { etiquetaTurno } from '@/features/turnos/adapters/turno.adapter';
import { useAsignaciones, useEliminarAsignacion } from '../hooks/useAsignaciones';
import { useNombres } from '../hooks/useNombres';
import { etiquetaAsignacion } from '../adapters/asignacion.adapter';
import { AsignacionFormModal } from '../components/AsignacionFormModal';
import type { Asignacion } from '../interfaces/asignacion.interface';

export default function AsignacionesPage() {
  const { rol } = useAuth();
  const { data, isLoading, error } = useAsignaciones();
  const nombres = useNombres();
  const eliminar = useEliminarAsignacion();

  const puedeEditar = tieneRol(rol, ['administrador', 'secretaria']);
  const puedeEliminar = tieneRol(rol, ['administrador']);

  const [formulario, setFormulario] = useState<{ asignacion: Asignacion | null } | null>(null);
  const [aEliminar, setAEliminar] = useState<Asignacion | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

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
        titulo="Asignaciones"
        descripcion="Qué cuidadora atiende a qué paciente en cada turno."
        accion={puedeEditar ? <Button onClick={() => setFormulario({ asignacion: null })}>Nueva asignación</Button> : undefined}
      />
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={!!data && data.length === 0} textoVacio="Todavía no hay asignaciones.">
          <DataTable
            filas={data ?? []}
            clave={(a) => a.id}
            columnas={[
              { titulo: 'Paciente', render: (a) => nombres.paciente(a.paciente_id) },
              { titulo: 'Cuidadora', render: (a) => nombres.cuidadora(a.cuidador_id) },
              { titulo: 'Turno', render: (a) => (a.turno ? etiquetaTurno(a.turno) : `Turno #${a.turno_id}`) },
              { titulo: 'Estado', render: (a) => <Badge tono={a.activo ? 'ok' : 'neutro'}>{a.activo ? 'Activa' : 'Inactiva'}</Badge> },
            ]}
            acciones={
              puedeEditar
                ? (a) => (
                    <>
                      <Button variante="texto" chico onClick={() => setFormulario({ asignacion: a })}>Editar</Button>
                      {puedeEliminar && <Button variante="texto" chico onClick={() => setAEliminar(a)}>Eliminar</Button>}
                    </>
                  )
                : undefined
            }
          />
        </StateView>
      </div>

      {puedeEditar && (
        <AsignacionFormModal
          abierto={formulario !== null}
          asignacion={formulario?.asignacion ?? null}
          onCerrar={() => setFormulario(null)}
        />
      )}

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar asignación"
        mensaje={errorEliminar ?? `¿Eliminar la asignación ${aEliminar ? etiquetaAsignacion(aEliminar, nombres) : ''}? Esta acción no se puede deshacer.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
