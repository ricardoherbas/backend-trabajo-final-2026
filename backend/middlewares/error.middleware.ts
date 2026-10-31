
import {Request, Response, NextFunction} from 'express';
import {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError
} from 'sequelize';
import {AppError} from '../utils/app-error';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(error);

    if (res.headersSent) {
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            mensaje: error.message
        });

        return;
    }

    if (error instanceof ValidationError) {
        res.status(400).json({
            mensaje: 'Los datos enviados no son válidos'
        });

        return;
    }

    if (error instanceof UniqueConstraintError) {
        res.status(409).json({
            mensaje: 'El registro ya existe'
        });

        return;
    }

    if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json({
            mensaje: 'No se puede realizar la operación porque existen registros relacionados'
        });

        return;
    }

    res.status(500).json({
        mensaje: 'Error interno del servidor'
    });
};
