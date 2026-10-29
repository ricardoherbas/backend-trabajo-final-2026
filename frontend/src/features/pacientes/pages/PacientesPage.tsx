import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { usePacientes, useEliminarPaciente } from '../hooks/usePacientes';
import { nombreCompleto } from '../adapters/paciente.adapter';
import type { Paciente } from '../interfaces/paciente.interface';

export default function PacientesPage() {
  const { rol } = useAuth();
  const { data, isLoading, error } = usePacientes();
  const eliminar = useEliminarPaciente();
  const [busqueda, setBusqueda] = useState('');
  const [aEliminar, setAEliminar] = useState<Paciente | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(
      (p) => nombreCompleto(p).toLowerCase().includes(q) || p.persona?.dni.includes(q),
    );
  }, [data, busqueda]);

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
        titulo="Pacientes"
        descripcion="Fichas de las personas que reciben cuidados."
        accion={<Link className="btn btn-primario" to="/pacientes/nuevo">Nuevo paciente</Link>}
      />
      <div className="panel">
        <div className="campo" style={{ maxWidth: 320, marginBottom: '1rem' }}>
          <label htmlFor="buscar">Buscar por nombre o DNI</label>
          <input id="buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <StateView cargando={isLoading} error={error} vacio={filtrados.length === 0} textoVacio="No hay pacientes para mostrar.">
          <DataTable
            filas={filtrados}
            clave={(p) => p.id}
            columnas={[
              { titulo: 'Paciente', render: nombreCompleto },
              { titulo: 'DNI', render: (p) => p.persona?.dni ?? '—' },
              { titulo: 'Obra social', render: (p) => p.obra_social ?? '—' },
              { titulo: 'Estado', render: (p) => <Badge tono={p.activo ? 'ok' : 'neutro'}>{p.activo ? 'Activo' : 'Inactivo'}</Badge> },
            ]}
            acciones={(p) => (
              <>
                <Link className="btn btn-texto btn-chico" to={`/pacientes/${p.id}`}>Ver ficha</Link>
                <Link className="btn btn-texto btn-chico" to={`/pacientes/${p.id}/editar`}>Editar</Link>
                {tieneRol(rol, ['administrador']) && (
                  <Button variante="texto" chico onClick={() => setAEliminar(p)}>Eliminar</Button>
                )}
              </>
            )}
          />
        </StateView>
      </div>
      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={errorEliminar ?? `¿Eliminar a ${aEliminar ? nombreCompleto(aEliminar) : ''}? Esta acción no se puede deshacer.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
