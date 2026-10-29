import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { familiarService } from '../services/familiar.service';

export default function FamiliaresPage() {
  return (
    <ListadoSoloLectura
      titulo="Familiares"
      descripcion="Familiares registrados en el sistema."
      claveQuery="familiares"
      cargar={familiarService.listar}
      columnas={[
        { titulo: 'Nombre', render: (f) => (f.persona ? `${f.persona.apellido}, ${f.persona.nombre}` : `Persona #${f.persona_id}`) },
        { titulo: 'DNI', render: (f) => f.persona?.dni ?? '—' },
        { titulo: 'Teléfono', render: (f) => f.persona?.telefono ?? '—' },
      ]}
    />
  );
}
