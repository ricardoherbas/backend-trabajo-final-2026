export interface Asignacion {
    id: number;
    turno_id: number;
    cuidador_id: number;
    paciente_id: number;
    activo: boolean;
    creado_en: Date;
}