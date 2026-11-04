import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { obtenerMensajeError } from '@/core/api/errors';
import type { DatosCrearPersona } from '../interfaces/persona.interface';
import { personaService } from '../services/persona.service';

interface Opciones {
  /** "paciente", "familiar", "cuidadora": se usa en el mensaje de error. */
  nombrePerfil: string;
  /** Clave de react-query del listado a refrescar. */
  claveQuery: string;
  alExito: () => void;
}

/**
 * Alta en dos pasos: 1) POST /personas, 2) crear el perfil con ese persona_id.
 * Si el paso 2 falla, la persona ya existe: se guarda su id y el reintento salta
 * el paso 1, así no se duplica (el DNI ya registrado daría 409).
 */
export function useAltaPersonaPerfil({ nombrePerfil, claveQuery, alExito }: Opciones) {
  const qc = useQueryClient();
  const personaRef = useRef<number | null>(null);
  const [personaId, setPersonaId] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (persona: DatosCrearPersona, crearPerfil: (personaId: number) => Promise<unknown>) => {
    setEnviando(true);
    setError(null);
    try {
      if (personaRef.current === null) {
        const { persona: creada } = await personaService.crear(persona);
        personaRef.current = creada.id;
        setPersonaId(creada.id);
      }
      await crearPerfil(personaRef.current);
      await qc.invalidateQueries({ queryKey: [claveQuery] });
      alExito();
    } catch (e) {
      const mensaje = obtenerMensajeError(e);
      setError(
        personaRef.current !== null
          ? `Se guardaron los datos personales, pero no se pudo crear el ${nombrePerfil}: ${mensaje}. Podés reintentar sin duplicar la persona.`
          : mensaje,
      );
    } finally {
      setEnviando(false);
    }
  };

  return { enviar, enviando, error, personaId };
}