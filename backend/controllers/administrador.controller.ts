
import {Request, Response, NextFunction} from 'express';
import {
    crearAdministrador,
    obtenerAdministrador,
    listarAdministradores,
    eliminarAdministrador
} from '../services/administrador.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
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
        next(error);
    }
};

export const obtener = async (
    req: Request,
    res: Response,
    next: NextFunction
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
        next(error);
    }
};

export const listar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const administradores =
            await listarAdministradores();

        res.status(200).json(
            administradores
        );
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (
    req: Request,
    res: Response,
    next: NextFunction
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
        next(error);
    }
};
