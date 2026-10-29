import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarTratamiento, DatosCrearTratamiento, Tratamiento } from '../interfaces/tratamiento.interface';

export const tratamientoService = crearCrudApi<Tratamiento, DatosCrearTratamiento, DatosActualizarTratamiento>('tratamientos');
