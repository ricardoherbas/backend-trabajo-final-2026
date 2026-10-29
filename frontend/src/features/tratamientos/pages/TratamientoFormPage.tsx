import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { usePacienteOpciones } from '@/shared/hooks/usePacienteOpciones';
import { useMedicamentos } from '@/features/medicamentos/hooks/useMedicamentos';
import { TratamientoForm } from '../components/TratamientoForm';
import { useGuardarTratamiento, useTratamiento } from '../hooks/useTratamientos';
import { formularioAPayload, tratamientoAFormulario } from '../adapters/tratamiento.adapter';

/** Alta (/tratamientos/nuevo) y edición (/tratamientos/:id/editar) en una sola página. */
export default function TratamientoFormPage() {
  const { id } = useParams();
  const idNumero = id === undefined ? undefined : Number(id);
  const esEdicion = idNumero !== undefined;
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const pacientes = usePacienteOpciones();
  const medicamentos = useMedicamentos();
  const tratamiento = useTratamiento(idNumero);
  const guardar = useGuardarTratamiento();

  // El formulario se monta recién cuando están todas las listas: así los <select>
  // arrancan con el valor correcto al editar.
  const cargando = pacientes.cargando || medicamentos.isLoading || (esEdicion && tratamiento.isLoading);
  const error = pacientes.error ?? medicamentos.error ?? (esEdicion ? tratamiento.error : null);

  return (
    <>
      <PageHeader titulo={esEdicion ? 'Editar tratamiento' : 'Nuevo tratamiento'} />
      <div className="panel">
        {errorApi && <div className="aviso aviso-error" role="alert" style={{ marginBottom: '1rem' }}>{errorApi}</div>}
        <StateView cargando={cargando} error={error}>
          <TratamientoForm
            esEdicion={esEdicion}
            enviando={guardar.isPending}
            pacientes={pacientes.opciones}
            medicamentos={medicamentos.data ?? []}
            valoresIniciales={tratamiento.data ? tratamientoAFormulario(tratamiento.data) : undefined}
            onEnviar={(valores) => {
              setErrorApi(null);
              guardar.mutate(
                { id: idNumero, datos: formularioAPayload(valores) },
                { onSuccess: () => navigate('/tratamientos'), onError: (e) => setErrorApi(obtenerMensajeError(e)) },
              );
            }}
          />
        </StateView>
      </div>
    </>
  );
}
