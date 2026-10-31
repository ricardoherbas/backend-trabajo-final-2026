import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {
    crearParteDiario,
    obtenerParteDiario,
    listarPartesDiarios,
    actualizarParteDiario,
    eliminarParteDiario
} from '../services/parteDiario.service';

export const crear = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const parte =
            await crearParteDiario(
                req.body,
                personaIdCuidadora
            );

        res.status(201).json({
            mensaje:
                'Parte diario creado correctamente',
            parte
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

        const personaIdFamiliar =
            req.usuario?.rol === 'familiar'
                ? req.usuario.persona_id
                : undefined;

        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const parte =
            await obtenerParteDiario(
                id,
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            parte
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
        const personaIdFamiliar =
            req.usuario?.rol === 'familiar'
                ? req.usuario.persona_id
                : undefined;

        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const partes =
            await listarPartesDiarios(
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            partes
        );
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (
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

        const parte =
            await actualizarParteDiario(
                id,
                req.body,
                personaIdCuidadora
            );

        res.status(200).json({
            mensaje:
                'Parte diario actualizado correctamente',
            parte
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

        await eliminarParteDiario(id);

        res.status(200).json({
            mensaje:
                'Parte diario eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};