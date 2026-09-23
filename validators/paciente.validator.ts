import { Request, Response, NextFunction } from 'express';

export const validarPaciente = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        persona_id,
        direccion,
        obra_social,
        observaciones,
        activo,
    } = req.body;

    if (!Number.isInteger(persona_id) || persona_id <= 0) {
        res.status(400).json({
            mensaje: 'persona_id debe ser un número entero válido',
        });
        return;
    }

    if (direccion !== undefined && direccion !== null) {
        if (typeof direccion !== 'string') {
            res.status(400).json({
                mensaje: 'La dirección no es válida',
            });
            return;
        }
    }

    if (obra_social !== undefined && obra_social !== null) {
        if (typeof obra_social !== 'string') {
            res.status(400).json({
                mensaje: 'La obra social no es válida',
            });
            return;
        }
    }

    if (observaciones !== undefined && observaciones !== null) {
        if (typeof observaciones !== 'string') {
            res.status(400).json({
                mensaje: 'Las observaciones no son válidas',
            });
            return;
        }
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        res.status(400).json({
            mensaje: 'activo debe ser booleano',
        });
        return;
    }

    next();
};