import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asignacionService } from '../services/asignacion.service';
import type { DatosActualizarAsignacion, DatosCrearAsignacion } from '../interfaces/asignacion.interface';

const CLAVE = 'asignaciones';

export const useAsignaciones = () => useQuery({ queryKey: [CLAVE], queryFn: asignacionService.listar });

export function useCrearAsignacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosCrearAsignacion) => asignacionService.crear(datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useActualizarAsignacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: DatosActualizarAsignacion }) => asignacionService.actualizar(id, datos),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CLAVE] });
      qc.invalidateQueries({ queryKey: ['partesDiarios'] }); // los partes incluyen su asignación
    },
  });
}

export function useEliminarAsignacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asignacionService.eliminar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CLAVE] });
      qc.invalidateQueries({ queryKey: ['partesDiarios'] });
    },
  });
}
