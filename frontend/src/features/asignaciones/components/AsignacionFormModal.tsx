import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { StateView } from '@/shared/components/StateView';
import { obtenerMensajeError } from '@/core/api/errors';
import { useTurnos } from '@/features/turnos/hooks/useTurnos';
import { usePacientes } from '@/features/pacientes/hooks/usePacientes';
import { useActualizarAsignacion, useCrearAsignacion } from '../hooks/useAsignaciones';
import { useCuidadorasLista } from '../hooks/useNombres';
import { asignacionAFormulario, formularioAPayload } from '../adapters/asignacion.adapter';
import type { Asignacion } from '../interfaces/asignacion.interface';
import type { AsignacionForm as AsignacionFormValues } from '../validators/asignacion.validator';
import { AsignacionForm } from './AsignacionForm';

interface Props {
  abierto: boolean;
  /** null = alta, una asignación = edición. */
  asignacion: Asignacion | null;
  onCerrar: () => void;
}

export function AsignacionFormModal({ abierto, asignacion, onCerrar }: Props) {
  const crear = useCrearAsignacion();
  const actualizar = useActualizarAsignacion();
  const turnos = useTurnos();
  const pacientes = usePacientes();
  const cuidadoras = useCuidadorasLista();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const cerrar = () => {
    setErrorApi(null);
    onCerrar();
  };

  const enviar = (valores: AsignacionFormValues) => {
    setErrorApi(null);
    const opciones = { onSuccess: cerrar, onError: (e: unknown) => setErrorApi(obtenerMensajeError(e)) };
    const datos = formularioAPayload(valores);
    if (asignacion) actualizar.mutate({ id: asignacion.id, datos }, opciones);
    else crear.mutate(datos, opciones);
  };

  return (
    <Modal abierto={abierto} titulo={asignacion ? 'Editar asignación' : 'Nueva asignación'} onCerrar={cerrar}>
      {/*
        El formulario se monta recién cuando las listas llegaron. Si no, al editar el
        <select> intentaría marcar un valor cuyas <option> todavía no existen.
        Que falle la lista de cuidadoras no bloquea: el form pide el ID a mano.
      */}
      <StateView
        cargando={turnos.isLoading || pacientes.isLoading || cuidadoras.isLoading}
        error={turnos.error ?? pacientes.error}
      >
        <AsignacionForm
          opciones={{ turnos: turnos.data ?? [], pacientes: pacientes.data ?? [], cuidadoras: cuidadoras.data ?? null }}
          valoresIniciales={asignacion ? asignacionAFormulario(asignacion) : undefined}
          enviando={crear.isPending || actualizar.isPending}
          error={errorApi}
          onEnviar={enviar}
          onCancelar={cerrar}
        />
      </StateView>
    </Modal>
  );
}
