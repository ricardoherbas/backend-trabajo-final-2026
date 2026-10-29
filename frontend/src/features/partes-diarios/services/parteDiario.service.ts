import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarParteDiario, DatosCrearParteDiario, ParteDiario } from '../interfaces/parteDiario.interface';

export const parteDiarioService = crearCrudApi<ParteDiario, DatosCrearParteDiario, DatosActualizarParteDiario>('partesDiarios');
