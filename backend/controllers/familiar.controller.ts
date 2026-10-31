import {Request, Response, NextFunction} from 'express';

import {crearFamiliar, obtenerFamiliar, listarFamiliares, eliminarFamiliar} from '../services/familiar.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const familiar =
            await crearFamiliar(req.body);

        res.status(201).json({
            mensaje:
                'Familiar creado correctamente',
            familiar
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

        const familiar =
            await obtenerFamiliar(id);

        res.status(200).json(
            familiar
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
        const familiares =
            await listarFamiliares();

        res.status(200).json(
            familiares
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

        await eliminarFamiliar(id);

        res.status(200).json({
            mensaje:
                'Familiar eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};