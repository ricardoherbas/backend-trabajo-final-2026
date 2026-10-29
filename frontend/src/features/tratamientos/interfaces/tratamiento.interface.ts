import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';
import type { Medicamento } from '@/features/medicamentos/interfaces/medicamento.interface';

export interface Tratamiento {
  id: number;
  paciente_id: number;
  medicamento_id: number;
  dosis: string;
  frecuencia: string;
  horario: string | null;
  desde: string | null;
  hasta: string | null;
  activa: boolean;
  paciente?: Paciente;
  medicamento?: Medicamento;
}
export interface DatosCrearTratamiento {
  paciente_id: number;
  medicamento_id: number;
  dosis: string;
  frecuencia: string;
  horario?: string | null;
  desde?: string | null;
  hasta?: string | null;
  activa?: boolean;
}
export type DatosActualizarTratamiento = Partial<DatosCrearTratamiento>;
