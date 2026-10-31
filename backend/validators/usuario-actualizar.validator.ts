import {Request, Response, NextFunction} from 'express';

const rolesPermitidos = [
    'administrador',
    'secretaria',
    'cuidadora',
    'familiar',
];

export const validarActualizacionUsuario = (
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
        rol,
    } = req.body;

    if (
        !req.body ||
        Object.keys(req.body).length === 0
    ) {
        res.status(400).json({
            mensaje: 'Debe enviar al menos un campo para actualizar',
        });
        return;
    }

    if (nombre !== undefined && (
        typeof nombre !== 'string' || !nombre.trim()
    )) {
        res.status(400).json({
            mensaje: 'El nombre no es válido',
        });
        return;
    }

    if (apellido !== undefined && (
        typeof apellido !== 'string' || !apellido.trim()
    )) {
        res.status(400).json({
            mensaje: 'El apellido no es válido',
        });
        return;
    }

    if (dni !== undefined && (
        typeof dni !== 'string' || !dni.trim()
    )) {
        res.status(400).json({
            mensaje: 'El DNI no es válido',
        });
        return;
    }

    if (email !== undefined) {
        if (
            typeof email !== 'string' ||
            !email.trim() ||
            !email.includes('@')
        ) {
            res.status(400).json({
                mensaje: 'El email no es válido',
            });
            return;
        }
    }

    if (password !== undefined) {
        if (
            typeof password !== 'string' ||
            password.length < 8
        ) {
            res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres',
            });
            return;
        }
    }

    if (rol !== undefined) {
        if (
            typeof rol !== 'string' ||
            !rolesPermitidos.includes(rol)
        ) {
            res.status(400).json({
                mensaje: 'El rol no es válido',
            });
            return;
        }
    }

    if (
        fecha_nacimiento !== undefined &&
        fecha_nacimiento !== null
    ) {
        if (
            typeof fecha_nacimiento !== 'string' ||
            Number.isNaN(Date.parse(fecha_nacimiento))
        ) {
            res.status(400).json({
                mensaje: 'La fecha de nacimiento no es válida',
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