import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormField, FormTextarea } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { pacienteSchema, type PacienteForm as PacienteFormValues } from '../validators/paciente.validator';

interface Props {
  valoresIniciales?: PacienteFormValues;
  esEdicion?: boolean;
  enviando?: boolean;
  onEnviar: (valores: PacienteFormValues) => void;
}

export function PacienteForm({ valoresIniciales, esEdicion, enviando, onEnviar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: valoresIniciales,
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      <FormField
        etiqueta="ID de la persona"
        type="number"
        min={1}
        disabled={esEdicion}
        ayuda="Es el ID de la persona ya registrada en el sistema."
        error={errors.persona_id?.message}
        {...register('persona_id', { valueAsNumber: true })}
      />
      <div className="form-grid dos">
        <FormField etiqueta="Dirección" error={errors.direccion?.message} {...register('direccion')} />
        <FormField etiqueta="Obra social" error={errors.obra_social?.message} {...register('obra_social')} />
      </div>
      <FormTextarea etiqueta="Observaciones" error={errors.observaciones?.message} {...register('observaciones')} />
      {esEdicion && (
        <div className="campo check">
          <input id="campo-activo" type="checkbox" {...register('activo')} />
          <label htmlFor="campo-activo">Paciente activo</label>
        </div>
      )}
      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar paciente'}</Button>
        <Link className="btn btn-secundario" to="/pacientes">Cancelar</Link>
      </div>
    </form>
  );
}
