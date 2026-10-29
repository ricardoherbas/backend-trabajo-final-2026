import { useCallback, useState } from 'react';

export function useDisclosure(inicial = false) {
  const [abierto, setAbierto] = useState(inicial);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);
  return { abierto, abrir, cerrar };
}
