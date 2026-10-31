import { Request, Response, NextFunction } from 'express';

export const validarRegistroFamiliar = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        codigo_vinculacion,
        email,
        password,
    } = req.body;

    if (
        !codigo_vinculacion ||
        typeof codigo_vinculacion !== 'string'
    ) {
        res.status(400).json({
            mensaje: 'El código de vinculación es obligatorio',
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
            mensaje: 'La contraseña debe tener al menos 8 caracteres',
        });
        return;
    }

    next();
};