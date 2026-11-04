import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePacientes } from '@/features/pacientes/hooks/usePacientes';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import { cuidadoraService } from '@/features/cuidadoras/services/cuidadora.service';
import { nombrePersona, type Nombres } from '../adapters/asignacion.adapter';

/**
 * Lista de cuidadoras. GET /cuidadoras es solo de administrador, por eso retry:false:
 * con otro rol falla una vez y listo (el front cae a mostrar "Cuidadora #id").
 * Usa la misma clave ['cuidadoras'] que el listado de cuidadoras: comparten caché.
 */
export const useCuidadorasLista = () =>
  useQuery({ queryKey: ['cuidadoras'], queryFn: cuidadoraService.listar, retry: false });

/**
 * El back anida la persona (solo nombre y apellido) en asignacion.paciente y
 * asignacion.cuidadora: se usa primero. Si no viene, se resuelve por ID cruzando
 * con las listas de pacientes y cuidadoras, y si el rol no puede cargarlas se
 * muestra "Paciente #id" / "Cuidadora #id".
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
    paciente: (id, persona) => nombrePersona(persona) ?? porPaciente.get(id) ?? `Paciente #${id}`,
    cuidadora: (id, persona) => nombrePersona(persona) ?? porCuidadora.get(id) ?? `Cuidadora #${id}`,
  };
}