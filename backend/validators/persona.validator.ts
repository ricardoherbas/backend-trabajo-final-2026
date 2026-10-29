import { Request, Response, NextFunction } from 'express';

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
        telefono,
    } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({
            mensaje: 'El nombre es obligatorio',
        });
        return;
    }

    if (!apellido || typeof apellido !== 'string') {
        res.status(400).json({
            mensaje: 'El apellido es obligatorio',
        });
        return;
    }

    if (!dni || typeof dni !== 'string') {
        res.status(400).json({
            mensaje: 'El DNI es obligatorio',
        });
        return;
    }

    if (fecha_nacimiento !== undefined && fecha_nacimiento !== null) {
        if (Number.isNaN(Date.parse(fecha_nacimiento))) {
            res.status(400).json({
                mensaje: 'La fecha de nacimiento no es válida',
            });
            return;
        }
    }

    if (telefono !== undefined && telefono !== null) {
        if (typeof telefono !== 'string') {
            res.status(400).json({
                mensaje: 'El teléfono no es válido',
            });
            return;
        }
    }

    next();
};