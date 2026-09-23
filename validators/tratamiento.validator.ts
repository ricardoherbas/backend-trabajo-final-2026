import { Request, Response, NextFunction } from 'express';

export const validarTratamiento = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        paciente_id,
        medicamento_id,
        dosis,
        frecuencia,
        horario,
        desde,
        hasta,
        activa,
    } = req.body;

    if (!Number.isInteger(paciente_id) || paciente_id <= 0) {
        res.status(400).json({
            mensaje: 'paciente_id debe ser un número entero válido',
        });
        return;
    }

    if (!Number.isInteger(medicamento_id) || medicamento_id <= 0) {
        res.status(400).json({
            mensaje: 'medicamento_id debe ser un número entero válido',
        });
        return;
    }

    if (!dosis || typeof dosis !== 'string') {
        res.status(400).json({
            mensaje: 'La dosis es obligatoria',
        });
        return;
    }

    if (!frecuencia || typeof frecuencia !== 'string') {
        res.status(400).json({
            mensaje: 'La frecuencia es obligatoria',
        });
        return;
    }

    if (
        horario !== undefined &&
        horario !== null &&
        typeof horario !== 'string'
    ) {
        res.status(400).json({
            mensaje: 'El horario no es válido',
        });
        return;
    }

    if (desde !== undefined && desde !== null) {
        if (Number.isNaN(Date.parse(desde))) {
            res.status(400).json({
                mensaje: 'La fecha desde no es válida',
            });
            return;
        }
    }

    if (hasta !== undefined && hasta !== null) {
        if (Number.isNaN(Date.parse(hasta))) {
            res.status(400).json({
                mensaje: 'La fecha hasta no es válida',
            });
            return;
        }
    }

    if (
        desde !== undefined &&
        desde !== null &&
        hasta !== undefined &&
        hasta !== null
    ) {
        if (new Date(hasta) < new Date(desde)) {
            res.status(400).json({
                mensaje: 'La fecha hasta no puede ser anterior a desde',
            });
            return;
        }
    }

    if (activa !== undefined && typeof activa !== 'boolean') {
        res.status(400).json({
            mensaje: 'activa debe ser booleano',
        });
        return;
    }

    next();
};