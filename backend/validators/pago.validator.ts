import { Request, Response, NextFunction } from 'express';

const mediosPagoPermitidos = [
    'efectivo',
    'tarjeta',
    'transferencia',
    'qr',
    'obra_social',
];

const estadosPermitidos = [
    'pendiente',
    'pagado',
    'vencido',
];

export const validarPago = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        paciente_id,
        periodo,
        monto,
        fecha_pago,
        medio_pago,
        estado,
        observaciones,
    } = req.body;

    if (!Number.isInteger(paciente_id) || paciente_id <= 0) {
        res.status(400).json({
            mensaje: 'paciente_id debe ser un número entero válido',
        });
        return;
    }

    if (!periodo || Number.isNaN(Date.parse(periodo))) {
        res.status(400).json({
            mensaje: 'El período es obligatorio y debe ser válido',
        });
        return;
    }

    if (
        typeof monto !== 'number' ||
        !Number.isFinite(monto) ||
        monto < 0
    ) {
        res.status(400).json({
            mensaje: 'El monto debe ser un número mayor o igual a cero',
        });
        return;
    }

    if (fecha_pago !== undefined && fecha_pago !== null) {
        if (Number.isNaN(Date.parse(fecha_pago))) {
            res.status(400).json({
                mensaje: 'La fecha de pago no es válida',
            });
            return;
        }
    }

    if (
        medio_pago !== undefined &&
        medio_pago !== null &&
        !mediosPagoPermitidos.includes(medio_pago)
    ) {
        res.status(400).json({
            mensaje: 'El medio de pago no es válido',
        });
        return;
    }

    if (
        estado !== undefined &&
        !estadosPermitidos.includes(estado)
    ) {
        res.status(400).json({
            mensaje: 'El estado del pago no es válido',
        });
        return;
    }

    if (
        observaciones !== undefined &&
        observaciones !== null &&
        typeof observaciones !== 'string'
    ) {
        res.status(400).json({
            mensaje: 'Las observaciones no son válidas',
        });
        return;
    }

    next();
};