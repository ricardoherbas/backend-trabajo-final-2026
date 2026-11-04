import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { personaFormAPayload, personaSchema, type PersonaFormValues } from '../validators/persona.validator';
import type { DatosCrearPersona } from '../interfaces/persona.interface';
import { AvisoPersonaCreada, PersonaCampos } from './PersonaCampos';

interface Props {
  enviando?: boolean;
  error?: string | null;
  /** Si no es null, la persona ya existe y los campos quedan bloqueados. */
  personaCreadaId?: number | null;
  textoEnviar?: string;
  onEnviar: (datos: DatosCrearPersona) => void;
  onCancelar: () => void;
}

/** Formulario de persona sola (usado en las altas de familiares y cuidadoras). */
export function PersonaForm({ enviando, error, personaCreadaId = null, textoEnviar = 'Guardar', onEnviar, onCancelar }: Props) {
  const metodos = useForm<PersonaFormValues>({ resolver: zodResolver(personaSchema) });
  return (
    <FormProvider {...metodos}>
      <form className="form-grid" onSubmit={metodos.handleSubmit((v) => onEnviar(personaFormAPayload(v)))} noValidate>
        {error && <div className="aviso aviso-error" role="alert">{error}</div>}
        {personaCreadaId !== null && <AvisoPersonaCreada personaId={personaCreadaId} />}
        <PersonaCampos bloqueado={personaCreadaId !== null} />
        <div className="form-acciones">
          <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : textoEnviar}</Button>
          <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>
        </div>
      </form>
    </FormProvider>
  );
}