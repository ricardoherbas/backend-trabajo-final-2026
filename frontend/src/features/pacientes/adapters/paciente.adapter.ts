import type { Paciente, DatosActualizarPaciente } from '../interfaces/paciente.interface';
import type { PacienteForm } from '../validators/paciente.validator';

/** Une persona + paciente en datos listos para mostrar. */
export const nombreCompleto = (p: Paciente): string =>
  p.persona ? `${p.persona.apellido}, ${p.persona.nombre}` : `Persona #${p.persona_id}`;

/** Convierte el formulario al payload del backend ('' → null). */
export const formularioAPayload = (f: PacienteForm): DatosActualizarPaciente => ({
  persona_id: f.persona_id,
  direccion: f.direccion?.trim() || null,
  obra_social: f.obra_social?.trim() || null,
  observaciones: f.observaciones?.trim() || null,
  ...(f.activo !== undefined ? { activo: f.activo } : {}),
});

export const pacienteAFormulario = (p: Paciente): PacienteForm => ({
  persona_id: p.persona_id,
  direccion: p.direccion ?? '',
  obra_social: p.obra_social ?? '',
  observaciones: p.observaciones ?? '',
  activo: p.activo,
});
