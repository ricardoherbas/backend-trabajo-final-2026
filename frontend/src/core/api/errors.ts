import axios from 'axios';
import type { ErrorApi } from '@/core/types/api.types';

/** Extrae el { mensaje } que devuelve el backend, o un texto genérico. */
export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError<ErrorApi>(error)) {
    if (error.response?.data?.mensaje) return error.response.data.mensaje;
    if (!error.response) return 'No se pudo conectar con el servidor';
  }
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado';
}
