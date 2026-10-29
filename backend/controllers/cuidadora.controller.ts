import {Request, Response} from 'express';

import {crearCuidadora, obtenerCuidadora, listarCuidadoras, eliminarCuidadora} from '../services/cuidadora.service';

export const crear = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear cuidadora';

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

        const cuidadora =
            await obtenerCuidadora(id);

        res.status(200).json(
            cuidadora
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener cuidadora';

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
        const cuidadoras =
            await listarCuidadoras();

        res.status(200).json(
            cuidadoras
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener cuidadoras';

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

        await eliminarCuidadora(id);

        res.status(200).json({
            mensaje:
                'Cuidadora eliminada correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar cuidadora';

        res.status(404).json({
            mensaje
        });
    }
};
