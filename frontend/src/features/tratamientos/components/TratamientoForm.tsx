import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { PacienteOptions } from '@/shared/components/PacienteOptions';
import { Button } from '@/shared/components/ui/Button';
import type { OpcionPaciente } from '@/shared/hooks/usePacienteOpciones';
import type { Medicamento } from '@/features/medicamentos/interfaces/medicamento.interface';
import { tratamientoSchema, type TratamientoForm as TratamientoFormValues } from '../validators/tratamiento.validator';

interface Props {
  pacientes: OpcionPaciente[];
  medicamentos: Medicamento[];
  valoresIniciales?: TratamientoFormValues;
  esEdicion?: boolean;
  enviando?: boolean;
  onEnviar: (valores: TratamientoFormValues) => void;
}

export function TratamientoForm({ pacientes, medicamentos, valoresIniciales, esEdicion, enviando, onEnviar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TratamientoFormValues>({
    resolver: zodResolver(tratamientoSchema),
    defaultValues: valoresIniciales ?? { activa: true },
  });

  const faltanDatos = pacientes.length === 0 || medicamentos.length === 0;

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      {pacientes.length === 0 && (
        <div className="aviso aviso-info">Primero tiene que haber pacientes cargados. <Link to="/pacientes">Ir a pacientes</Link></div>
      )}
      {medicamentos.length === 0 && (
        <div className="aviso aviso-info">Primero cargá el medicamento en el catálogo. <Link to="/medicamentos">Ir a medicamentos</Link></div>
      )}

      <div className="form-grid dos">
        <FormSelect etiqueta="Paciente" defaultValue="" error={errors.paciente_id?.message} {...register('paciente_id', { valueAsNumber: true })}>
          <PacienteOptions opciones={pacientes} />
        </FormSelect>
        <FormSelect etiqueta="Medicamento" defaultValue="" error={errors.medicamento_id?.message} {...register('medicamento_id', { valueAsNumber: true })}>
          <option value="" disabled>Elegí un medicamento</option>
          {medicamentos.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre} · {m.presentacion}</option>
          ))}
        </FormSelect>
        <FormField etiqueta="Dosis" placeholder="1 comprimido, 10 ml…" error={errors.dosis?.message} {...register('dosis')} />
        <FormField etiqueta="Frecuencia" placeholder="Cada 8 horas, una vez al día…" error={errors.frecuencia?.message} {...register('frecuencia')} />
      </div>
      <FormField etiqueta="Horario (opcional)" placeholder="08:00 y 20:00" error={errors.horario?.message} {...register('horario')} />
      <div className="form-grid dos">
        <FormField etiqueta="Desde (opcional)" type="date" error={errors.desde?.message} {...register('desde')} />
        <FormField etiqueta="Hasta (opcional)" type="date" error={errors.hasta?.message} {...register('hasta')} />
      </div>
      {esEdicion && (
        <div className="campo check">
          <input id="campo-activa" type="checkbox" {...register('activa')} />
          <label htmlFor="campo-activa">Tratamiento en curso</label>
        </div>
      )}
      <div className="form-acciones">
        <Button type="submit" disabled={enviando || faltanDatos}>{enviando ? 'Guardando…' : 'Guardar tratamiento'}</Button>
        <Link className="btn btn-secundario" to="/tratamientos">Cancelar</Link>
      </div>
    </form>
  );
}
