import {Request, Response, NextFunction} from 'express';

import {
    crearUsuario,
    listarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    desactivarUsuario,
    activarUsuario
} from '../services/usuarios.service';

// Crear un usuario.
export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const usuario = await crearUsuario(req.body);

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario
        });
    } catch (error) {
        next(error);
    }
};

// Listar todos los usuarios.
export const listar = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const usuarios = await listarUsuarios();

        res.status(200).json({
            usuarios
        });
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por su ID.
export const obtener = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const usuario = await obtenerUsuario(id);

        res.status(200).json({
            usuario
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar un usuario.
export const actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const usuario = await actualizarUsuario(
            id,
            req.body
        );

        res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario
        });
    } catch (error) {
        next(error);
    }
};

// Desactivar un usuario.
export const desactivar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const usuario = await desactivarUsuario(id);

        res.status(200).json({
            mensaje: 'Usuario desactivado correctamente',
            usuario
        });
    } catch (error) {
        next(error);
    }
};

// Activar un usuario.
export const activar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const usuario = await activarUsuario(id);

        res.status(200).json({
            mensaje: 'Usuario activado correctamente',
            usuario
        });
    } catch (error) {
        next(error);
    }
};