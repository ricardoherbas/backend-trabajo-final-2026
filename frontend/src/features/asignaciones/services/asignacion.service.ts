import { crearCrudApi } from '@/core/api/crudApi';
import type { Asignacion, DatosActualizarAsignacion, DatosCrearAsignacion } from '../interfaces/asignacion.interface';

export const asignacionService = crearCrudApi<Asignacion, DatosCrearAsignacion, DatosActualizarAsignacion>('asignaciones');
