import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { PacienteForm } from '../components/PacienteForm';
import { useActualizarPaciente, useCrearPaciente, usePaciente } from '../hooks/usePacientes';
import { formularioAPayload, pacienteAFormulario } from '../adapters/paciente.adapter';

/** Una sola página para alta (/pacientes/nuevo) y edición (/pacientes/:id/editar). */
export default function PacienteFormPage() {
  const { id } = useParams();
  const esEdicion = id !== undefined;
  const idNumero = Number(id);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const paciente = usePaciente(idNumero);
  const crear = useCrearPaciente();
  const actualizar = useActualizarPaciente(idNumero);
  const mutacion = esEdicion ? actualizar : crear;

  return (
    <>
      <PageHeader titulo={esEdicion ? 'Editar paciente' : 'Nuevo paciente'} />
      <div className="panel">
        {errorApi && <div className="aviso aviso-error" role="alert" style={{ marginBottom: '1rem' }}>{errorApi}</div>}
        <StateView cargando={esEdicion && paciente.isLoading} error={esEdicion ? paciente.error : undefined}>
          <PacienteForm
            esEdicion={esEdicion}
            enviando={mutacion.isPending}
            valoresIniciales={paciente.data ? pacienteAFormulario(paciente.data) : undefined}
            onEnviar={(valores) => {
              setErrorApi(null);
              mutacion.mutate(formularioAPayload(valores), {
                onSuccess: () => navigate('/pacientes'),
                onError: (e) => setErrorApi(obtenerMensajeError(e)),
              });
            }}
          />
        </StateView>
      </div>
    </>
  );
}
