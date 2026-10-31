
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {Usuario} from '../models';

interface DatosToken {
    id: number;
    persona_id: number;
    rol: 'administrador' | 'secretaria' | 'cuidadora' | 'familiar';
}

export interface RequestAutenticado extends Request {
    usuario?: DatosToken;
}

export const verificarToken = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
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

    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        res.status(500).json({
            mensaje: 'JWT_SECRET no configurado'
        });
        return;
    }

    let datos: DatosToken;

    try {
        datos = jwt.verify(partes[1], secreto) as DatosToken;
    } catch {
        res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
        return;
    }

    try {
        const usuario = await Usuario.findByPk(datos.id);

        if (!usuario || !usuario.activo) {
            res.status(401).json({
                mensaje: 'La cuenta no existe o está desactivada'
            });
            return;
        }

        if (
            usuario.persona_id !== datos.persona_id ||
            usuario.rol !== datos.rol
        ) {
            res.status(401).json({
                mensaje: 'La sesión ya no es válida. Iniciá sesión nuevamente'
            });
            return;
        }

        req.usuario = datos;
        next();
    } catch {
        res.status(500).json({
            mensaje: 'Error al verificar la sesión'
        });
    }
};
