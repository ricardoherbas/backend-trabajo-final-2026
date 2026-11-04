import { useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { Button } from '@/shared/components/ui/Button';
import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { AltaPersonaModal } from '@/features/personas/components/AltaPersonaModal';
import { familiarService } from '../services/familiar.service';

export default function FamiliaresPage() {
  const { rol } = useAuth();
  const puedeCrear = tieneRol(rol, ['administrador', 'secretaria']);
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <ListadoSoloLectura
        titulo="Familiares"
        descripcion="Familiares registrados en el sistema."
        claveQuery="familiares"
        cargar={familiarService.listar}
        accion={puedeCrear ? <Button onClick={() => setAbierto(true)}>Nuevo familiar</Button> : undefined}
        columnas={[
          { titulo: 'Nombre', render: (f) => (f.persona ? `${f.persona.apellido}, ${f.persona.nombre}` : `Persona #${f.persona_id}`) },
          { titulo: 'DNI', render: (f) => f.persona?.dni ?? '—' },
          { titulo: 'Teléfono', render: (f) => f.persona?.telefono ?? '—' },
        ]}
      />
      {puedeCrear && abierto && (
        <AltaPersonaModal
          abierto
          titulo="Nuevo familiar"
          nombrePerfil="familiar"
          claveQuery="familiares"
          crearPerfil={(personaId) => familiarService.crear({ persona_id: personaId })}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </>
  );
}