import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { useAsignaciones } from '@/features/asignaciones/hooks/useAsignaciones';
import { useNombres } from '@/features/asignaciones/hooks/useNombres';
import { etiquetaAsignacion } from '@/features/asignaciones/adapters/asignacion.adapter';
import { ParteDiarioForm } from '../components/ParteDiarioForm';
import { useActualizarParteDiario, useCrearParteDiario, useParteDiario } from '../hooks/usePartesDiarios';
import { formularioAPayload, hoy, parteAFormulario } from '../adapters/parteDiario.adapter';

/** Una sola página para alta (/partes-diarios/nuevo) y edición (/partes-diarios/:id/editar). */
export default function ParteDiarioFormPage() {
  const { id } = useParams();
  const esEdicion = id !== undefined;
  const idNumero = Number(id);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const parte = useParteDiario(idNumero);
  const asignaciones = useAsignaciones();
  const nombres = useNombres();
  const crear = useCrearParteDiario();
  const actualizar = useActualizarParteDiario(idNumero);
  const mutacion = esEdicion ? actualizar : crear;

  // En un alta solo tiene sentido elegir asignaciones activas (al editar se conserva la actual).
  const opciones = (asignaciones.data ?? [])
    .filter((a) => a.activo || a.id === parte.data?.asignacion_id)
    .map((a) => ({ id: a.id, etiqueta: etiquetaAsignacion(a, nombres) }));

  const valoresIniciales = parte.data ? parteAFormulario(parte.data) : { fecha: hoy() };

  return (
    <>
      <PageHeader titulo={esEdicion ? 'Editar parte diario' : 'Nuevo parte diario'} />
      <div className="panel">
        {errorApi && <div className="aviso aviso-error" role="alert" style={{ marginBottom: '1rem' }}>{errorApi}</div>}
        {/* El form se monta recién cuando llegaron los datos (si no, los selects no se pre-cargan). */}
        <StateView
          cargando={asignaciones.isLoading || (esEdicion && parte.isLoading)}
          error={asignaciones.error ?? (esEdicion ? parte.error : undefined)}
        >
          <ParteDiarioForm
            asignaciones={opciones}
            valoresIniciales={valoresIniciales}
            enviando={mutacion.isPending}
            onEnviar={(valores) => {
              setErrorApi(null);
              mutacion.mutate(formularioAPayload(valores), {
                onSuccess: () => navigate('/partes-diarios'),
                onError: (e) => setErrorApi(obtenerMensajeError(e)),
              });
            }}
          />
        </StateView>
      </div>
    </>
  );
}
