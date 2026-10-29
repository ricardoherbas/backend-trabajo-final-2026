import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { obtenerMensajeError } from '@/core/api/errors';
import { ETIQUETA_ROL } from '@/core/permissions/roles';
import { PageHeader } from '@/shared/components/PageHeader';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { usuarioService } from '../services/usuario.service';
import { usuarioSchema, type UsuarioForm } from '../validators/usuario.validator';

export default function UsuariosPage() {
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioForm>({ resolver: zodResolver(usuarioSchema) });

  const alEnviar = handleSubmit(async ({ fecha_nacimiento, telefono, ...datos }) => {
    try {
      const { usuario } = await usuarioService.crear({
        ...datos,
        fecha_nacimiento: fecha_nacimiento || null,
        telefono: telefono || null,
      });
      setResultado({
        ok: true,
        texto: `Usuario creado (${ETIQUETA_ROL[usuario.rol]}). ID de persona: ${usuario.persona_id}.`,
      });
      reset();
    } catch (e) {
      setResultado({ ok: false, texto: obtenerMensajeError(e) });
    }
  });

  return (
    <>
      <PageHeader titulo="Usuarios" descripcion="Alta de cuentas del sistema. Cada alta crea también a la persona y su perfil." />
      <div className="panel">
        <form className="form-grid" onSubmit={alEnviar} noValidate>
          {resultado && (
            <div className={`aviso ${resultado.ok ? 'aviso-ok' : 'aviso-error'}`} role="status">{resultado.texto}</div>
          )}
          <div className="form-grid dos">
            <FormField etiqueta="Nombre" error={errors.nombre?.message} {...register('nombre')} />
            <FormField etiqueta="Apellido" error={errors.apellido?.message} {...register('apellido')} />
            <FormField etiqueta="DNI" inputMode="numeric" error={errors.dni?.message} {...register('dni')} />
            <FormField etiqueta="Teléfono (opcional)" type="tel" error={errors.telefono?.message} {...register('telefono')} />
            <FormField etiqueta="Fecha de nacimiento (opcional)" type="date" error={errors.fecha_nacimiento?.message} {...register('fecha_nacimiento')} />
            <FormSelect etiqueta="Rol" defaultValue="" error={errors.rol?.message} {...register('rol')}>
              <option value="" disabled>Elegí un rol</option>
              {Object.entries(ETIQUETA_ROL).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
              ))}
            </FormSelect>
            <FormField etiqueta="Email" type="email" error={errors.email?.message} {...register('email')} />
            <FormField etiqueta="Contraseña inicial" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          </div>
          <div className="form-acciones">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando…' : 'Crear usuario'}</Button>
          </div>
        </form>
      </div>
    </>
  );
}
