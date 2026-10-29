import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { FormField } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '../services/auth.service';
import { registroFamiliarSchema, type RegistroFamiliarForm } from '../validators/auth.validator';

/** El QR que genera la institución abre /registro?codigo=<codigo_vinculacion> */
export default function RegistroFamiliarPage() {
  const [params] = useSearchParams();
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFamiliarForm>({
    resolver: zodResolver(registroFamiliarSchema),
    defaultValues: { codigo_vinculacion: params.get('codigo') ?? '' },
  });

  const alEnviar = handleSubmit(async ({ repetir: _repetir, fecha_nacimiento, telefono, ...datos }) => {
    try {
      await authService.registrarFamiliar({
        ...datos,
        fecha_nacimiento: fecha_nacimiento || null,
        telefono: telefono || null,
      });
      setResultado({ ok: true, texto: 'Tu cuenta fue creada. Ya podés iniciar sesión.' });
    } catch (e) {
      setResultado({ ok: false, texto: obtenerMensajeError(e) });
    }
  });

  if (resultado?.ok) {
    return (
      <>
        <div className="aviso aviso-ok" role="status">{resultado.texto}</div>
        <Link className="btn btn-primario" to="/login">Iniciar sesión</Link>
      </>
    );
  }

  return (
    <>
      <div>
        <h1>Crear cuenta de familiar</h1>
        <p>Usá el código de vinculación que te dio la institución.</p>
      </div>
      <form className="form-grid" onSubmit={alEnviar} noValidate>
        {resultado && <div className="aviso aviso-error" role="alert">{resultado.texto}</div>}
        <FormField etiqueta="Código de vinculación" autoComplete="off" error={errors.codigo_vinculacion?.message} {...register('codigo_vinculacion')} />
        <div className="form-grid dos">
          <FormField etiqueta="Nombre" autoComplete="given-name" error={errors.nombre?.message} {...register('nombre')} />
          <FormField etiqueta="Apellido" autoComplete="family-name" error={errors.apellido?.message} {...register('apellido')} />
          <FormField etiqueta="DNI" inputMode="numeric" error={errors.dni?.message} {...register('dni')} />
          <FormField etiqueta="Teléfono (opcional)" type="tel" autoComplete="tel" error={errors.telefono?.message} {...register('telefono')} />
        </div>
        <FormField etiqueta="Fecha de nacimiento (opcional)" type="date" error={errors.fecha_nacimiento?.message} {...register('fecha_nacimiento')} />
        <FormField etiqueta="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField etiqueta="Contraseña" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <FormField etiqueta="Repetir contraseña" type="password" autoComplete="new-password" error={errors.repetir?.message} {...register('repetir')} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}</Button>
      </form>
      <div className="acceso-pie"><Link to="/login">Ya tengo cuenta</Link></div>
    </>
  );
}
