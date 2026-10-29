import { Response, NextFunction } from 'express';
import { RequestAutenticado } from './auth.middleware';

type Rol =
    | 'administrador'
    | 'secretaria'
    | 'cuidadora'
    | 'familiar';

export const verificarRol = (...rolesPermitidos: Rol[]) => {
    return (
        req: RequestAutenticado,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.usuario) {
            res.status(401).json({
                mensaje: 'Usuario no autenticado',
            });
            return;
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            res.status(403).json({
                mensaje: 'No tiene permisos para realizar esta acción',
            });
            return;
        }

        next();
    };
};