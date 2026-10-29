import axios from 'axios';
import { tokenStorage } from '@/core/auth/tokenStorage';

/** Singleton: una sola instancia de Axios para toda la app. */
export const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request: agrega el JWT (el backend espera "Authorization: Bearer <token>")
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.obtener();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: si el token venció o es inválido, se cierra la sesión.
let manejadorSesionExpirada: (() => void) | null = null;
export const registrarManejadorSesionExpirada = (fn: () => void) => {
  manejadorSesionExpirada = fn;
};

httpClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url: string = error.config?.url ?? '';
    const esLogin = url.includes('/auth/login');
    if (error.response?.status === 401 && !esLogin) {
      manejadorSesionExpirada?.();
    }
    return Promise.reject(error);
  },
);
