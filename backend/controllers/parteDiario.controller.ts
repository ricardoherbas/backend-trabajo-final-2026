import {Request, Response} from 'express';
import {crearParteDiario, obtenerParteDiario, listarPartesDiarios, actualizarParteDiario, eliminarParteDiario} from '../services/parteDiario.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const parte =
            await crearParteDiario(req.body);

        res.status(201).json({
            mensaje:
                'Parte diario creado correctamente',
            parte
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear parte diario';

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

        const parte =
            await obtenerParteDiario(id);

        res.status(200).json(
            parte
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener parte diario';

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
        const partes =
            await listarPartesDiarios();

        res.status(200).json(
            partes
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener partes diarios';

        res.status(500).json({
            mensaje
        });
    }
};

export const actualizar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const parte =
            await actualizarParteDiario(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Parte diario actualizado correctamente',
            parte
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar parte diario';

        res.status(400).json({
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

        await eliminarParteDiario(id);

        res.status(200).json({
            mensaje:
                'Parte diario eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar parte diario';

        res.status(404).json({
            mensaje
        });
    }
};
