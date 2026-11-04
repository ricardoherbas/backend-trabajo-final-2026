
import {Request, Response, NextFunction} from 'express';

export const validarPersona = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        telefono
    } = req.body;

    if (
        typeof nombre !== 'string' ||
        !nombre.trim()
    ) {
        res.status(400).json({
            mensaje: 'El nombre es obligatorio'
        });
        return;
    }

    if (
        typeof apellido !== 'string' ||
        !apellido.trim()
    ) {
        res.status(400).json({
            mensaje: 'El apellido es obligatorio'
        });
        return;
    }

    if (
        typeof dni !== 'string' ||
        !dni.trim()
    ) {
        res.status(400).json({
            mensaje: 'El DNI es obligatorio'
        });
        return;
    }

    if (
        fecha_nacimiento !== undefined &&
        fecha_nacimiento !== null
    ) {
        if (
            typeof fecha_nacimiento !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento) ||
            Number.isNaN(Date.parse(fecha_nacimiento)) ||
            new Date(`${fecha_nacimiento}T00:00:00.000Z`)
                .toISOString()
                .slice(0, 10) !== fecha_nacimiento
        ) {
            res.status(400).json({
                mensaje: 'La fecha de nacimiento no es válida'
            });
            return;
        }
    }

    if (
        telefono !== undefined &&
        telefono !== null &&
        typeof telefono !== 'string'
    ) {
        res.status(400).json({
            mensaje: 'El teléfono no es válido'
        });
        return;
    }

    next();
};
