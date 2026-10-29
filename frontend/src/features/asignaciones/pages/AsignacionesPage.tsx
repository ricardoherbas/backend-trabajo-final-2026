import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { Badge } from '@/shared/components/ui/Badge';
import { asignacionService } from '../services/asignacion.service';

export default function AsignacionesPage() {
  return (
    <ListadoSoloLectura
      titulo="Asignaciones"
      descripcion="Qué cuidadora atiende a qué paciente en cada turno."
      claveQuery="asignaciones"
      cargar={asignacionService.listar}
      columnas={[
        { titulo: 'Paciente', render: (a) => `Paciente #${a.paciente_id}` },
        { titulo: 'Cuidadora', render: (a) => `Cuidadora #${a.cuidador_id}` },
        { titulo: 'Turno', render: (a) => (a.turno ? `${a.turno.dia_semana} ${a.turno.hora_inicio.slice(0, 5)}–${a.turno.hora_fin.slice(0, 5)}` : `Turno #${a.turno_id}`) },
        { titulo: 'Estado', render: (a) => <Badge tono={a.activo ? 'ok' : 'neutro'}>{a.activo ? 'Activa' : 'Inactiva'}</Badge> },
      ]}
    />
  );
}
