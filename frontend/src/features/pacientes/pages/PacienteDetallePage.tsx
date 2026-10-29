import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { Badge } from '@/shared/components/ui/Badge';
import { formatFecha } from '@/shared/utils/formatFecha';
import { usePaciente } from '../hooks/usePacientes';
import { nombreCompleto } from '../adapters/paciente.adapter';

export default function PacienteDetallePage() {
  const { id } = useParams();
  const { rol } = useAuth();
  const { data, isLoading, error } = usePaciente(Number(id));
  const puedeEditar = tieneRol(rol, ['administrador', 'secretaria']);

  return (
    <>
      <PageHeader
        titulo={data ? nombreCompleto(data) : 'Ficha del paciente'}
        accion={puedeEditar && data ? <Link className="btn btn-secundario" to={`/pacientes/${data.id}/editar`}>Editar</Link> : undefined}
      />
      <div className="panel">
        <StateView cargando={isLoading} error={error}>
          {data && (
            <dl className="ficha">
              <div><dt>DNI</dt><dd>{data.persona?.dni ?? '—'}</dd></div>
              <div><dt>Fecha de nacimiento</dt><dd>{formatFecha(data.persona?.fecha_nacimiento)}</dd></div>
              <div><dt>Teléfono</dt><dd>{data.persona?.telefono ?? '—'}</dd></div>
              <div><dt>Dirección</dt><dd>{data.direccion ?? '—'}</dd></div>
              <div><dt>Obra social</dt><dd>{data.obra_social ?? '—'}</dd></div>
              <div><dt>Estado</dt><dd><Badge tono={data.activo ? 'ok' : 'neutro'}>{data.activo ? 'Activo' : 'Inactivo'}</Badge></dd></div>
              <div style={{ gridColumn: '1 / -1' }}><dt>Observaciones</dt><dd>{data.observaciones ?? '—'}</dd></div>
            </dl>
          )}
        </StateView>
      </div>
    </>
  );
}
