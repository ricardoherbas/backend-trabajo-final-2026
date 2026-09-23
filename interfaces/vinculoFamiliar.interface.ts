export interface VinculoFamiliar {
    id: number;
    familiar_id: number;
    paciente_id: number;
    parentesco: string;
    es_contacto_principal: boolean;
    codigo_vinculacion: string | null;
    codigo_usado: boolean;
    creado_en: Date;
}