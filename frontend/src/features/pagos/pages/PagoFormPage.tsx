import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { usePacienteOpciones } from '@/shared/hooks/usePacienteOpciones';
import { PagoForm } from '../components/PagoForm';
import { useGuardarPago, usePago } from '../hooks/usePagos';
import { formularioAPayload, pagoAFormulario } from '../adapters/pago.adapter';

/** Alta (/pagos/nuevo) y edición (/pagos/:id/editar) en una sola página. */
export default function PagoFormPage() {
  const { id } = useParams();
  const idNumero = id === undefined ? undefined : Number(id);
  const esEdicion = idNumero !== undefined;
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const pacientes = usePacienteOpciones();
  const pago = usePago(idNumero);
  const guardar = useGuardarPago();

  return (
    <>
      <PageHeader titulo={esEdicion ? 'Editar pago' : 'Nuevo pago'} />
      <div className="panel">
        {errorApi && <div className="aviso aviso-error" role="alert" style={{ marginBottom: '1rem' }}>{errorApi}</div>}
        <StateView cargando={pacientes.cargando || (esEdicion && pago.isLoading)} error={pacientes.error ?? (esEdicion ? pago.error : null)}>
          <PagoForm
            enviando={guardar.isPending}
            pacientes={pacientes.opciones}
            valoresIniciales={pago.data ? pagoAFormulario(pago.data) : undefined}
            onEnviar={(valores) => {
              setErrorApi(null);
              guardar.mutate(
                { id: idNumero, datos: formularioAPayload(valores) },
                { onSuccess: () => navigate('/pagos'), onError: (e) => setErrorApi(obtenerMensajeError(e)) },
              );
            }}
          />
        </StateView>
      </div>
    </>
  );
}
