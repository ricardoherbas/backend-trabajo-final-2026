import {Request, Response, NextFunction} from 'express';

export const validarVinculoFamiliar = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {
        familiar_id,
        paciente_id,
        parentesco,
        es_contacto_principal
    } = req.body;

    if (!Number.isInteger(familiar_id) || familiar_id <= 0) {
        res.status(400).json({
            mensaje: 'familiar_id debe ser un número entero válido'
        });
        return;
    }

    if (!Number.isInteger(paciente_id) || paciente_id <= 0) {
        res.status(400).json({
            mensaje: 'paciente_id debe ser un número entero válido'
        });
        return;
    }

    if (!parentesco || typeof parentesco !== 'string') {
        res.status(400).json({
            mensaje: 'El parentesco es obligatorio'
        });
        return;
    }

    if (
        es_contacto_principal !== undefined &&
        typeof es_contacto_principal !== 'boolean'
    ) {
        res.status(400).json({
            mensaje: 'es_contacto_principal debe ser booleano'
        });
        return;
    }

    next();
};