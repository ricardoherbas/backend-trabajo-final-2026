import {Request, Response} from 'express';
import {crearTurno, obtenerTurno, listarTurnos, actualizarTurno, eliminarTurno} from '../services/turno.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const turno =
            await crearTurno(req.body);

        res.status(201).json({
            mensaje:
                'Turno creado correctamente',
            turno
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear turno';

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

        const turno =
            await obtenerTurno(id);

        res.status(200).json(
            turno
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener turno';

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
        const turnos =
            await listarTurnos();

        res.status(200).json(
            turnos
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener turnos';

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

        const turno =
            await actualizarTurno(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Turno actualizado correctamente',
            turno
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar turno';

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

        await eliminarTurno(id);

        res.status(200).json({
            mensaje:
                'Turno eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar turno';

        res.status(404).json({
            mensaje
        });
    }
};
