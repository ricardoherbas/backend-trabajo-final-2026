import { useFormContext } from 'react-hook-form';
import { FormField } from '@/shared/components/FormField';
import type { PersonaFormValues } from '../validators/persona.validator';

/** Campos de persona. Va dentro de un <FormProvider> cuyo formulario incluya PersonaFormValues. */
export function PersonaCampos({ bloqueado }: { bloqueado?: boolean }) {
  const { register, formState: { errors } } = useFormContext<PersonaFormValues>();
  return (
    <>
      <div className="form-grid dos">
        <FormField etiqueta="Nombre" readOnly={bloqueado} error={errors.nombre?.message} {...register('nombre')} />
        <FormField etiqueta="Apellido" readOnly={bloqueado} error={errors.apellido?.message} {...register('apellido')} />
      </div>
      <div className="form-grid dos">
        <FormField etiqueta="DNI" inputMode="numeric" readOnly={bloqueado} error={errors.dni?.message} {...register('dni')} />
        <FormField etiqueta="Fecha de nacimiento" type="date" readOnly={bloqueado} error={errors.fecha_nacimiento?.message} {...register('fecha_nacimiento')} />
      </div>
      <FormField etiqueta="Teléfono" type="tel" readOnly={bloqueado} error={errors.telefono?.message} {...register('telefono')} />
    </>
  );
}

/** Aviso que se muestra cuando la persona ya se creó y solo falta el perfil. */
export function AvisoPersonaCreada({ personaId }: { personaId: number }) {
  return (
    <div className="aviso aviso-info" role="status">
      La persona ya quedó registrada (#{personaId}). Al reintentar solo se crea el perfil; los datos personales no se pueden modificar acá.
    </div>
  );
}