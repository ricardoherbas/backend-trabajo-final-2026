export interface Turno {
    id: number;
    dia_semana:
        | 'lunes'
        | 'martes'
        | 'miércoles'
        | 'jueves'
        | 'viernes'
        | 'sábado'
        | 'domingo';
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
    creado_en: Date;
}