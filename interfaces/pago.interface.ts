import {EstadoPago} from '../types/estado-pago.type';
import {MedioPago} from '../types/medio-pago.type';

export interface DatosCrearPago {
    paciente_id: number;
    periodo: Date;
    monto: number;
    fecha_pago?: Date | null;
    medio_pago?: MedioPago | null;
    observaciones?: string | null;
    estado?: EstadoPago;
}

export interface DatosActualizarPago {
    paciente_id?: number;
    periodo?: Date;
    monto?: number;
    fecha_pago?: Date | null;
    medio_pago?: MedioPago | null;
    observaciones?: string | null;
    estado?: EstadoPago;
}