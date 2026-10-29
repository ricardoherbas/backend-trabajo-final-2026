import type { Asignacion } from '@/features/asignaciones/interfaces/asignacion.interface';

export interface ParteDiario {
  id: number;
  asignacion_id: number;
  fecha: string;
  animo: string | null;
  alimentacion: string | null;
  descanso: string | null;
  higiene: string | null;
  novedades: string | null;
  observaciones: string | null;
  creado_en: string;
  asignacion?: Asignacion;
}
export interface DatosCrearParteDiario {
  asignacion_id: number;
  fecha: string;
  animo?: string | null;
  alimentacion?: string | null;
  descanso?: string | null;
  higiene?: string | null;
  novedades?: string | null;
  observaciones?: string | null;
}
export type DatosActualizarParteDiario = Partial<DatosCrearParteDiario>;
