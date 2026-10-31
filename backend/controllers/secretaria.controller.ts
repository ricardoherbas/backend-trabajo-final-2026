import {Request, Response, NextFunction} from 'express';

import {crearSecretaria, obtenerSecretaria, listarSecretarias, eliminarSecretaria} from '../services/secretaria.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const secretaria =
            await crearSecretaria(req.body);

        res.status(201).json({
            mensaje:
                'Secretaria creada correctamente',
            secretaria
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

        const secretaria =
            await obtenerSecretaria(id);

        res.status(200).json(
            secretaria
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
        const secretarias =
            await listarSecretarias();

        res.status(200).json(
            secretarias
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

        await eliminarSecretaria(id);

        res.status(200).json({
            mensaje:
                'Secretaria eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};