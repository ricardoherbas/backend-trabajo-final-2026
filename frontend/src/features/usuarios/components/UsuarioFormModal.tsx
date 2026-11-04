import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ETIQUETA_ROL } from '@/core/permissions/roles';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { FormField, FormSelect } from '@/shared/components/FormField';
import { usuarioEdicionSchema, usuarioSchema } from '../validators/usuario.validator';
import type { Usuario } from '../interfaces/usuario.interface';

/** valores ya limpios para mandar al backend (vacios -> null / sin password). */
export interface ValoresUsuario {
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento: string | null;
    telefono: string | null;
    email: string;
    rol: Usuario['rol'];
    password?: string;
}

interface Props {
    abierto: boolean;
    /** null = alta; un usuario = edicion */
    usuario: Usuario | null;
    enviando: boolean;
    error: string | null;
    onCerrar: () => void;
    onEnviar: (valores: ValoresUsuario) => void;
}

// un solo formulario para alta y edicion (el schema cambia según el modo).
interface Campos {
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento?: string;
    telefono?: string;
    email: string;
    rol: Usuario['rol'] | '';
    password?: string;
}

const VACIO: Campos = { nombre: '', apellido: '', dni: '', fecha_nacimiento: '', telefono: '', email: '', rol: '', password: '' };

export function UsuarioFormModal({ abierto, usuario, enviando, error, onCerrar, onEnviar }: Props) {
    const editando = usuario !== null;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Campos>({
        resolver: zodResolver(editando ? usuarioEdicionSchema : usuarioSchema) as never,
        defaultValues: VACIO,
    });

  // al abrir, se cargan los datos del usuario (o se limpia el formulario en el alta).
    useEffect(() => {
        if (!abierto) return;
        reset(
        usuario
        ? {
            nombre: usuario.persona?.nombre ?? '',
            apellido: usuario.persona?.apellido ?? '',
            dni: usuario.persona?.dni ?? '',
            fecha_nacimiento: usuario.persona?.fecha_nacimiento?.slice(0, 10) ?? '',
            telefono: usuario.persona?.telefono ?? '',
            email: usuario.email,
            rol: usuario.rol,
            password: '',
            }
            : VACIO,
        );
   }, [abierto, usuario, reset]);

    const alEnviar = handleSubmit((v) => {
        const { password, fecha_nacimiento, telefono, ...resto } = v;
        onEnviar({
        ...(resto as Omit<ValoresUsuario, 'fecha_nacimiento' | 'telefono' | 'password'>),
        fecha_nacimiento: fecha_nacimiento || null,
        telefono: telefono || null,
        // en edicion, si la contraseña quedo vacía NO se envia.
        ...(password ? { password } : {}),
        });
    });

    return (
        <Modal abierto={abierto} titulo={editando ? 'Editar usuario' : 'Nuevo usuario'} onCerrar={onCerrar}>
        <form className="form-grid" onSubmit={alEnviar} noValidate>
            {error && <div className="aviso aviso-error" role="alert">{error}</div>}
            <div className="form-grid dos">
            <FormField etiqueta="Nombre" error={errors.nombre?.message} {...register('nombre')} />
            <FormField etiqueta="Apellido" error={errors.apellido?.message} {...register('apellido')} />
            <FormField etiqueta="DNI" inputMode="numeric" error={errors.dni?.message} {...register('dni')} />
            <FormField etiqueta="Teléfono (opcional)" type="tel" error={errors.telefono?.message} {...register('telefono')} />
            <FormField etiqueta="Fecha de nacimiento (opcional)" type="date" error={errors.fecha_nacimiento?.message} {...register('fecha_nacimiento')} />
            <FormSelect etiqueta="Rol" error={errors.rol?.message} {...register('rol')}>
                <option value="" disabled>Elegí un rol</option>
                {Object.entries(ETIQUETA_ROL).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
                ))}
            </FormSelect>
            <FormField etiqueta="Email" type="email" error={errors.email?.message} {...register('email')} />
            <FormField
                etiqueta={editando ? 'Nueva contraseña (opcional)' : 'Contraseña inicial'}
                type="password"
                autoComplete="new-password"
                ayuda={editando ? 'Dejala vacía para no cambiarla.' : undefined}
                error={errors.password?.message}
                {...register('password')}
            />
            </div>
            <div className="form-acciones">
            <Button type="submit" disabled={enviando}>
                {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
            <Button variante="secundario" onClick={onCerrar}>Cancelar</Button>
            </div>
        </form>
        </Modal>
    );
    }