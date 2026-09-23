import { Request, Response, NextFunction } from 'express';

export const validarAsignacion = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        turno_id,
        cuidador_id,
        paciente_id,
        activo,
    } = req.body;

    if (!Number.isInteger(turno_id) || turno_id <= 0) {
        res.status(400).json({
            mensaje: 'turno_id debe ser un número entero válido',
        });
        return;
    }

    if (!Number.isInteger(cuidador_id) || cuidador_id <= 0) {
        res.status(400).json({
            mensaje: 'cuidador_id debe ser un número entero válido',
        });
        return;
    }

    if (!Number.isInteger(paciente_id) || paciente_id <= 0) {
        res.status(400).json({
            mensaje: 'paciente_id debe ser un número entero válido',
        });
        return;
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        res.status(400).json({
            mensaje: 'activo debe ser booleano',
        });
        return;
    }

    next();
};