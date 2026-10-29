import type { Turno } from '@/features/turnos/interfaces/turno.interface';
import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';
import type { Cuidadora } from '@/features/cuidadoras/interfaces/cuidadora.interface';

export interface Asignacion {
  id: number;
  turno_id: number;
  cuidador_id: number; // el backend usa "cuidador_id"; el include se llama "cuidadora"
  paciente_id: number;
  activo: boolean;
  creado_en: string;
  turno?: Turno;
  cuidadora?: Cuidadora;
  paciente?: Paciente;
}
export interface DatosCrearAsignacion {
  turno_id: number;
  cuidador_id: number;
  paciente_id: number;
  activo?: boolean;
}
export type DatosActualizarAsignacion = Partial<DatosCrearAsignacion>;
