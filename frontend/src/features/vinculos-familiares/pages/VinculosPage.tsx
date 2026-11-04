import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Modal } from '@/shared/components/ui/Modal';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatFecha } from '@/shared/utils/formatFecha';
import { nombreCompleto } from '@/features/pacientes/adapters/paciente.adapter';
import { vinculoFamiliarService, urlRegistroConCodigo } from '../services/vinculoFamiliar.service';
import { VinculoFormModal } from '../components/VinculoFormModal';
import type { VinculoFamiliar } from '../interfaces/vinculoFamiliar.interface';

type Tono = 'ok' | 'aviso' | 'peligro' | 'neutro';

/** Estado del vínculo. El orden importa: primero activo, después usado, después vencimiento. */
function estadoVinculo(v: VinculoFamiliar): { texto: string; tono: Tono } {
  if (!v.activo) return { texto: 'Inactivo', tono: 'neutro' };
  if (v.codigo_usado) return { texto: 'Usado', tono: 'neutro' };
  if (new Date(v.expira_en).getTime() < Date.now()) return { texto: 'Vencido', tono: 'peligro' };
  return { texto: 'Disponible', tono: 'ok' };
}

/** "Generar nuevo QR": vínculo activo y código sin usar, aunque ya haya vencido. */
const puedeRegenerar = (v: VinculoFamiliar) => v.activo && !v.codigo_usado;

interface CodigoVisible {
  codigo: string;
  expira_en: string;
}

export default function VinculosPage() {
  const qc = useQueryClient();
  const { rol } = useAuth();
  const esAdmin = tieneRol(rol, ['administrador']); // activar/desactivar: solo administrador
  const { data, isLoading, error } = useQuery({ queryKey: ['vinculos'], queryFn: vinculoFamiliarService.listar });
  const formulario = useDisclosure();
  const [errorAlta, setErrorAlta] = useState<string | null>(null);
  const [verQr, setVerQr] = useState<CodigoVisible | null>(null);
  const [aRegenerar, setARegenerar] = useState<VinculoFamiliar | null>(null);
  const [errorRegenerar, setErrorRegenerar] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);

  const crear = useMutation({
    mutationFn: vinculoFamiliarService.crear,
    onSuccess: (respuesta) => {
      qc.invalidateQueries({ queryKey: ['vinculos'] });
      formulario.cerrar();
      if (respuesta?.vinculo) setVerQr({ codigo: respuesta.vinculo.codigo_vinculacion, expira_en: respuesta.vinculo.expira_en });
    },
    onError: (e) => setErrorAlta(obtenerMensajeError(e)),
  });

  const regenerar = useMutation({
    mutationFn: (id: number) => vinculoFamiliarService.regenerarCodigo(id),
    onSuccess: (respuesta) => {
      qc.invalidateQueries({ queryKey: ['vinculos'] });
      setARegenerar(null);
      // Se reutiliza el mismo modal del QR, ahora con el código nuevo.
      setVerQr({ codigo: respuesta.vinculo.codigo_vinculacion, expira_en: respuesta.vinculo.expira_en });
    },
    onError: (e) => setErrorRegenerar(obtenerMensajeError(e)),
  });

  const cambiarActivo = useMutation({
    mutationFn: (v: VinculoFamiliar) => (v.activo ? vinculoFamiliarService.desactivar(v.id) : vinculoFamiliarService.activar(v.id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vinculos'] });
      setAviso(null);
    },
    onError: (e) => setAviso({ ok: false, texto: obtenerMensajeError(e) }),
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
      {aviso && <div className={`aviso ${aviso.ok ? 'aviso-ok' : 'aviso-error'}`} role="alert">{aviso.texto}</div>}
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
              { titulo: 'Vence', render: (v) => formatFecha(v.expira_en) },
              {
                titulo: 'Estado',
                render: (v) => {
                  const e = estadoVinculo(v);
                  return <Badge tono={e.tono}>{e.texto}</Badge>;
                },
              },
            ]}
            acciones={(v) => (
              <>
                {puedeRegenerar(v) && (
                  <Button variante="texto" chico onClick={() => { setErrorRegenerar(null); setARegenerar(v); }}>
                    Generar nuevo QR
                  </Button>
                )}
                {esAdmin && (
                  <Button variante="texto" chico disabled={cambiarActivo.isPending} onClick={() => cambiarActivo.mutate(v)}>
                    {v.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                )}
              </>
            )}
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

      <ConfirmDialog
        abierto={aRegenerar !== null}
        titulo="Generar nuevo QR"
        textoConfirmar="Generar"
        mensaje={errorRegenerar ?? `Se invalidará el código anterior de ${aRegenerar ? nombreFamiliar(aRegenerar) : ''} y se generará uno nuevo con vencimiento renovado. ¿Continuar?`}
        cargando={regenerar.isPending}
        onConfirmar={() => aRegenerar && regenerar.mutate(aRegenerar.id)}
        onCancelar={() => { setARegenerar(null); setErrorRegenerar(null); }}
      />

      <Modal abierto={verQr !== null} titulo="Código de vinculación" onCerrar={() => setVerQr(null)}>
        {verQr && (
          <div className="qr-caja">
            <QRCodeSVG value={urlRegistroConCodigo(verQr.codigo)} size={220} marginSize={2} />
            <p>El familiar escanea este código para abrir el registro con el código ya cargado. Vence el {formatFecha(verQr.expira_en)}.</p>
            <code>{verQr.codigo}</code>
            <Button variante="secundario" onClick={() => setVerQr(null)}>Cerrar</Button>
          </div>
        )}
      </Modal>
    </>
  );
}