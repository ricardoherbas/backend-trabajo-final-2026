import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { cuidadoraService } from '../services/cuidadora.service';

export default function CuidadorasPage() {
  return (
    <ListadoSoloLectura
      titulo="Cuidadoras"
      descripcion="Personal de cuidado registrado."
      claveQuery="cuidadoras"
      cargar={cuidadoraService.listar}
      columnas={[
        { titulo: 'Nombre', render: (c) => (c.persona ? `${c.persona.apellido}, ${c.persona.nombre}` : `Persona #${c.persona_id}`) },
        { titulo: 'DNI', render: (c) => c.persona?.dni ?? '—' },
        { titulo: 'Teléfono', render: (c) => c.persona?.telefono ?? '—' },
      ]}
    />
  );
}
