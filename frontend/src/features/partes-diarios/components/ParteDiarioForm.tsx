import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormField, FormSelect, FormTextarea } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { parteDiarioSchema, type ParteDiarioForm as ParteDiarioFormValues } from '../validators/parteDiario.validator';

export interface OpcionAsignacion {
  id: number;
  etiqueta: string;
}

interface Props {
  asignaciones: OpcionAsignacion[];
  /** Parcial: en un alta solo viene la fecha de hoy; en una edición, todo. */
  valoresIniciales?: Partial<ParteDiarioFormValues>;
  enviando?: boolean;
  onEnviar: (valores: ParteDiarioFormValues) => void;
}

export function ParteDiarioForm({ asignaciones, valoresIniciales, enviando, onEnviar }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ParteDiarioFormValues>({
    resolver: zodResolver(parteDiarioSchema),
    defaultValues: valoresIniciales,
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      <FormSelect etiqueta="Asignación" defaultValue="" error={errors.asignacion_id?.message} {...register('asignacion_id', { valueAsNumber: true })}>
        <option value="" disabled>Elegí paciente · cuidadora · turno</option>
        {asignaciones.map((a) => <option key={a.id} value={a.id}>{a.etiqueta}</option>)}
      </FormSelect>

      <FormField etiqueta="Fecha" type="date" error={errors.fecha?.message} {...register('fecha')} />

      <div className="form-grid dos">
        <FormField etiqueta="Ánimo" error={errors.animo?.message} {...register('animo')} />
        <FormField etiqueta="Alimentación" error={errors.alimentacion?.message} {...register('alimentacion')} />
        <FormField etiqueta="Descanso" error={errors.descanso?.message} {...register('descanso')} />
        <FormField etiqueta="Higiene" error={errors.higiene?.message} {...register('higiene')} />
      </div>

      <FormTextarea etiqueta="Novedades" error={errors.novedades?.message} {...register('novedades')} />
      <FormTextarea etiqueta="Observaciones" error={errors.observaciones?.message} {...register('observaciones')} />

      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar parte'}</Button>
        <Link className="btn btn-secundario" to="/partes-diarios">Cancelar</Link>
      </div>
    </form>
  );
}
