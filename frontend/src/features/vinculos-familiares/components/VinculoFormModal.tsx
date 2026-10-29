import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { pacienteService } from '@/features/pacientes/services/paciente.service';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import { familiarService } from '@/features/familiares/services/familiar.service';
import { vinculoSchema, type VinculoForm } from '../validators/vinculoFamiliar.validator';

interface Props {
  abierto: boolean;
  enviando: boolean;
  error: string | null;
  onCerrar: () => void;
  onEnviar: (v: VinculoForm) => void;
}

export function VinculoFormModal({ abierto, enviando, error, onCerrar, onEnviar }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<VinculoForm>({
    resolver: zodResolver(vinculoSchema),
  });
  const pacientes = useQuery({ queryKey: ['pacientes'], queryFn: pacienteService.listar, enabled: abierto });
  // GET /familiares es solo de administrador: para secretaria se pide el ID a mano.
  const familiares = useQuery({ queryKey: ['familiares'], queryFn: familiarService.listar, enabled: abierto, retry: false });

  return (
    <Modal abierto={abierto} titulo="Nuevo vínculo familiar" onCerrar={onCerrar}>
      <form className="form-grid" onSubmit={handleSubmit(onEnviar)} noValidate>
        {error && <div className="aviso aviso-error" role="alert">{error}</div>}

        {familiares.data ? (
          <FormSelect etiqueta="Familiar" defaultValue="" error={errors.familiar_id?.message} {...register('familiar_id', { valueAsNumber: true })}>
            <option value="" disabled>Elegí un familiar</option>
            {familiares.data.map((f) => (
              <option key={f.id} value={f.id}>
                {f.persona ? `${f.persona.apellido}, ${f.persona.nombre}` : `Familiar #${f.id}`}
              </option>
            ))}
          </FormSelect>
        ) : (
          <FormField
            etiqueta="ID del familiar"
            type="number"
            min={1}
            ayuda="No se pudo cargar la lista de familiares con tu rol. Ingresá el ID."
            error={errors.familiar_id?.message}
            {...register('familiar_id', { valueAsNumber: true })}
          />
        )}

        <FormSelect etiqueta="Paciente" defaultValue="" error={errors.paciente_id?.message} {...register('paciente_id', { valueAsNumber: true })}>
          <option value="" disabled>Elegí un paciente</option>
          {(pacientes.data ?? []).map((p) => (
            <option key={p.id} value={p.id}>{nombreCompleto(p)}</option>
          ))}
        </FormSelect>

        <FormField etiqueta="Parentesco" placeholder="Hija, hijo, esposo…" error={errors.parentesco?.message} {...register('parentesco')} />
        <div className="campo check">
          <input id="campo-principal" type="checkbox" {...register('es_contacto_principal')} />
          <label htmlFor="campo-principal">Es el contacto principal</label>
        </div>
        <div className="form-acciones">
          <Button type="submit" disabled={enviando}>{enviando ? 'Creando…' : 'Crear vínculo'}</Button>
          <Button variante="secundario" onClick={onCerrar}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  );
}
