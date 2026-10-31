
import {Request, Response, NextFunction} from 'express';
import {
    registrarFamiliar,
    iniciarSesion,
    obtenerPerfil,
    solicitarRecuperacionPassword,
    restablecerPassword
} from '../services/auth.service';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {AppError} from '../utils/app-error';

export const registrar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const usuario = await registrarFamiliar(req.body);

        res.status(201).json({
            mensaje: 'Familiar registrado correctamente',
            usuario
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const resultado = await iniciarSesion(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const perfil = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.usuario) {
            throw new AppError(
                'Usuario no autenticado',
                401
            );
        }

        const usuario = await obtenerPerfil(
            req.usuario.id
        );

        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const solicitarRecuperacion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {email} = req.body;

        if (!email || typeof email !== 'string') {
            throw new AppError(
                'Debés ingresar un email válido',
                400
            );
        }

        const resultado =
            await solicitarRecuperacionPassword(email);

        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const restablecer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {token, nuevaPassword} = req.body;

        if (
            !token ||
            typeof token !== 'string' ||
            !nuevaPassword ||
            typeof nuevaPassword !== 'string'
        ) {
            throw new AppError(
                'El token y la nueva contraseña son obligatorios',
                400
            );
        }

        const resultado = await restablecerPassword(
            token,
            nuevaPassword
        );

        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
