import { httpClient } from '@/core/api/httpClient';
import type {
  DatosLogin,
  DatosRegistroFamiliar,
  PerfilUsuario,
  RespuestaLogin,
} from '../interfaces/auth.interface';

export const authService = {
  login: async (datos: DatosLogin): Promise<RespuestaLogin> =>
    (await httpClient.post<RespuestaLogin>('/auth/login', datos)).data,

  registrarFamiliar: async (datos: DatosRegistroFamiliar) =>
    (await httpClient.post('/auth/registro', datos)).data,

  perfil: async (): Promise<PerfilUsuario> =>
    (await httpClient.get<PerfilUsuario>('/auth/perfil')).data,

  solicitarRecuperacion: async (email: string): Promise<{ mensaje: string }> =>
    (await httpClient.post('/auth/recuperar-password', { email })).data,

  restablecerPassword: async (token: string, nuevaPassword: string): Promise<{ mensaje: string }> =>
    (await httpClient.post('/auth/restablecer-password', { token, nuevaPassword })).data,
};
