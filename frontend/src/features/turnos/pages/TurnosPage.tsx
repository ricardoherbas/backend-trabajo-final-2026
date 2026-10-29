import { useMemo, useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { DIAS_SEMANA } from '@/core/types/dia-semana.type';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useEliminarTurno, useTurnos } from '../hooks/useTurnos';
import { etiquetaTurno, hhmm } from '../adapters/turno.adapter';
import { TurnoFormModal } from '../components/TurnoFormModal';
import type { Turno } from '../interfaces/turno.interface';

export default function TurnosPage() {
  const { rol } = useAuth();
  const { data, isLoading, error } = useTurnos();
  const eliminar = useEliminarTurno();

  // Permisos: el back deja crear/editar a admin y secretaria; eliminar solo a admin.
  const puedeEditar = tieneRol(rol, ['administrador', 'secretaria']);
  const puedeEliminar = tieneRol(rol, ['administrador']);

  // null = modal cerrado · { turno: null } = alta · { turno } = edición
  const [formulario, setFormulario] = useState<{ turno: Turno | null } | null>(null);
  const [aEliminar, setAEliminar] = useState<Turno | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const ordenados = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) =>
          DIAS_SEMANA.indexOf(a.dia_semana) - DIAS_SEMANA.indexOf(b.dia_semana) ||
          a.hora_inicio.localeCompare(b.hora_inicio),
      ),
    [data],
  );

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
        titulo="Turnos"
        descripcion="Franjas horarias de atención."
        accion={puedeEditar ? <Button onClick={() => setFormulario({ turno: null })}>Nuevo turno</Button> : undefined}
      />
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={ordenados.length === 0} textoVacio="Todavía no hay turnos cargados.">
          <DataTable
            filas={ordenados}
            clave={(t) => t.id}
            columnas={[
              { titulo: 'Día', render: (t) => t.dia_semana },
              { titulo: 'Desde', render: (t) => hhmm(t.hora_inicio) },
              { titulo: 'Hasta', render: (t) => hhmm(t.hora_fin) },
              { titulo: 'Estado', render: (t) => <Badge tono={t.activo ? 'ok' : 'neutro'}>{t.activo ? 'Activo' : 'Inactivo'}</Badge> },
            ]}
            acciones={
              puedeEditar
                ? (t) => (
                    <>
                      <Button variante="texto" chico onClick={() => setFormulario({ turno: t })}>Editar</Button>
                      {puedeEliminar && <Button variante="texto" chico onClick={() => setAEliminar(t)}>Eliminar</Button>}
                    </>
                  )
                : undefined
            }
          />
        </StateView>
      </div>

      {puedeEditar && (
        <TurnoFormModal abierto={formulario !== null} turno={formulario?.turno ?? null} onCerrar={() => setFormulario(null)} />
      )}

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar turno"
        mensaje={errorEliminar ?? `¿Eliminar el turno ${aEliminar ? etiquetaTurno(aEliminar) : ''}? Esta acción no se puede deshacer.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
