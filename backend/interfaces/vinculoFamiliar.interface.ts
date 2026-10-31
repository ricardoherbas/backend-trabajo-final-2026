export interface DatosCrearVinculo {
    familiar_id: number;
    paciente_id: number;
    parentesco: string;
    es_contacto_principal?: boolean;
}

export interface DatosActualizarVinculo {
    parentesco?: string;
    es_contacto_principal?: boolean;
}