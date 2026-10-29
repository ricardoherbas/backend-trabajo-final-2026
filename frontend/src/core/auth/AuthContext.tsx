import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { registrarManejadorSesionExpirada } from '@/core/api/httpClient';
import { tokenStorage } from './tokenStorage';
import { authService } from '@/features/auth/services/auth.service';
import type { UsuarioSesion } from '@/features/auth/interfaces/auth.interface';
import type { Rol } from '@/core/permissions/roles';

interface AuthContextValue {
  usuario: UsuarioSesion | null;
  rol: Rol | null;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<UsuarioSesion>;
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState<boolean>(() => tokenStorage.obtener() !== null);

  const cerrarSesion = useCallback(() => {
    tokenStorage.borrar();
    setUsuario(null);
  }, []);

  // Si hay token guardado, se recupera la sesión con GET /auth/perfil
  useEffect(() => {
    registrarManejadorSesionExpirada(cerrarSesion);
    if (!tokenStorage.obtener()) return;

    authService
      .perfil()
      .then((perfil) =>
        setUsuario({
          id: perfil.id,
          persona_id: perfil.persona_id,
          email: perfil.email,
          rol: perfil.rol,
          activo: perfil.activo,
        }),
      )
      .catch(cerrarSesion)
      .finally(() => setCargando(false));
  }, [cerrarSesion]);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const { token, usuario: datos } = await authService.login({ email, password });
    tokenStorage.guardar(token);
    setUsuario(datos);
    return datos;
  }, []);

  const value = useMemo(
    () => ({ usuario, rol: usuario?.rol ?? null, cargando, iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
