import { Request, Response, NextFunction } from 'express';

export const validarMedicamento = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        nombre,
        presentacion,
        cantidad,
    } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({
            mensaje: 'El nombre del medicamento es obligatorio',
        });
        return;
    }

    if (!presentacion || typeof presentacion !== 'string') {
        res.status(400).json({
            mensaje: 'La presentación es obligatoria',
        });
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        res.status(400).json({
            mensaje: 'La cantidad debe ser un entero mayor que cero',
        });
        return;
    }

    next();
};