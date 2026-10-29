import { ListadoSoloLectura } from '@/shared/components/ListadoSoloLectura';
import { formatFecha } from '@/shared/utils/formatFecha';
import { parteDiarioService } from '../services/parteDiario.service';

export default function PartesDiariosPage() {
  return (
    <ListadoSoloLectura
      titulo="Partes diarios"
      descripcion="Registro diario de cada paciente."
      claveQuery="partesDiarios"
      cargar={parteDiarioService.listar}
      columnas={[
        { titulo: 'Fecha', render: (p) => formatFecha(p.fecha) },
        { titulo: 'Asignación', render: (p) => `#${p.asignacion_id}` },
        { titulo: 'Ánimo', render: (p) => p.animo ?? '—' },
        { titulo: 'Alimentación', render: (p) => p.alimentacion ?? '—' },
        { titulo: 'Novedades', render: (p) => p.novedades ?? '—' },
      ]}
    />
  );
}
