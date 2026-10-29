import {Request, Response} from 'express';

import {crearSecretaria, obtenerSecretaria, listarSecretarias, eliminarSecretaria} from '../services/secretaria.service';

export const crear = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear secretaria';

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

        const secretaria =
            await obtenerSecretaria(id);

        res.status(200).json(
            secretaria
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener secretaria';

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
        const secretarias =
            await listarSecretarias();

        res.status(200).json(
            secretarias
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener secretarias';

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

        await eliminarSecretaria(id);

        res.status(200).json({
            mensaje:
                'Secretaria eliminada correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar secretaria';

        res.status(404).json({
            mensaje
        });
    }
};
