import { Request, Response, NextFunction } from 'express';

const diasPermitidos = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
];

export const validarTurno = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        dia_semana,
        hora_inicio,
        hora_fin,
        activo,
    } = req.body;

    if (!dia_semana || typeof dia_semana !== 'string') {
        res.status(400).json({
            mensaje: 'El día de la semana es obligatorio',
        });
        return;
    }

    if (!diasPermitidos.includes(dia_semana)) {
        res.status(400).json({
            mensaje: 'El día de la semana no es válido',
        });
        return;
    }

    if (!hora_inicio || typeof hora_inicio !== 'string') {
        res.status(400).json({
            mensaje: 'La hora de inicio es obligatoria',
        });
        return;
    }

    if (!hora_fin || typeof hora_fin !== 'string') {
        res.status(400).json({
            mensaje: 'La hora de fin es obligatoria',
        });
        return;
    }

    if (hora_fin <= hora_inicio) {
        res.status(400).json({
            mensaje: 'La hora de fin debe ser posterior a la hora de inicio',
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