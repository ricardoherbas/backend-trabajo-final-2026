import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicamentoService } from '../services/medicamento.service';
import type { DatosCrearMedicamento } from '../interfaces/medicamento.interface';

const CLAVE = 'medicamentos';

export const useMedicamentos = () => useQuery({ queryKey: [CLAVE], queryFn: medicamentoService.listar });

/** Alta (sin id) o edición (con id). El backend exige todos los campos en ambos casos. */
export function useGuardarMedicamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: DatosCrearMedicamento }) =>
      id === undefined ? medicamentoService.crear(datos) : medicamentoService.actualizar(id, datos),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}

export function useEliminarMedicamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicamentoService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CLAVE] }),
  });
}
