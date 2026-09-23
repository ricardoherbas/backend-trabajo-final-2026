export interface Pago {
    id: number;
    paciente_id: number;
    periodo: Date;
    monto: number;
    fecha_pago: Date | null;
    medio_pago:
        | 'efectivo'
        | 'tarjeta'
        | 'transferencia'
        | 'qr'
        | 'obra_social'
        | null;
    estado: 'pendiente' | 'pagado' | 'vencido';
    observaciones: string | null;
    creado_en: Date;
}