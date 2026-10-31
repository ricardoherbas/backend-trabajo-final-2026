import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {
    crearTurno,
    obtenerTurno,
    listarTurnos,
    actualizarTurno,
    eliminarTurno
} from '../services/turno.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
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

        const turno =
            await obtenerTurno(
                id,
                personaIdCuidadora
            );

        res.status(200).json(
            turno
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

        const turnos =
            await listarTurnos(
                personaIdCuidadora
            );

        res.status(200).json(
            turnos
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

        await eliminarTurno(id);

        res.status(200).json({
            mensaje:
                'Turno eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};