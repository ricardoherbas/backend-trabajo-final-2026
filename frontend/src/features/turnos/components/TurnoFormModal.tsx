import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { obtenerMensajeError } from '@/core/api/errors';
import { useActualizarTurno, useCrearTurno } from '../hooks/useTurnos';
import { formularioAPayload, turnoAFormulario } from '../adapters/turno.adapter';
import type { Turno } from '../interfaces/turno.interface';
import type { TurnoForm as TurnoFormValues } from '../validators/turno.validator';
import { TurnoForm } from './TurnoForm';

interface Props {
  abierto: boolean;
  /** null = alta, un turno = edición. */
  turno: Turno | null;
  onCerrar: () => void;
}

export function TurnoFormModal({ abierto, turno, onCerrar }: Props) {
  const crear = useCrearTurno();
  const actualizar = useActualizarTurno();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const cerrar = () => {
    setErrorApi(null);
    onCerrar();
  };

  const enviar = (valores: TurnoFormValues) => {
    setErrorApi(null);
    const opciones = { onSuccess: cerrar, onError: (e: unknown) => setErrorApi(obtenerMensajeError(e)) };
    const datos = formularioAPayload(valores);
    if (turno) actualizar.mutate({ id: turno.id, datos }, opciones);
    else crear.mutate(datos, opciones);
  };

  return (
    <Modal abierto={abierto} titulo={turno ? 'Editar turno' : 'Nuevo turno'} onCerrar={cerrar}>
      {/* El form solo existe mientras el modal está abierto: así arranca limpio cada vez. */}
      <TurnoForm
        valoresIniciales={turno ? turnoAFormulario(turno) : undefined}
        enviando={crear.isPending || actualizar.isPending}
        error={errorApi}
        onEnviar={enviar}
        onCancelar={cerrar}
      />
    </Modal>
  );
}
