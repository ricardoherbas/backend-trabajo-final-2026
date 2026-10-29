import { Request, Response, NextFunction } from 'express';

export const validarRegistroFamiliar = (
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
        email,
        password,
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

    if (!email || typeof email !== 'string') {
        res.status(400).json({
            mensaje: 'El email es obligatorio',
        });
        return;
    }

    if (!email.includes('@')) {
        res.status(400).json({
            mensaje: 'El email no es válido',
        });
        return;
    }

    if (!password || typeof password !== 'string') {
        res.status(400).json({
            mensaje: 'La contraseña es obligatoria',
        });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({
            mensaje:
                'La contraseña debe tener al menos 8 caracteres',
        });
        return;
    }

    if (
        fecha_nacimiento !== undefined &&
        fecha_nacimiento !== null
    ) {
        if (Number.isNaN(Date.parse(fecha_nacimiento))) {
            res.status(400).json({
                mensaje:
                    'La fecha de nacimiento no es válida',
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
            mensaje: 'El teléfono no es válido',
        });
        return;
    }

    next();
};
