import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface DatosToken {
    id: number;
    persona_id: number;
    rol:
        | 'administrador'
        | 'secretaria'
        | 'cuidadora'
        | 'familiar';
}

export interface RequestAutenticado extends Request {
    usuario?: DatosToken;
}

export const verificarToken = (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(401).json({
                mensaje: 'Token no proporcionado'
            });
            return;
        }

        const partes = authorization.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
            return;
        }

        const token = partes[1];

        const secreto = process.env.JWT_SECRET;

        if (!secreto) {
            res.status(500).json({
                mensaje: 'JWT_SECRET no configurado'
            });
            return;
        }

        const datos = jwt.verify(token, secreto) as DatosToken;

        req.usuario = datos;

        next();
    } catch {
        res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};
