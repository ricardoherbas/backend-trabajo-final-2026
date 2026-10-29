import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarVinculo, DatosCrearVinculo, VinculoFamiliar } from '../interfaces/vinculoFamiliar.interface';

export const vinculoFamiliarService = crearCrudApi<VinculoFamiliar, DatosCrearVinculo, DatosActualizarVinculo>('vinculosFamiliares');

/** URL que se codifica en el QR: abre el registro de familiar con el código. */
export const urlRegistroConCodigo = (codigo: string): string =>
  `${window.location.origin}/registro?codigo=${encodeURIComponent(codigo)}`;
