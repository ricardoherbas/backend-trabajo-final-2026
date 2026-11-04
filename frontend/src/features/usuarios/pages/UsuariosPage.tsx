import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/core/auth/useAuth';
import { obtenerMensajeError } from '@/core/api/errors';
import { ETIQUETA_ROL } from '@/core/permissions/roles';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateView } from '@/shared/components/StateView';
import { DataTable } from '@/shared/components/DataTable';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { UsuarioFormModal, type ValoresUsuario } from '../components/UsuarioFormModal';
import { usuarioService } from '../services/usuario.service';
import type { Usuario } from '../interfaces/usuario.interface';

const CLAVE = ['usuarios'];

export default function UsuariosPage() {
  const qc = useQueryClient();
  const { usuario: yo } = useAuth();
  const { data, isLoading, error } = useQuery({ queryKey: CLAVE, queryFn: usuarioService.listar });

  // formulario: undefined = cerrado, null = alta, Usuario = edición
  const [formulario, setFormulario] = useState<Usuario | null | undefined>(undefined);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);

  const guardar = useMutation({
    mutationFn: async (valores: ValoresUsuario) =>
      formulario
        ? usuarioService.actualizar(formulario.id, valores)
        : usuarioService.crear({ ...valores, password: valores.password ?? '' }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: CLAVE });
      setAviso({ ok: true, texto: r.mensaje });
      setFormulario(undefined);
    },
    // Acá aparecen, por ejemplo, los errores de cambio de rol ("No se puede cambiar el rol: ...").
    onError: (e) => setErrorForm(obtenerMensajeError(e)),
  });

  const cambiarEstado = useMutation({
    mutationFn: (u: Usuario) => (u.activo ? usuarioService.desactivar(u.id) : usuarioService.activar(u.id)),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: CLAVE });
      setAviso({ ok: true, texto: r.mensaje });
    },
    onError: (e) => setAviso({ ok: false, texto: obtenerMensajeError(e) }),
  });

  const nombre = (u: Usuario) => (u.persona ? `${u.persona.apellido}, ${u.persona.nombre}` : `Persona #${u.persona_id}`);

  return (
    <>
      <PageHeader
        titulo="Usuarios"
        descripcion="Cuentas del sistema. Cada alta crea también a la persona y su perfil."
        accion={<Button onClick={() => { setErrorForm(null); setAviso(null); setFormulario(null); }}>Nuevo usuario</Button>}
      />
      {aviso && <div className={`aviso ${aviso.ok ? 'aviso-ok' : 'aviso-error'}`} role="status">{aviso.texto}</div>}
      <div className="panel">
        <StateView cargando={isLoading} error={error} vacio={!!data && data.length === 0} textoVacio="Todavía no hay usuarios.">
          <DataTable
            filas={data ?? []}
            clave={(u) => u.id}
            columnas={[
              { titulo: 'Nombre', render: nombre },
              { titulo: 'DNI', render: (u) => u.persona?.dni ?? '—' },
              { titulo: 'Email', render: (u) => u.email },
              { titulo: 'Rol', render: (u) => ETIQUETA_ROL[u.rol] },
              { titulo: 'Estado', render: (u) => <Badge tono={u.activo ? 'ok' : 'neutro'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge> },
            ]}
            acciones={(u) => {
              const esMiCuenta = u.id === yo?.id;
              return (
                <>
                  <Button variante="texto" chico onClick={() => { setErrorForm(null); setAviso(null); setFormulario(u); }}>Editar</Button>
                  <Button
                    variante="texto"
                    chico
                    disabled={cambiarEstado.isPending || (esMiCuenta && u.activo)}
                    title={esMiCuenta && u.activo ? 'No podés desactivar tu propia cuenta' : undefined}
                    onClick={() => { setAviso(null); cambiarEstado.mutate(u); }}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                </>
              );
            }}
          />
        </StateView>
      </div>

      <UsuarioFormModal
        abierto={formulario !== undefined}
        usuario={formulario ?? null}
        enviando={guardar.isPending}
        error={errorForm}
        onCerrar={() => setFormulario(undefined)}
        onEnviar={(valores) => { setErrorForm(null); guardar.mutate(valores); }}
      />
    </>
  );
}