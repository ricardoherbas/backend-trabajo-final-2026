export interface DatosCrearPaciente {
    persona_id: number;
    direccion?: string | null;
    obra_social?: string | null;
    observaciones?: string | null;
}

export interface DatosActualizarPaciente {
    direccion?: string | null;
    obra_social?: string | null;
    observaciones?: string | null;
    activo?: boolean;
}