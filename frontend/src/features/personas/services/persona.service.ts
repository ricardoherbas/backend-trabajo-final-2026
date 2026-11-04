import { httpClient } from '@/core/api/httpClient';
import type { DatosActualizarPersona, DatosCrearPersona, RespuestaPersona } from '../interfaces/persona.interface';

/** /personas no tiene GET ni DELETE: solo alta (POST) y edición (PUT). */
export const personaService = {
  crear: async (datos: DatosCrearPersona): Promise<RespuestaPersona> =>
    (await httpClient.post<RespuestaPersona>('/personas', datos)).data,
  actualizar: async (id: number, datos: DatosActualizarPersona): Promise<RespuestaPersona> =>
    (await httpClient.put<RespuestaPersona>(`/personas/${id}`, datos)).data,
};