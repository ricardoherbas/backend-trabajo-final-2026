import { Request, Response } from 'express';

import {registrarFamiliar, iniciarSesion, obtenerPerfil,} from '../services/auth.service';
import { RequestAutenticado } from '../middlewares/auth.middleware';

export const registrar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuario =
            await registrarFamiliar(req.body);

        res.status(201).json({
            mensaje:
                'Familiar registrado correctamente',
            usuario,
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al registrar familiar';

        res.status(400).json({
            mensaje,
        });
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const resultado =
            await iniciarSesion(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al iniciar sesión';

        res.status(401).json({
            mensaje,
        });
    }
};

export const perfil = async (
    req: RequestAutenticado,
    res: Response
): Promise<void> => {
    try {
        if (!req.usuario) {
            res.status(401).json({
                mensaje:
                    'Usuario no autenticado',
            });
            return;
        }

        const usuario =
            await obtenerPerfil(
                req.usuario.id
            );

        res.status(200).json(usuario);
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener perfil';

        res.status(404).json({
            mensaje,
        });
    }
};