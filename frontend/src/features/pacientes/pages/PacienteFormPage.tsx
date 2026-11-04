import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { PacienteForm } from '../components/PacienteForm';
import { PacienteAltaForm } from '../components/PacienteAltaForm';
import { useActualizarPaciente, usePaciente } from '../hooks/usePacientes';
import { formularioAPayload, pacienteAFormulario } from '../adapters/paciente.adapter';

/** Una sola página para alta (/pacientes/nuevo, persona + paciente) y edición (/pacientes/:id/editar). */
export default function PacienteFormPage() {
  const { id } = useParams();
  const esEdicion = id !== undefined;
  const idNumero = Number(id);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const paciente = usePaciente(idNumero);
  const actualizar = useActualizarPaciente(idNumero);

  return (
    <>
      <PageHeader titulo={esEdicion ? 'Editar paciente' : 'Nuevo paciente'} />
      <div className="panel">
        {errorApi && <div className="aviso aviso-error" role="alert" style={{ marginBottom: '1rem' }}>{errorApi}</div>}
        {esEdicion ? (
          <StateView cargando={paciente.isLoading} error={paciente.error}>
            <PacienteForm
              esEdicion
              enviando={actualizar.isPending}
              valoresIniciales={paciente.data ? pacienteAFormulario(paciente.data) : undefined}
              onEnviar={(valores) => {
                setErrorApi(null);
                actualizar.mutate(formularioAPayload(valores), {
                  onSuccess: () => navigate('/pacientes'),
                  onError: (e) => setErrorApi(obtenerMensajeError(e)),
                });
              }}
            />
          </StateView>
        ) : (
          <PacienteAltaForm />
        )}
      </div>
    </>
  );
}