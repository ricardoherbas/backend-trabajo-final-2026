import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { FormField } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '../services/auth.service';
import { restablecerSchema, type RestablecerForm } from '../validators/auth.validator';

/** El backend arma el enlace del email como /restablecer-password?token=... */
export default function RestablecerPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestablecerForm>({ resolver: zodResolver(restablecerSchema) });

  if (!token) {
    return (
      <>
        <div className="aviso aviso-error" role="alert">
          El enlace no es válido. Pedí uno nuevo para continuar.
        </div>
        <div className="acceso-pie"><Link to="/recuperar-password">Pedir un enlace nuevo</Link></div>
      </>
    );
  }

  const alEnviar = handleSubmit(async ({ nuevaPassword }) => {
    try {
      const { mensaje } = await authService.restablecerPassword(token, nuevaPassword);
      setResultado({ ok: true, texto: mensaje });
    } catch (e) {
      setResultado({ ok: false, texto: obtenerMensajeError(e) });
    }
  });

  return (
    <>
      <div>
        <h1>Nueva contraseña</h1>
        <p>Elegí una contraseña de al menos 8 caracteres.</p>
      </div>
      <form className="form-grid" onSubmit={alEnviar} noValidate>
        {resultado && (
          <div className={`aviso ${resultado.ok ? 'aviso-ok' : 'aviso-error'}`} role="status">{resultado.texto}</div>
        )}
        <FormField etiqueta="Nueva contraseña" type="password" autoComplete="new-password" error={errors.nuevaPassword?.message} {...register('nuevaPassword')} />
        <FormField etiqueta="Repetir contraseña" type="password" autoComplete="new-password" error={errors.repetir?.message} {...register('repetir')} />
        <Button type="submit" disabled={isSubmitting || resultado?.ok}>{isSubmitting ? 'Guardando…' : 'Guardar contraseña'}</Button>
      </form>
      <div className="acceso-pie"><Link to="/login">Ir a iniciar sesión</Link></div>
    </>
  );
}
