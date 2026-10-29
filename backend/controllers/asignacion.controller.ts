import {Request, Response} from 'express';
import {crearAsignacion, obtenerAsignacion, listarAsignaciones, actualizarAsignacion, eliminarAsignacion} from '../services/asignacion.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const asignacion =
            await crearAsignacion(req.body);

        res.status(201).json({
            mensaje:
                'Asignación creada correctamente',
            asignacion
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear asignación';

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

        const asignacion =
            await obtenerAsignacion(id);

        res.status(200).json(
            asignacion
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener asignación';

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
        const asignaciones =
            await listarAsignaciones();

        res.status(200).json(
            asignaciones
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener asignaciones';

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

        const asignacion =
            await actualizarAsignacion(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Asignación actualizada correctamente',
            asignacion
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar asignación';

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

        await eliminarAsignacion(id);

        res.status(200).json({
            mensaje:
                'Asignación eliminada correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar asignación';

        res.status(404).json({
            mensaje
        });
    }
};
