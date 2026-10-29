import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { Modal } from '@/shared/components/ui/Modal';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import { vinculoFamiliarService, urlRegistroConCodigo } from '../services/vinculoFamiliar.service';
import { VinculoFormModal } from '../components/VinculoFormModal';
import type { VinculoFamiliar } from '../interfaces/vinculoFamiliar.interface';

export default function VinculosPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['vinculos'], queryFn: vinculoFamiliarService.listar });
  const formulario = useDisclosure();
  const [errorAlta, setErrorAlta] = useState<string | null>(null);
  const [verQr, setVerQr] = useState<VinculoFamiliar | null>(null);

  const crear = useMutation({
    mutationFn: vinculoFamiliarService.crear,
    onSuccess: (respuesta) => {
      qc.invalidateQueries({ queryKey: ['vinculos'] });
      formulario.cerrar();
      if (respuesta?.vinculo) setVerQr(respuesta.vinculo);
    },
    onError: (e) => setErrorAlta(obtenerMensajeError(e)),
  });

  const nombreFamiliar = (v: VinculoFamiliar) =>
    v.familiar?.persona ? `${v.familiar.persona.apellido}, ${v.familiar.persona.nombre}` : `Familiar #${v.familiar_id}`;

  return (
    <>
      <PageHeader
        titulo="Vínculos y códigos QR"
        descripcion="Cada vínculo genera un código de un solo uso para que el familiar cree su cuenta."
        accion={<Button onClick={() => { setErrorAlta(null); formulario.abrir(); }}>Nuevo vínculo</Button>}
      />
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={!!data && data.length === 0} textoVacio="Todavía no hay vínculos.">
          <DataTable
            filas={data ?? []}
            clave={(v) => v.id}
            columnas={[
              { titulo: 'Familiar', render: nombreFamiliar },
              { titulo: 'Paciente', render: (v) => (v.paciente ? nombreCompleto(v.paciente) : `Paciente #${v.paciente_id}`) },
              { titulo: 'Parentesco', render: (v) => v.parentesco },
              { titulo: 'Principal', render: (v) => (v.es_contacto_principal ? 'Sí' : 'No') },
              { titulo: 'Código', render: (v) => <Badge tono={v.codigo_usado ? 'neutro' : 'aviso'}>{v.codigo_usado ? 'Usado' : 'Disponible'}</Badge> },
            ]}
            acciones={(v) =>
              v.codigo_vinculacion && !v.codigo_usado ? (
                <Button variante="texto" chico onClick={() => setVerQr(v)}>Ver QR</Button>
              ) : null
            }
          />
        </StateView>
      </div>

      <VinculoFormModal
        abierto={formulario.abierto}
        enviando={crear.isPending}
        error={errorAlta}
        onCerrar={formulario.cerrar}
        onEnviar={(valores) => { setErrorAlta(null); crear.mutate(valores); }}
      />

      <Modal abierto={verQr !== null} titulo="Código de vinculación" onCerrar={() => setVerQr(null)}>
        {verQr?.codigo_vinculacion && (
          <div className="qr-caja">
            <QRCodeSVG value={urlRegistroConCodigo(verQr.codigo_vinculacion)} size={220} marginSize={2} />
            <p>El familiar escanea este código para abrir el registro con el código ya cargado.</p>
            <code>{verQr.codigo_vinculacion}</code>
            <Button variante="secundario" onClick={() => setVerQr(null)}>Cerrar</Button>
          </div>
        )}
      </Modal>
    </>
  );
}
