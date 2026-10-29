import type { DatosCrearParteDiario, ParteDiario } from '../interfaces/parteDiario.interface';
import type { ParteDiarioForm } from '../validators/parteDiario.validator';

/** Fecha de hoy como 'YYYY-MM-DD' en hora LOCAL (toISOString() usa UTC y de noche daría el día siguiente). */
export const hoy = (): string => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

const aNull = (v?: string): string | null => v?.trim() || null; // '' → null

export const formularioAPayload = (f: ParteDiarioForm): DatosCrearParteDiario => ({
  asignacion_id: f.asignacion_id,
  fecha: f.fecha,
  animo: aNull(f.animo),
  alimentacion: aNull(f.alimentacion),
  descanso: aNull(f.descanso),
  higiene: aNull(f.higiene),
  novedades: aNull(f.novedades),
  observaciones: aNull(f.observaciones),
});

export const parteAFormulario = (p: ParteDiario): ParteDiarioForm => ({
  asignacion_id: p.asignacion_id,
  fecha: p.fecha.slice(0, 10),
  animo: p.animo ?? '',
  alimentacion: p.alimentacion ?? '',
  descanso: p.descanso ?? '',
  higiene: p.higiene ?? '',
  novedades: p.novedades ?? '',
  observaciones: p.observaciones ?? '',
});
