import { crearCrudApi } from '@/core/api/crudApi';
import type { DatosActualizarTurno, DatosCrearTurno, Turno } from '../interfaces/turno.interface';

export const turnoService = crearCrudApi<Turno, DatosCrearTurno, DatosActualizarTurno>('turnos');
