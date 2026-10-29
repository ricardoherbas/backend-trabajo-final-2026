import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarPaciente, DatosCrearPaciente, Paciente } from '../interfaces/paciente.interface';

export const pacienteService = crearCrudApi<Paciente, DatosCrearPaciente, DatosActualizarPaciente>('pacientes');
