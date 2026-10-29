import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface Props {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({ abierto, titulo, mensaje, textoConfirmar = 'Eliminar', cargando, onConfirmar, onCancelar }: Props) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}>
      <p>{mensaje}</p>
      <div className="form-acciones">
        <Button variante="peligro" onClick={onConfirmar} disabled={cargando}>{cargando ? 'Procesando…' : textoConfirmar}</Button>
        <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>
      </div>
    </Modal>
  );
}
