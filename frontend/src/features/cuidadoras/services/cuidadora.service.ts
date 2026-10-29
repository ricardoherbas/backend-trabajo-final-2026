import { crearCrudApi } from '@/core/api/crudApi';
import type { Cuidadora, DatosCrearCuidadora } from '../interfaces/cuidadora.interface';

export const cuidadoraService = crearCrudApi<Cuidadora, DatosCrearCuidadora>('cuidadoras');
