export interface Tratamiento {
    id: number;
    paciente_id: number;
    medicamento_id: number;
    dosis: string;
    frecuencia: string;
    horario: string | null;
    desde: Date | null;
    hasta: Date | null;
    activa: boolean;
    creado_en: Date;
}