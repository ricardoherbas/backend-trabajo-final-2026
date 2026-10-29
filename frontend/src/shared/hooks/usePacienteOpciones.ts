import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pacienteService } from '@/features/pacientes/services/paciente.service';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';

export interface OpcionPaciente {
  id: number;
  etiqueta: string;
  activo: boolean;
}

/**
 * Los endpoints de tratamientos y pagos devuelven el paciente SIN su persona,
 * así que los nombres se resuelven con la lista de pacientes (misma cache
 * que la pantalla de pacientes). Solo administrador y secretaria pueden listarlos.
 */
export function usePacienteOpciones() {
  const consulta = useQuery({ queryKey: ['pacientes'], queryFn: pacienteService.listar, retry: false });

  const opciones = useMemo<OpcionPaciente[]>(
    () => (consulta.data ?? []).map((p) => ({ id: p.id, etiqueta: nombreCompleto(p), activo: p.activo })),
    [consulta.data],
  );
  const nombres = useMemo(() => new Map(opciones.map((o) => [o.id, o.etiqueta])), [opciones]);
  const nombreDe = useCallback((id: number): string => nombres.get(id) ?? `Paciente #${id}`, [nombres]);

  return { opciones, nombreDe, cargando: consulta.isLoading, error: consulta.error, disponible: consulta.isSuccess };
}
