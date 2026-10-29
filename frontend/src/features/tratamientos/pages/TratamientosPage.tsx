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
import { usePacienteOpciones } from '@/shared/hooks/usePacienteOpciones';
import { useEliminarTratamiento, useTratamientos } from '../hooks/useTratamientos';
import { textoVigencia } from '../adapters/tratamiento.adapter';
import type { Tratamiento } from '../interfaces/tratamiento.interface';

type FiltroEstado = 'todos' | 'activos' | 'finalizados';

export default function TratamientosPage() {
  const { rol } = useAuth();
  const puedeEditar = tieneRol(rol, ['administrador', 'secretaria']);
  const puedeEliminar = tieneRol(rol, ['administrador']);

  const { data, isLoading, error } = useTratamientos();
  const pacientes = usePacienteOpciones(); // la cuidadora no puede listar pacientes: cae a "Paciente #id"
  const eliminar = useEliminarTratamiento();

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<FiltroEstado>('todos');
  const [aEliminar, setAEliminar] = useState<Tratamiento | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (data ?? [])
      .filter((t) => (estado === 'todos' ? true : estado === 'activos' ? t.activa : !t.activa))
      .filter((t) =>
        !q ||
        pacientes.nombreDe(t.paciente_id).toLowerCase().includes(q) ||
        (t.medicamento?.nombre ?? '').toLowerCase().includes(q),
      )
      .sort((a, b) => pacientes.nombreDe(a.paciente_id).localeCompare(pacientes.nombreDe(b.paciente_id), 'es'));
  }, [data, busqueda, estado, pacientes.nombreDe]);

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
        titulo="Tratamientos"
        descripcion="Medicación indicada a cada paciente."
        accion={puedeEditar ? <Link className="btn btn-primario" to="/tratamientos/nuevo">Nuevo tratamiento</Link> : undefined}
      />
      <div className="panel">
        <div className="filtros">
          <div className="campo">
            <label htmlFor="buscar-trat">Buscar por paciente o medicamento</label>
            <input id="buscar-trat" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="estado-trat">Estado</label>
            <select id="estado-trat" value={estado} onChange={(e) => setEstado(e.target.value as FiltroEstado)}>
              <option value="todos">Todos</option>
              <option value="activos">En curso</option>
              <option value="finalizados">Finalizados</option>
            </select>
          </div>
        </div>
        <StateView cargando={isLoading} error={error} vacio={filtrados.length === 0} textoVacio="No hay tratamientos para mostrar con estos filtros.">
          <DataTable
            filas={filtrados}
            clave={(t) => t.id}
            columnas={[
              { titulo: 'Paciente', render: (t) => pacientes.nombreDe(t.paciente_id) },
              { titulo: 'Medicamento', render: (t) => t.medicamento ? `${t.medicamento.nombre} · ${t.medicamento.presentacion}` : `Medicamento #${t.medicamento_id}` },
              { titulo: 'Dosis', render: (t) => t.dosis },
              { titulo: 'Frecuencia', render: (t) => t.frecuencia },
              { titulo: 'Horario', render: (t) => t.horario ?? '—' },
              { titulo: 'Vigencia', render: textoVigencia },
              { titulo: 'Estado', render: (t) => <Badge tono={t.activa ? 'ok' : 'neutro'}>{t.activa ? 'En curso' : 'Finalizado'}</Badge> },
            ]}
            acciones={puedeEditar ? (t) => (
              <>
                <Link className="btn btn-texto btn-chico" to={`/tratamientos/${t.id}/editar`}>Editar</Link>
                {puedeEliminar && <Button variante="texto" chico onClick={() => setAEliminar(t)}>Eliminar</Button>}
              </>
            ) : undefined}
          />
        </StateView>
      </div>
      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar tratamiento"
        mensaje={errorEliminar ?? `¿Eliminar el tratamiento de ${aEliminar ? pacientes.nombreDe(aEliminar.paciente_id) : ''}? Esta acción no se puede deshacer. Si el tratamiento terminó, conviene marcarlo como finalizado.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
