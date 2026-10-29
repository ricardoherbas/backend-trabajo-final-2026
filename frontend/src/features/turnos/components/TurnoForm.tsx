import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { DIAS_SEMANA } from '@/core/types/dia-semana.type';
import { turnoSchema, type TurnoForm as TurnoFormValues } from '../validators/turno.validator';

interface Props {
  valoresIniciales?: TurnoFormValues;
  enviando?: boolean;
  error?: string | null;
  onEnviar: (valores: TurnoFormValues) => void;
  onCancelar: () => void;
}

export function TurnoForm({ valoresIniciales, enviando, error, onEnviar, onCancelar }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<TurnoFormValues>({
    resolver: zodResolver(turnoSchema),
    defaultValues: valoresIniciales ?? { activo: true },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      {error && <div className="aviso aviso-error" role="alert">{error}</div>}

      <FormSelect etiqueta="Día de la semana" defaultValue="" error={errors.dia_semana?.message} {...register('dia_semana')}>
        <option value="" disabled>Elegí un día</option>
        {DIAS_SEMANA.map((d) => <option key={d} value={d}>{d}</option>)}
      </FormSelect>

      <div className="form-grid dos">
        <FormField etiqueta="Hora de inicio" type="time" error={errors.hora_inicio?.message} {...register('hora_inicio')} />
        <FormField etiqueta="Hora de fin" type="time" error={errors.hora_fin?.message} {...register('hora_fin')} />
      </div>

      <div className="campo check">
        <input id="campo-activo" type="checkbox" {...register('activo')} />
        <label htmlFor="campo-activo">Turno activo</label>
      </div>

      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar turno'}</Button>
        <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>
      </div>
    </form>
  );
}
