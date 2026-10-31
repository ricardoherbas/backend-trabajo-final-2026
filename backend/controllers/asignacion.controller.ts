
import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {
    crearAsignacion,
    obtenerAsignacion,
    listarAsignaciones,
    actualizarAsignacion,
    eliminarAsignacion
} from '../services/asignacion.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
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
        next(error);
    }
};

export const obtener = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const asignacion =
            await obtenerAsignacion(
                id,
                personaIdCuidadora
            );

        res.status(200).json(
            asignacion
        );
    } catch (error) {
        next(error);
    }
};

export const listar = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const asignaciones =
            await listarAsignaciones(
                personaIdCuidadora
            );

        res.status(200).json(
            asignaciones
        );
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
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

        await eliminarAsignacion(id);

        res.status(200).json({
            mensaje:
                'Asignación eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

