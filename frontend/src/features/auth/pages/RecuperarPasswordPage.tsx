import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { obtenerMensajeError } from '@/core/api/errors';
import { FormField } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '../services/auth.service';
import { recuperarSchema, type RecuperarForm } from '../validators/auth.validator';

export default function RecuperarPasswordPage() {
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarForm>({ resolver: zodResolver(recuperarSchema) });

  const alEnviar = handleSubmit(async ({ email }) => {
    try {
      const { mensaje } = await authService.solicitarRecuperacion(email);
      setResultado({ ok: true, texto: mensaje });
    } catch (e) {
      setResultado({ ok: false, texto: obtenerMensajeError(e) });
    }
  });

  return (
    <>
      <div>
        <h1>Recuperar contraseña</h1>
        <p>Te enviaremos un enlace por email. Vence a los 15 minutos.</p>
      </div>
      <form className="form-grid" onSubmit={alEnviar} noValidate>
        {resultado && (
          <div className={`aviso ${resultado.ok ? 'aviso-ok' : 'aviso-error'}`} role="status">{resultado.texto}</div>
        )}
        <FormField etiqueta="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Enviar enlace'}</Button>
      </form>
      <div className="acceso-pie"><Link to="/login">Volver a iniciar sesión</Link></div>
    </>
  );
}
