export interface DatosCrearAsignacion {
    turno_id: number;
    cuidador_id: number;
    paciente_id: number;
    activo?: boolean;
}

export interface DatosActualizarAsignacion {
    turno_id?: number;
    cuidador_id?: number;
    paciente_id?: number;
    activo?: boolean;
}