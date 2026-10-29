const CLAVE = 'token';

export const tokenStorage = {
  obtener: (): string | null => localStorage.getItem(CLAVE),
  guardar: (token: string): void => localStorage.setItem(CLAVE, token),
  borrar: (): void => localStorage.removeItem(CLAVE),
};
