import { useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { Button } from '@/shared/components/ui/Button';
import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { AltaPersonaModal } from '@/features/personas/components/AltaPersonaModal';
import { cuidadoraService } from '../services/cuidadora.service';

export default function CuidadorasPage() {
  const { rol } = useAuth();
  const puedeCrear = tieneRol(rol, ['administrador', 'secretaria']);
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <ListadoSoloLectura
        titulo="Cuidadoras"
        descripcion="Personal de cuidado registrado."
        claveQuery="cuidadoras"
        cargar={cuidadoraService.listar}
        accion={puedeCrear ? <Button onClick={() => setAbierto(true)}>Nueva cuidadora</Button> : undefined}
        columnas={[
          { titulo: 'Nombre', render: (c) => (c.persona ? `${c.persona.apellido}, ${c.persona.nombre}` : `Persona #${c.persona_id}`) },
          { titulo: 'DNI', render: (c) => c.persona?.dni ?? '—' },
          { titulo: 'Teléfono', render: (c) => c.persona?.telefono ?? '—' },
        ]}
      />
      {puedeCrear && abierto && (
        <AltaPersonaModal
          abierto
          titulo="Nueva cuidadora"
          nombrePerfil="cuidadora"
          claveQuery="cuidadoras"
          crearPerfil={(personaId) => cuidadoraService.crear({ persona_id: personaId })}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </>
  );
}