import {Request, Response} from 'express';

import {crearFamiliar, obtenerFamiliar, listarFamiliares, eliminarFamiliar} from '../services/familiar.service';

export const crear = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear familiar';

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

        const familiar =
            await obtenerFamiliar(id);

        res.status(200).json(
            familiar
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener familiar';

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
        const familiares =
            await listarFamiliares();

        res.status(200).json(
            familiares
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener familiares';

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

        await eliminarFamiliar(id);

        res.status(200).json({
            mensaje:
                'Familiar eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar familiar';

        res.status(404).json({
            mensaje
        }); 
    } 
};
