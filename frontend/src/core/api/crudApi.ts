import { httpClient } from './httpClient';

/**
 * Factory de servicios CRUD. Cada recurso del backend (/api/<ruta>) expone
 * GET /, GET /:id, POST /, PUT /:id y DELETE /:id con la misma forma.
 * Cada feature crea su service con esta fábrica y le suma métodos propios.
 */
export function crearCrudApi<Entidad, Crear = Partial<Entidad>, Actualizar = Partial<Crear>>(
  ruta: string,
) {
  return {
    listar: async (): Promise<Entidad[]> => (await httpClient.get<Entidad[]>(`/${ruta}`)).data,
    obtener: async (id: number): Promise<Entidad> =>
      (await httpClient.get<Entidad>(`/${ruta}/${id}`)).data,
    crear: async (datos: Crear) => (await httpClient.post(`/${ruta}`, datos)).data,
    actualizar: async (id: number, datos: Actualizar) =>
      (await httpClient.put(`/${ruta}/${id}`, datos)).data,
    eliminar: async (id: number) => (await httpClient.delete(`/${ruta}/${id}`)).data,
  };
}
