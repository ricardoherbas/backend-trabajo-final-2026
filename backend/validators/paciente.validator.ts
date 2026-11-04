import { Request, Response, NextFunction } from 'express';

const validarCamposPaciente = (
    req: Request,
    res: Response,
    exigirPersona: boolean
): boolean => {
    const {
        persona_id,
        direccion,
        obra_social,
        observaciones,
        activo,
    } = req.body;

    if (
        exigirPersona &&
        (!Number.isInteger(persona_id) || persona_id <= 0)
    ) {
        res.status(400).json({
            mensaje: 'persona_id debe ser un número entero válido',
        });
        return false;
    }

    if (
        !exigirPersona &&
        persona_id !== undefined &&
        (!Number.isInteger(persona_id) || persona_id <= 0)
    ) {
        res.status(400).json({
            mensaje: 'persona_id debe ser un número entero válido',
        });
        return false;
    }

    if (direccion !== undefined && direccion !== null) {
        if (typeof direccion !== 'string') {
            res.status(400).json({
                mensaje: 'La dirección no es válida',
            });
            return false;
        }
    }

    if (obra_social !== undefined && obra_social !== null) {
        if (typeof obra_social !== 'string') {
            res.status(400).json({
                mensaje: 'La obra social no es válida',
            });
            return false;
        }
    }

    if (observaciones !== undefined && observaciones !== null) {
        if (typeof observaciones !== 'string') {
            res.status(400).json({
                mensaje: 'Las observaciones no son válidas',
            });
            return false;
        }
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        res.status(400).json({
            mensaje: 'activo debe ser booleano',
        });
        return false;
    }

    return true;
};

export const validarPaciente = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (validarCamposPaciente(req, res, true)) {
        next();
    }
};

export const validarActualizacionPaciente = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (validarCamposPaciente(req, res, false)) {
        next();
    }
};