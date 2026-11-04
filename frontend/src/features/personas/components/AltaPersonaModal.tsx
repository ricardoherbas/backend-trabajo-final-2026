import { Modal } from '@/shared/components/ui/Modal';
import { useAltaPersonaPerfil } from '../hooks/useAltaPersonaPerfil';
import { PersonaForm } from './PersonaForm';

interface Props {
  abierto: boolean;
  titulo: string;
  nombrePerfil: string;
  claveQuery: string;
  /** Crea el perfil (familiar, cuidadora…) con el persona_id recién creado. */
  crearPerfil: (personaId: number) => Promise<unknown>;
  onCerrar: () => void;
}

/** Alta de persona + perfil en un modal. Sirve para familiares y cuidadoras. */
export function AltaPersonaModal({ abierto, titulo, nombrePerfil, claveQuery, crearPerfil, onCerrar }: Props) {
  const alta = useAltaPersonaPerfil({ nombrePerfil, claveQuery, alExito: onCerrar });
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCerrar}>
      <PersonaForm
        enviando={alta.enviando}
        error={alta.error}
        personaCreadaId={alta.personaId}
        textoEnviar={`Guardar ${nombrePerfil}`}
        onEnviar={(persona) => alta.enviar(persona, crearPerfil)}
        onCancelar={onCerrar}
      />
    </Modal>
  );
}