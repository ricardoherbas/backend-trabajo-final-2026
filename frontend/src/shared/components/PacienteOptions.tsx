import type { OpcionPaciente } from '@/shared/hooks/usePacienteOpciones';

/** <option>s de pacientes para usar dentro de un <FormSelect>. */
export function PacienteOptions({ opciones }: { opciones: OpcionPaciente[] }) {
  return (
    <>
      <option value="" disabled>Elegí un paciente</option>
      {opciones.map((o) => (
        <option key={o.id} value={o.id}>{o.etiqueta}{o.activo ? '' : ' (inactivo)'}</option>
      ))}
    </>
  );
}
