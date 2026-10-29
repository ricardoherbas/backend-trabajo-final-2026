import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosCrearFamiliar, Familiar } from '../interfaces/familiar.interface';

export const familiarService = crearCrudApi<Familiar, DatosCrearFamiliar>('familiares');
