import { hoyISO } from '@/shared/utils/formatFecha';
import type { EstadoPago } from '@/core/types/estado-pago.type';
import type { MedioPago } from '@/core/types/medio-pago.type';
import type { DatosCrearPago, Pago } from '../interfaces/pago.interface';
import type { PagoForm } from '../validators/pago.validator';

export const ETIQUETA_MEDIO_PAGO: Record<MedioPago, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  qr: 'Código QR',
  obra_social: 'Obra social',
};

export const ETIQUETA_ESTADO_PAGO: Record<EstadoPago, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  vencido: 'Vencido',
};

export const TONO_ESTADO_PAGO: Record<EstadoPago, 'ok' | 'aviso' | 'peligro'> = {
  pagado: 'ok',
  pendiente: 'aviso',
  vencido: 'peligro',
};

/** '2026-03-01' → '03/2026' */
export const formatPeriodo = (periodo: string): string => {
  const [anio, mes] = periodo.slice(0, 7).split('-');
  return anio && mes ? `${mes}/${anio}` : periodo;
};

/**
 * Formulario → payload. El período se maneja por mes (<input type="month">) y
 * se guarda siempre como día 1, así no se duplican períodos del mismo mes.
 * Si el pago está "pagado" y no hay fecha, se usa la de hoy.
 */
export const formularioAPayload = (f: PagoForm): DatosCrearPago => ({
  paciente_id: f.paciente_id,
  periodo: `${f.periodo}-01`,
  monto: f.monto,
  estado: f.estado,
  medio_pago: f.medio_pago ? f.medio_pago : null,
  fecha_pago: f.fecha_pago || (f.estado === 'pagado' ? hoyISO() : null),
  observaciones: f.observaciones?.trim() || null,
});

export const pagoAFormulario = (p: Pago): PagoForm => ({
  paciente_id: p.paciente_id,
  periodo: p.periodo.slice(0, 7),
  monto: Number(p.monto),
  estado: p.estado,
  medio_pago: p.medio_pago ?? '',
  fecha_pago: p.fecha_pago?.slice(0, 10) ?? '',
  observaciones: p.observaciones ?? '',
});

/** Pago existente → payload completo (el PUT del backend exige paciente, período y monto). */
export const pagoAPayload = (p: Pago): DatosCrearPago => ({
  paciente_id: p.paciente_id,
  periodo: p.periodo.slice(0, 10),
  monto: Number(p.monto),
  estado: p.estado,
  medio_pago: p.medio_pago,
  fecha_pago: p.fecha_pago?.slice(0, 10) ?? null,
  observaciones: p.observaciones,
});
