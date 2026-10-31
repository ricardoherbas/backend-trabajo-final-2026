import {Request, Response, NextFunction} from 'express';

import {crearCuidadora, obtenerCuidadora, listarCuidadoras, eliminarCuidadora} from '../services/cuidadora.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cuidadora =
            await crearCuidadora(req.body);

        res.status(201).json({
            mensaje:
                'Cuidadora creada correctamente',
            cuidadora
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

        const cuidadora =
            await obtenerCuidadora(id);

        res.status(200).json(
            cuidadora
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
        const cuidadoras =
            await listarCuidadoras();

        res.status(200).json(
            cuidadoras
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

        await eliminarCuidadora(id);

        res.status(200).json({
            mensaje:
                'Cuidadora eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};