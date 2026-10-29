import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { etiquetaTurno } from '@/features/turnos/adapters/turno.adapter';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import type { Turno } from '@/features/turnos/interfaces/turno.interface';
import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';
import type { Cuidadora } from '@/features/cuidadoras/interfaces/cuidadora.interface';
import { asignacionSchema, type AsignacionForm as AsignacionFormValues } from '../validators/asignacion.validator';

export interface OpcionesAsignacion {
  turnos: Turno[];
  pacientes: Paciente[];
  /** null = este rol no pudo cargar la lista (solo la ve el administrador). */
  cuidadoras: Cuidadora[] | null;
}

interface Props {
  opciones: OpcionesAsignacion;
  valoresIniciales?: AsignacionFormValues;
  enviando?: boolean;
  error?: string | null;
  onEnviar: (valores: AsignacionFormValues) => void;
  onCancelar: () => void;
}

export function AsignacionForm({ opciones, valoresIniciales, enviando, error, onEnviar, onCancelar }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<AsignacionFormValues>({
    resolver: zodResolver(asignacionSchema),
    defaultValues: valoresIniciales ?? { activo: true },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      {error && <div className="aviso aviso-error" role="alert">{error}</div>}

      <FormSelect etiqueta="Paciente" defaultValue="" error={errors.paciente_id?.message} {...register('paciente_id', { valueAsNumber: true })}>
        <option value="" disabled>Elegí un paciente</option>
        {opciones.pacientes.map((p) => <option key={p.id} value={p.id}>{nombreCompleto(p)}</option>)}
      </FormSelect>

      {opciones.cuidadoras ? (
        <FormSelect etiqueta="Cuidadora" defaultValue="" error={errors.cuidador_id?.message} {...register('cuidador_id', { valueAsNumber: true })}>
          <option value="" disabled>Elegí una cuidadora</option>
          {opciones.cuidadoras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.persona ? `${c.persona.apellido}, ${c.persona.nombre}` : `Cuidadora #${c.id}`}
            </option>
          ))}
        </FormSelect>
      ) : (
        <FormField
          etiqueta="ID de la cuidadora"
          type="number"
          min={1}
          ayuda="No se pudo cargar la lista de cuidadoras con tu rol. Ingresá el ID."
          error={errors.cuidador_id?.message}
          {...register('cuidador_id', { valueAsNumber: true })}
        />
      )}

      <FormSelect etiqueta="Turno" defaultValue="" error={errors.turno_id?.message} {...register('turno_id', { valueAsNumber: true })}>
        <option value="" disabled>Elegí un turno</option>
        {opciones.turnos.map((t) => <option key={t.id} value={t.id}>{etiquetaTurno(t)}</option>)}
      </FormSelect>

      <div className="campo check">
        <input id="campo-activo" type="checkbox" {...register('activo')} />
        <label htmlFor="campo-activo">Asignación activa</label>
      </div>

      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar asignación'}</Button>
        <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>
      </div>
    </form>
  );
}
