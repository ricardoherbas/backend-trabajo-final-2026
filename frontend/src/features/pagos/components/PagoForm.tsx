import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormField, FormSelect, FormTextarea } from '@/shared/components/FormField';
import { PacienteOptions } from '@/shared/components/PacienteOptions';
import { Button } from '@/shared/components/ui/Button';
import type { OpcionPaciente } from '@/shared/hooks/usePacienteOpciones';
import { pagoSchema, ESTADOS_PAGO, MEDIOS_PAGO, type PagoForm as PagoFormValues } from '../validators/pago.validator';
import { ETIQUETA_ESTADO_PAGO, ETIQUETA_MEDIO_PAGO } from '../adapters/pago.adapter';

interface Props {
  pacientes: OpcionPaciente[];
  valoresIniciales?: PagoFormValues;
  enviando?: boolean;
  onEnviar: (valores: PagoFormValues) => void;
}

export function PagoForm({ pacientes, valoresIniciales, enviando, onEnviar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: valoresIniciales ?? { estado: 'pendiente' },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      {pacientes.length === 0 && (
        <div className="aviso aviso-info">Primero tiene que haber pacientes cargados. <Link to="/pacientes">Ir a pacientes</Link></div>
      )}
      <div className="form-grid dos">
        <FormSelect etiqueta="Paciente" defaultValue="" error={errors.paciente_id?.message} {...register('paciente_id', { valueAsNumber: true })}>
          <PacienteOptions opciones={pacientes} />
        </FormSelect>
        <FormField
          etiqueta="Período (mes)"
          type="month"
          ayuda="Hay un solo pago por paciente y mes."
          error={errors.periodo?.message}
          {...register('periodo')}
        />
        <FormField etiqueta="Monto (ARS)" type="number" min={0} step="0.01" error={errors.monto?.message} {...register('monto', { valueAsNumber: true })} />
        <FormSelect etiqueta="Estado" error={errors.estado?.message} {...register('estado')}>
          {ESTADOS_PAGO.map((e) => <option key={e} value={e}>{ETIQUETA_ESTADO_PAGO[e]}</option>)}
        </FormSelect>
        <FormSelect etiqueta="Medio de pago (opcional)" error={errors.medio_pago?.message} {...register('medio_pago')}>
          <option value="">Sin definir</option>
          {MEDIOS_PAGO.map((m) => <option key={m} value={m}>{ETIQUETA_MEDIO_PAGO[m]}</option>)}
        </FormSelect>
        <FormField
          etiqueta="Fecha de pago (opcional)"
          type="date"
          ayuda="Si el estado es Pagado y la dejás vacía, se usa la fecha de hoy."
          error={errors.fecha_pago?.message}
          {...register('fecha_pago')}
        />
      </div>
      <FormTextarea etiqueta="Observaciones (opcional)" error={errors.observaciones?.message} {...register('observaciones')} />
      <div className="form-acciones">
        <Button type="submit" disabled={enviando || pacientes.length === 0}>{enviando ? 'Guardando…' : 'Guardar pago'}</Button>
        <Link className="btn btn-secundario" to="/pagos">Cancelar</Link>
      </div>
    </form>
  );
}
