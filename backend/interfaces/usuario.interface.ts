import {RolUsuario} from '../types/rol-usuario.type';

export interface DatosCrearUsuario {
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento?: Date | null;
    telefono?: string | null;
    email: string;
    password: string;
    rol: RolUsuario;
}

export interface DatosActualizarUsuario {
    nombre?: string;
    apellido?: string;
    dni?: string;
    fecha_nacimiento?: Date | null;
    telefono?: string | null;
    email?: string;
    password?: string;
    rol?: RolUsuario;
}