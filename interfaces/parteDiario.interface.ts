export interface ParteDiario {
    id: number;
    asignacion_id: number;
    fecha: Date;
    animo: string | null;
    alimentacion: string | null;
    descanso: string | null;
    higiene: string | null;
    novedades: string | null;
    observaciones: string | null;
    creado_en: Date;
}