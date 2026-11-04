import { Request, Response, NextFunction } from 'express';
import {
    crearPersona,
    actualizarPersona
} from '../services/personas.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const persona = await crearPersona(req.body);

        res.status(201).json({
            mensaje: 'Persona creada correctamente',
            persona
        });
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
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                mensaje: 'El ID de la persona no es válido'
            });
            return;
        }

        const persona = await actualizarPersona(
            id,
            req.body
        );

        res.status(200).json({
            mensaje: 'Persona actualizada correctamente',
            persona
        });
    } catch (error) {
        next(error);
    }
};