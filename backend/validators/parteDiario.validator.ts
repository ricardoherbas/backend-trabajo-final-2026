import { Request, Response, NextFunction } from 'express';

export const validarParteDiario = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        asignacion_id,
        fecha,
        animo,
        alimentacion,
        descanso,
        higiene,
        novedades,
        observaciones,
    } = req.body;

    if (!Number.isInteger(asignacion_id) || asignacion_id <= 0) {
        res.status(400).json({
            mensaje: 'asignacion_id debe ser un número entero válido',
        });
        return;
    }

    if (!fecha || Number.isNaN(Date.parse(fecha))) {
        res.status(400).json({
            mensaje: 'La fecha es obligatoria y debe ser válida',
        });
        return;
    }

    const camposTexto = {
        animo,
        alimentacion,
        descanso,
        higiene,
        novedades,
        observaciones,
    };

    for (const [campo, valor] of Object.entries(camposTexto)) {
        if (valor !== undefined && valor !== null && typeof valor !== 'string') {
            res.status(400).json({
                mensaje: `${campo} no es válido`,
            });
            return;
        }
    }

    next();
};