import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pagoService } from '../services/pago.service';
import type { DatosCrearPago } from '../interfaces/pago.interface';

const CLAVE = 'pagos';

export const usePagos = () => useQuery({ queryKey: [CLAVE], queryFn: pagoService.listar });

export const usePago = (id: number | undefined) =>
  useQuery({
    queryKey: [CLAVE, id],
    queryFn: () => pagoService.obtener(id as number),
    enabled: id !== undefined && Number.isFinite(id),
  });

/** Alta (sin id) o edición (con id). */
export function useGuardarPago() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: DatosCrearPago }) =>
      id === undefined ? pagoService.crear(datos) : pagoService.actualizar(id, datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useEliminarPago() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pagoService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}
