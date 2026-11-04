import { httpClient } from '@/core/api/httpClient';
import type {
  DatosActualizarUsuario,
  DatosCrearUsuario,
  EstadoUsuario,
  Usuario,
  UsuarioCreado,
} from '../interfaces/usuario.interface';

// el listado del backend responde { usuarios: [...] } (no un array suelto),
// por eso no se usa crearCrudApi.
export const usuarioService = {
  listar: async (): Promise<Usuario[]> => (await httpClient.get<{ usuarios: Usuario[] }>('/usuarios')).data.usuarios,

  crear: async (datos: DatosCrearUsuario): Promise<{ mensaje: string; usuario: UsuarioCreado }> =>
    (await httpClient.post('/usuarios', datos)).data,

  actualizar: async (id: number, datos: DatosActualizarUsuario): Promise<{ mensaje: string; usuario: Usuario }> =>
    (await httpClient.put(`/usuarios/${id}`, datos)).data,

  activar: async (id: number): Promise<{ mensaje: string; usuario: EstadoUsuario }> =>
    (await httpClient.patch(`/usuarios/${id}/activar`)).data,

  desactivar: async (id: number): Promise<{ mensaje: string; usuario: EstadoUsuario }> =>
    (await httpClient.patch(`/usuarios/${id}/desactivar`)).data,
};