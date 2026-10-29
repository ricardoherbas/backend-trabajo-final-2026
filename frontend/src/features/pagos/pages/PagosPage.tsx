import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import type { EstadoPago } from '@/core/types/estado-pago.type';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { usePacienteOpciones } from '@/shared/hooks/usePacienteOpciones';
import { formatFecha } from '@/shared/utils/formatFecha';
import { formatMoneda } from '@/shared/utils/formatMoneda';
import { useEliminarPago, useGuardarPago, usePagos } from '../hooks/usePagos';
import { RegistrarCobroModal } from '../components/RegistrarCobroModal';
import { ETIQUETA_ESTADO_PAGO, ETIQUETA_MEDIO_PAGO, TONO_ESTADO_PAGO, formatPeriodo, pagoAPayload } from '../adapters/pago.adapter';
import { ESTADOS_PAGO } from '../validators/pago.validator';
import type { Pago } from '../interfaces/pago.interface';

export default function PagosPage() {
  const { rol } = useAuth();
  const puedeEliminar = tieneRol(rol, ['administrador']);

  const { data, isLoading, error } = usePagos();
  const pacientes = usePacienteOpciones();
  const guardar = useGuardarPago();
  const eliminar = useEliminarPago();

  const [estado, setEstado] = useState<EstadoPago | ''>('');
  const [busqueda, setBusqueda] = useState('');
  const [aCobrar, setACobrar] = useState<Pago | null>(null);
  const [errorCobro, setErrorCobro] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Pago | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (data ?? [])
      .filter((p) => !estado || p.estado === estado)
      .filter((p) => !q || pacientes.nombreDe(p.paciente_id).toLowerCase().includes(q))
      .sort((a, b) => b.periodo.localeCompare(a.periodo));
  }, [data, estado, busqueda, pacientes.nombreDe]);

  const totales = useMemo(() => {
    const suma = (e: EstadoPago) => filtrados.filter((p) => p.estado === e).reduce((acc, p) => acc + Number(p.monto), 0);
    return { pendiente: suma('pendiente'), vencido: suma('vencido'), pagado: suma('pagado') };
  }, [filtrados]);

  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setErrorEliminar(null);
    eliminar.mutate(aEliminar.id, {
      onSuccess: () => setAEliminar(null),
      onError: (e) => setErrorEliminar(obtenerMensajeError(e)),
    });
  };

  return (
    <>
      <PageHeader
        titulo="Pagos"
        descripcion="Seguimiento mensual de cobros por paciente."
        accion={<Link className="btn btn-primario" to="/pagos/nuevo">Nuevo pago</Link>}
      />

      <dl className="resumen">
        <div><dt>Pendiente</dt><dd>{formatMoneda(totales.pendiente)}</dd></div>
        <div><dt>Vencido</dt><dd>{formatMoneda(totales.vencido)}</dd></div>
        <div><dt>Cobrado</dt><dd>{formatMoneda(totales.pagado)}</dd></div>
      </dl>

      <div className="panel">
        <div className="filtros">
          <div className="campo">
            <label htmlFor="buscar-pago">Buscar por paciente</label>
            <input id="buscar-pago" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="estado-pago">Estado</label>
            <select id="estado-pago" value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago | '')}>
              <option value="">Todos</option>
              {ESTADOS_PAGO.map((e) => <option key={e} value={e}>{ETIQUETA_ESTADO_PAGO[e]}</option>)}
            </select>
          </div>
        </div>
        <StateView cargando={isLoading} error={error} vacio={filtrados.length === 0} textoVacio="No hay pagos para mostrar con estos filtros.">
          <DataTable
            filas={filtrados}
            clave={(p) => p.id}
            columnas={[
              { titulo: 'Período', render: (p) => formatPeriodo(p.periodo) },
              { titulo: 'Paciente', render: (p) => pacientes.nombreDe(p.paciente_id) },
              { titulo: 'Monto', render: (p) => formatMoneda(p.monto) },
              { titulo: 'Estado', render: (p) => <Badge tono={TONO_ESTADO_PAGO[p.estado]}>{ETIQUETA_ESTADO_PAGO[p.estado]}</Badge> },
              { titulo: 'Medio', render: (p) => (p.medio_pago ? ETIQUETA_MEDIO_PAGO[p.medio_pago] : '—') },
              { titulo: 'Fecha de pago', render: (p) => formatFecha(p.fecha_pago) },
            ]}
            acciones={(p) => (
              <>
                {p.estado !== 'pagado' && (
                  <Button variante="texto" chico onClick={() => { setErrorCobro(null); setACobrar(p); }}>Registrar cobro</Button>
                )}
                <Link className="btn btn-texto btn-chico" to={`/pagos/${p.id}/editar`}>Editar</Link>
                {puedeEliminar && <Button variante="texto" chico onClick={() => setAEliminar(p)}>Eliminar</Button>}
              </>
            )}
          />
        </StateView>
      </div>

      <RegistrarCobroModal
        pago={aCobrar}
        nombrePaciente={aCobrar ? pacientes.nombreDe(aCobrar.paciente_id) : ''}
        enviando={guardar.isPending}
        error={errorCobro}
        onCerrar={() => setACobrar(null)}
        onEnviar={({ medio_pago, fecha_pago }) => {
          if (!aCobrar) return;
          setErrorCobro(null);
          guardar.mutate(
            { id: aCobrar.id, datos: { ...pagoAPayload(aCobrar), estado: 'pagado', medio_pago, fecha_pago } },
            { onSuccess: () => setACobrar(null), onError: (e) => setErrorCobro(obtenerMensajeError(e)) },
          );
        }}
      />

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar pago"
        mensaje={errorEliminar ?? `¿Eliminar el pago de ${aEliminar ? pacientes.nombreDe(aEliminar.paciente_id) : ''} (${aEliminar ? formatPeriodo(aEliminar.periodo) : ''})? Esta acción no se puede deshacer.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
