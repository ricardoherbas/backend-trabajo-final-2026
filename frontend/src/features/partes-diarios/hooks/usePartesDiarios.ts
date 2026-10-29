import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parteDiarioService } from '../services/parteDiario.service';
import type { DatosActualizarParteDiario, DatosCrearParteDiario } from '../interfaces/parteDiario.interface';

const CLAVE = 'partesDiarios';

export const usePartesDiarios = () => useQuery({ queryKey: [CLAVE], queryFn: parteDiarioService.listar });

export const useParteDiario = (id: number) =>
  useQuery({ queryKey: [CLAVE, id], queryFn: () => parteDiarioService.obtener(id), enabled: Number.isFinite(id) });

export function useCrearParteDiario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosCrearParteDiario) => parteDiarioService.crear(datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useActualizarParteDiario(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosActualizarParteDiario) => parteDiarioService.actualizar(id, datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useEliminarParteDiario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => parteDiarioService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}
