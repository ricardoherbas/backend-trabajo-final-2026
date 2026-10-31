import { Response, NextFunction } from 'express';
import { RequestAutenticado } from '../middlewares/auth.middleware';
import {
    crearTratamiento,
    obtenerTratamiento,
    listarTratamientos,
    actualizarTratamiento,
    eliminarTratamiento
} from '../services/tratamiento.service';

export const crear = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tratamiento =
            await crearTratamiento(req.body);

        res.status(201).json({
            mensaje:
                'Tratamiento creado correctamente',
            tratamiento
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

        const tratamiento =
            await obtenerTratamiento(
                id,
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            tratamiento
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

        const tratamientos =
            await listarTratamientos(
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            tratamientos
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

        const tratamiento =
            await actualizarTratamiento(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Tratamiento actualizado correctamente',
            tratamiento
        });
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        await eliminarTratamiento(id);

        res.status(200).json({
            mensaje:
                'Tratamiento eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};