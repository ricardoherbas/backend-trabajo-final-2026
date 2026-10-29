import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarPago, DatosCrearPago, Pago } from '../interfaces/pago.interface';

export const pagoService = crearCrudApi<Pago, DatosCrearPago, DatosActualizarPago>('pagos');
