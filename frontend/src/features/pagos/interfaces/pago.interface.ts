import type { EstadoPago } from '@/core/types/estado-pago.type';
import type { MedioPago } from '@/core/types/medio-pago.type';
import type { Paciente } from '@/features/pacientes/interfaces/paciente.interface';

export interface Pago {
  id: number;
  paciente_id: number;
  periodo: string;
  monto: number | string;
  fecha_pago: string | null;
  medio_pago: MedioPago | null;
  estado: EstadoPago;
  observaciones: string | null;
  paciente?: Paciente;
}
export interface DatosCrearPago {
  paciente_id: number;
  periodo: string;
  monto: number;
  fecha_pago?: string | null;
  medio_pago?: MedioPago | null;
  observaciones?: string | null;
  estado?: EstadoPago;
}
export type DatosActualizarPago = Partial<DatosCrearPago>;
