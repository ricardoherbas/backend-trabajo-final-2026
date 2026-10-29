import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarMedicamento, DatosCrearMedicamento, Medicamento } from '../interfaces/medicamento.interface';

export const medicamentoService = crearCrudApi<Medicamento, DatosCrearMedicamento, DatosActualizarMedicamento>('medicamentos');
