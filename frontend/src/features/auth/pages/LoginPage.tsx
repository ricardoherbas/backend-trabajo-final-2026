import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { obtenerMensajeError } from '@/core/api/errors';
import { FormField } from '@/shared/components/FormField';
import { Button } from '@/shared/components/ui/Button';
import { loginSchema, type LoginForm } from '../validators/auth.validator';

export default function LoginPage() {
  const { usuario, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  if (usuario) return <Navigate to="/" replace />;

  const alEnviar = handleSubmit(async ({ email, password }) => {
    setErrorApi(null);
    try {
      await iniciarSesion(email, password);
      navigate('/', { replace: true });
    } catch (e) {
      setErrorApi(obtenerMensajeError(e));
    }
  });

  return (
    <>
      <div>
        <h1>Iniciar sesión</h1>
        <p>Ingresá con tu email y contraseña.</p>
      </div>
      <form className="form-grid" onSubmit={alEnviar} noValidate>
        {errorApi && <div className="aviso aviso-error" role="alert">{errorApi}</div>}
        <FormField etiqueta="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField etiqueta="Contraseña" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</Button>
      </form>
      <div className="acceso-pie">
        <Link to="/recuperar-password">Olvidé mi contraseña</Link>
        <span>¿Sos familiar y tenés un código? <Link to="/registro">Crear mi cuenta</Link></span>
      </div>
    </>
  );
}
