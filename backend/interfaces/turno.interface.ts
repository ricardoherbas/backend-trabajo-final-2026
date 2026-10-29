import {DiaSemana} from '../types/dia-semana.type';

export interface DatosCrearTurno {
    dia_semana: DiaSemana;
    hora_inicio: string;
    hora_fin: string;
    activo?: boolean;
}

export interface DatosActualizarTurno {
    dia_semana?: DiaSemana;
    hora_inicio?: string;
    hora_fin?: string;
    activo?: boolean;
}
