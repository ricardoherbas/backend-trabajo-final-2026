import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePacientes } from '@/features/pacientes/hooks/usePacientes';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import { cuidadoraService } from '@/features/cuidadoras/services/cuidadora.service';
import type { Nombres } from '../adapters/asignacion.adapter';

/**
 * Lista de cuidadoras. GET /cuidadoras es solo de administrador, por eso retry:false:
 * con otro rol falla una vez y listo (el front cae a mostrar "Cuidadora #id").
 * Usa la misma clave ['cuidadoras'] que el listado de cuidadoras: comparten caché.
 */
export const useCuidadorasLista = () =>
  useQuery({ queryKey: ['cuidadoras'], queryFn: cuidadoraService.listar, retry: false });

/**
 * El back NO anida la persona dentro de asignacion.paciente ni asignacion.cuidadora,
 * así que los nombres se resuelven cruzando con las listas de pacientes y cuidadoras.
 * Si el rol no puede cargar alguna lista, se muestra el ID como respaldo.
 */
export function useNombres(): Nombres {
  const pacientes = usePacientes();
  const cuidadoras = useCuidadorasLista();

  const porPaciente = useMemo(
    () => new Map((pacientes.data ?? []).map((p) => [p.id, nombreCompleto(p)])),
    [pacientes.data],
  );
  const porCuidadora = useMemo(
    () =>
      new Map(
        (cuidadoras.data ?? []).map((c) => [
          c.id,
          c.persona ? `${c.persona.apellido}, ${c.persona.nombre}` : `Cuidadora #${c.id}`,
        ]),
      ),
    [cuidadoras.data],
  );

  return {
    paciente: (id) => porPaciente.get(id) ?? `Paciente #${id}`,
    cuidadora: (id) => porCuidadora.get(id) ?? `Cuidadora #${id}`,
  };
}
