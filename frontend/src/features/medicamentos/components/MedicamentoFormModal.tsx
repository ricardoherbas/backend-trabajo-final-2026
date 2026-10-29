import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/FormField';
import { medicamentoSchema, type MedicamentoForm } from '../validators/medicamento.validator';
import type { Medicamento } from '../interfaces/medicamento.interface';

interface Props {
  abierto: boolean;
  medicamento: Medicamento | null; // null → alta
  enviando: boolean;
  error: string | null;
  onCerrar: () => void;
  onEnviar: (valores: MedicamentoForm) => void;
}

export function MedicamentoFormModal({ abierto, medicamento, enviando, error, onCerrar, onEnviar }: Props) {
  return (
    <Modal abierto={abierto} titulo={medicamento ? 'Editar medicamento' : 'Nuevo medicamento'} onCerrar={onCerrar}>
      {/* El Modal no monta sus hijos cerrado: el formulario arranca limpio en cada apertura */}
      <Formulario medicamento={medicamento} enviando={enviando} error={error} onCerrar={onCerrar} onEnviar={onEnviar} />
    </Modal>
  );
}

function Formulario({ medicamento, enviando, error, onCerrar, onEnviar }: Omit<Props, 'abierto'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicamentoForm>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: medicamento
      ? { nombre: medicamento.nombre, presentacion: medicamento.presentacion, cantidad: medicamento.cantidad }
      : undefined,
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
      {error && <div className="aviso aviso-error" role="alert">{error}</div>}
      <FormField etiqueta="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <FormField etiqueta="Presentación" placeholder="Comprimidos 500 mg, jarabe, ampolla…" error={errors.presentacion?.message} {...register('presentacion')} />
      <FormField
        etiqueta="Cantidad"
        type="number"
        min={1}
        step={1}
        ayuda="Unidades por presentación."
        error={errors.cantidad?.message}
        {...register('cantidad', { valueAsNumber: true })}
      />
      <div className="form-acciones">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar medicamento'}</Button>
        <Button variante="secundario" onClick={onCerrar}>Cancelar</Button>
      </div>
    </form>
  );
}
