import {Request, Response} from 'express';

import {crearUsuario} from '../services/usuarios.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuario =
            await crearUsuario(req.body);

        res.status(201).json({
            mensaje:
                'Usuario creado correctamente',
            usuario
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear usuario';

        res.status(400).json({
            mensaje
        });
    }
};
