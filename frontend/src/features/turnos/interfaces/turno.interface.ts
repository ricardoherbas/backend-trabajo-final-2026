import type { DiaSemana } from '@/core/types/dia-semana.type';

export interface Turno {
  id: number;
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
  creado_en: string;
}
export interface DatosCrearTurno {
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  activo?: boolean;
}
export type DatosActualizarTurno = Partial<DatosCrearTurno>;
