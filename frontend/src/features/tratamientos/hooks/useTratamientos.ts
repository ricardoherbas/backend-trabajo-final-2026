import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tratamientoService } from '../services/tratamiento.service';
import type { DatosCrearTratamiento } from '../interfaces/tratamiento.interface';

const CLAVE = 'tratamientos';

export const useTratamientos = () => useQuery({ queryKey: [CLAVE], queryFn: tratamientoService.listar });

export const useTratamiento = (id: number | undefined) =>
  useQuery({
    queryKey: [CLAVE, id],
    queryFn: () => tratamientoService.obtener(id as number),
    enabled: id !== undefined && Number.isFinite(id),
  });

/** Alta (sin id) o edición (con id). El backend exige todos los campos obligatorios en ambos casos. */
export function useGuardarTratamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: DatosCrearTratamiento }) =>
      id === undefined ? tratamientoService.crear(datos) : tratamientoService.actualizar(id, datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useEliminarTratamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tratamientoService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}
