import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { hoyISO } from '@/shared/utils/formatFecha';
import { formatMoneda } from '@/shared/utils/formatMoneda';
import { cobroSchema, MEDIOS_PAGO, type CobroForm } from '../validators/pago.validator';
import { ETIQUETA_MEDIO_PAGO, formatPeriodo } from '../adapters/pago.adapter';
import type { Pago } from '../interfaces/pago.interface';

interface Props {
  pago: Pago | null; // null → cerrado
  nombrePaciente: string;
  enviando: boolean;
  error: string | null;
  onCerrar: () => void;
  onEnviar: (valores: CobroForm) => void;
}

/** Acción rápida: pasa un pago a "Pagado" pidiendo solo medio y fecha. */
export function RegistrarCobroModal({ pago, nombrePaciente, enviando, error, onCerrar, onEnviar }: Props) {
  return (
    <Modal abierto={pago !== null} titulo="Registrar cobro" onCerrar={onCerrar}>
      {pago && <Formulario pago={pago} nombrePaciente={nombrePaciente} enviando={enviando} error={error} onCerrar={onCerrar} onEnviar={onEnviar} />}
    </Modal>
  );
}

function Formulario({ pago, nombrePaciente, enviando, error, onCerrar, onEnviar }: Omit<Props, 'pago'> & { pago: Pago }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CobroForm>({
    resolver: zodResolver(cobroSchema),
    defaultValues: { fecha_pago: hoyISO() },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      <p>
        {nombrePaciente} · período {formatPeriodo(pago.periodo)} · <strong>{formatMoneda(pago.monto)}</strong>
      </p>
      {error && <div className="aviso aviso-error" role="alert">{error}</div>}
      <FormSelect etiqueta="Medio de pago" defaultValue="" error={errors.medio_pago?.message} {...register('medio_pago')}>
        <option value="" disabled>Elegí cómo se pagó</option>
        {MEDIOS_PAGO.map((m) => <option key={m} value={m}>{ETIQUETA_MEDIO_PAGO[m]}</option>)}
      </FormSelect>
      <FormField etiqueta="Fecha de pago" type="date" error={errors.fecha_pago?.message} {...register('fecha_pago')} />
      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Registrando…' : 'Registrar cobro'}</Button>
        <Button variante="secundario" onClick={onCerrar}>Cancelar</Button>
      </div>
    </form>
  );
}
