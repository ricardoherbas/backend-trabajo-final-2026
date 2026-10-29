import { useQuery } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import { ETIQUETA_ROL } from '@/core/permissions/roles';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { formatFecha } from '@/shared/utils/formatFecha';

export default function PerfilPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['perfil'], queryFn: authService.perfil });

  return (
    <>
      <PageHeader titulo="Mi perfil" />
      <div className="panel">
        <StateView cargando={isLoading} error={error}>
          {data && (
            <dl className="ficha">
              <div><dt>Nombre</dt><dd>{data.persona.nombre} {data.persona.apellido}</dd></div>
              <div><dt>Rol</dt><dd>{ETIQUETA_ROL[data.rol]}</dd></div>
              <div><dt>Email</dt><dd>{data.email}</dd></div>
              <div><dt>DNI</dt><dd>{data.persona.dni}</dd></div>
              <div><dt>Teléfono</dt><dd>{data.persona.telefono ?? '—'}</dd></div>
              <div><dt>Fecha de nacimiento</dt><dd>{formatFecha(data.persona.fecha_nacimiento)}</dd></div>
            </dl>
          )}
        </StateView>
      </div>
    </>
  );
}
