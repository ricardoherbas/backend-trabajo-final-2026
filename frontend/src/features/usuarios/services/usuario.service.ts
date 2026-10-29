import { httpClient } from '@/core/api/httpClient';
import type { DatosCrearUsuario, UsuarioCreado } from '../interfaces/usuario.interface';

// El backend solo expone el alta (POST /usuarios). Listar, editar y
// desactivar todavía no existen en la API.
export const usuarioService = {
  crear: async (datos: DatosCrearUsuario): Promise<{ mensaje: string; usuario: UsuarioCreado }> =>
    (await httpClient.post('/usuarios', datos)).data,
};
