import {Request, Response} from 'express';

import {crearAdministrador, obtenerAdministrador, listarAdministradores, eliminarAdministrador} from '../services/administrador.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const administrador =
            await crearAdministrador(req.body);

        res.status(201).json({
            mensaje:
                'Administrador creado correctamente',
            administrador
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear administrador';

        res.status(400).json({
            mensaje
        });
    }
};

export const obtener = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const administrador =
            await obtenerAdministrador(id);

        res.status(200).json(
            administrador
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener administrador';

        res.status(404).json({
            mensaje
        });
    }
};

export const listar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const administradores =
            await listarAdministradores();

        res.status(200).json(
            administradores
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener administradores';

        res.status(500).json({
            mensaje
        });
    }
};

export const eliminar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        await eliminarAdministrador(id);

        res.status(200).json({
            mensaje:
                'Administrador eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar administrador';

        res.status(404).json({
            mensaje
        });
    }
};