import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FormField, FormTextarea } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { AvisoPersonaCreada, PersonaCampos } from '@/features/personas/components/PersonaCampos';
import { useAltaPersonaPerfil } from '@/features/personas/hooks/useAltaPersonaPerfil';
import { personaFormAPayload } from '@/features/personas/validators/persona.validator';
import { altaAPayloadPerfil } from '../adapters/paciente.adapter';
import { pacienteService } from '../services/paciente.service';
import { pacienteAltaSchema, type PacienteAltaForm as PacienteAltaValues } from '../validators/paciente.validator';

/** Alta de paciente: crea la persona y después el paciente. Si el paciente falla, reintenta sin duplicar la persona. */
export function PacienteAltaForm() {
  const navigate = useNavigate();
  const metodos = useForm<PacienteAltaValues>({ resolver: zodResolver(pacienteAltaSchema) });
  const { register, handleSubmit, formState: { errors } } = metodos;
  const alta = useAltaPersonaPerfil({ nombrePerfil: 'paciente', claveQuery: 'pacientes', alExito: () => navigate('/pacientes') });

  return (
    <FormProvider {...metodos}>
      <form
        className="form-grid"
        noValidate
        onSubmit={handleSubmit((v) =>
          alta.enviar(personaFormAPayload(v), (personaId) => pacienteService.crear(altaAPayloadPerfil(v, personaId))),
        )}
      >
        {alta.error && <div className="aviso aviso-error" role="alert">{alta.error}</div>}
        {alta.personaId !== null && <AvisoPersonaCreada personaId={alta.personaId} />}
        <PersonaCampos bloqueado={alta.personaId !== null} />
        <div className="form-grid dos">
          <FormField etiqueta="Dirección" error={errors.direccion?.message} {...register('direccion')} />
          <FormField etiqueta="Obra social" error={errors.obra_social?.message} {...register('obra_social')} />
        </div>
        <FormTextarea etiqueta="Observaciones" error={errors.observaciones?.message} {...register('observaciones')} />
        <div className="form-acciones">
          <Button type="submit" disabled={alta.enviando}>{alta.enviando ? 'Guardando…' : 'Guardar paciente'}</Button>
          <Link className="btn btn-secundario" to="/pacientes">Cancelar</Link>
        </div>
      </form>
    </FormProvider>
  );
}