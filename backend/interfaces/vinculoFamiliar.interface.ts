export interface DatosCrearVinculo {
    familiar_id: number;
    paciente_id: number;
    parentesco: string;
    es_contacto_principal?: boolean;
}

export interface DatosActualizarVinculo {
    familiar_id?: number;
    paciente_id?: number;
    parentesco?: string;
    es_contacto_principal?: boolean;
}
