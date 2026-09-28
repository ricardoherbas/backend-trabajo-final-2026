export interface DatosCrearTratamiento {
    paciente_id: number;
    medicamento_id: number;
    dosis: string;
    frecuencia: string;
    horario?: string | null;
    desde?: Date | null;
    hasta?: Date | null;
    activa?: boolean;
}

export interface DatosActualizarTratamiento {
    paciente_id?: number;
    medicamento_id?: number;
    dosis?: string;
    frecuencia?: string;
    horario?: string | null;
    desde?: Date | null;
    hasta?: Date | null;
    activa?: boolean;
}