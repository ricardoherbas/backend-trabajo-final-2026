import { useMemo, useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { tieneRol } from '@/core/permissions/roles';
import { obtenerMensajeError } from '@/core/api/errors';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { useEliminarMedicamento, useGuardarMedicamento, useMedicamentos } from '../hooks/useMedicamentos';
import { MedicamentoFormModal } from '../components/MedicamentoFormModal';
import type { Medicamento } from '../interfaces/medicamento.interface';

export default function MedicamentosPage() {
  const { rol } = useAuth();
  const puedeEditar = tieneRol(rol, ['administrador', 'secretaria']);
  const puedeEliminar = tieneRol(rol, ['administrador']);

  const { data, isLoading, error } = useMedicamentos();
  const guardar = useGuardarMedicamento();
  const eliminar = useEliminarMedicamento();

  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Medicamento | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Medicamento | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = [...(data ?? [])].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return q ? lista.filter((m) => m.nombre.toLowerCase().includes(q)) : lista;
  }, [data, busqueda]);

  const abrirAlta = () => { setEditando(null); setErrorForm(null); setFormAbierto(true); };
  const abrirEdicion = (m: Medicamento) => { setEditando(m); setErrorForm(null); setFormAbierto(true); };

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
        titulo="Medicamentos"
        descripcion="Catálogo que se usa al indicar tratamientos."
        accion={puedeEditar ? <Button onClick={abrirAlta}>Nuevo medicamento</Button> : undefined}
      />
      <div className="panel">
        <div className="filtros">
          <div className="campo">
            <label htmlFor="buscar-med">Buscar por nombre</label>
            <input id="buscar-med" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>
        <StateView cargando={isLoading} error={error} vacio={filtrados.length === 0} textoVacio={busqueda ? 'Ningún medicamento coincide con la búsqueda.' : 'Todavía no hay medicamentos cargados.'}>
          <DataTable
            filas={filtrados}
            clave={(m) => m.id}
            columnas={[
              { titulo: 'Nombre', render: (m) => m.nombre },
              { titulo: 'Presentación', render: (m) => m.presentacion },
              { titulo: 'Cantidad', render: (m) => m.cantidad },
            ]}
            acciones={puedeEditar ? (m) => (
              <>
                <Button variante="texto" chico onClick={() => abrirEdicion(m)}>Editar</Button>
                {puedeEliminar && <Button variante="texto" chico onClick={() => setAEliminar(m)}>Eliminar</Button>}
              </>
            ) : undefined}
          />
        </StateView>
      </div>

      <MedicamentoFormModal
        abierto={formAbierto}
        medicamento={editando}
        enviando={guardar.isPending}
        error={errorForm}
        onCerrar={() => setFormAbierto(false)}
        onEnviar={(valores) => {
          setErrorForm(null);
          guardar.mutate(
            { id: editando?.id, datos: valores },
            { onSuccess: () => setFormAbierto(false), onError: (e) => setErrorForm(obtenerMensajeError(e)) },
          );
        }}
      />

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar medicamento"
        mensaje={errorEliminar ?? `¿Eliminar "${aEliminar?.nombre}"? Si tiene tratamientos asociados, puede que no se pueda eliminar.`}
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => { setAEliminar(null); setErrorEliminar(null); }}
      />
    </>
  );
}
