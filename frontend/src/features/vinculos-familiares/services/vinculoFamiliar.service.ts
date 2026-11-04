import { crearCrudApi } from '@/core/api/crudApi';
import { httpClient } from '@/core/api/httpClient';
import type {
  DatosActualizarVinculo,
  DatosCrearVinculo,
  RespuestaCodigoVinculo,
  VinculoFamiliar,
} from '../interfaces/vinculoFamiliar.interface';

const crud = crearCrudApi<VinculoFamiliar, DatosCrearVinculo, DatosActualizarVinculo>('vinculosFamiliares');

export const vinculoFamiliarService = {
  ...crud,

  /** admin/secretaria; solo vinculos activos con codigo sin usar. Invalida el codigo anterior. */
  regenerarCodigo: async (id: number): Promise<RespuestaCodigoVinculo> =>
    (await httpClient.patch(`/vinculosFamiliares/${id}/regenerar-codigo`)).data,

  /** solo administrador. */
  activar: async (id: number) => (await httpClient.patch(`/vinculosFamiliares/${id}/activar`)).data,
  desactivar: async (id: number) => (await httpClient.patch(`/vinculosFamiliares/${id}/desactivar`)).data,
};

/** URL que se codifica en el QR: abre el registro de familiar con el código. */
export const urlRegistroConCodigo = (codigo: string): string =>
  `${window.location.origin}/registro?codigo=${encodeURIComponent(codigo)}`;