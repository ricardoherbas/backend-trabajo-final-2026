import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { Badge } from '@/shared/components/ui/Badge';
import { turnoService } from '../services/turno.service';

export default function TurnosPage() {
  return (
    <ListadoSoloLectura
      titulo="Turnos"
      descripcion="Franjas horarias de atención."
      claveQuery="turnos"
      cargar={turnoService.listar}
      columnas={[
        { titulo: 'Día', render: (t) => t.dia_semana },
        { titulo: 'Desde', render: (t) => t.hora_inicio.slice(0, 5) },
        { titulo: 'Hasta', render: (t) => t.hora_fin.slice(0, 5) },
        { titulo: 'Estado', render: (t) => <Badge tono={t.activo ? 'ok' : 'neutro'}>{t.activo ? 'Activo' : 'Inactivo'}</Badge> },
      ]}
    />
  );
}
