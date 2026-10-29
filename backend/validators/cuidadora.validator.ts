import { Request, Response, NextFunction } from 'express';

export const validarCuidadora = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { persona_id } = req.body;

    if (!Number.isInteger(persona_id) || persona_id <= 0) {
        res.status(400).json({
            mensaje: 'persona_id debe ser un número entero válido',
        });
        return;
    }

    next();
};