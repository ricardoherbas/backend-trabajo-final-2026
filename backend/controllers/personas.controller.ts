import {Request, Response, NextFunction} from 'express';
import {crearPersona} from '../services/personas.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const persona =
            await crearPersona(req.body);

        res.status(201).json({
            mensaje: 'Persona creada correctamente',
            persona
        });
    } catch (error) {
        next(error);
    }
};