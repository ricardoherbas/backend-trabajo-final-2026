import {Request, Response, NextFunction} from 'express';

export const validarActualizacionVinculoFamiliar = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const camposPermitidos = [
        'parentesco',
        'es_contacto_principal'
    ];

    const camposEnviados = Object.keys(req.body);

    if (camposEnviados.length === 0) {
        res.status(400).json({
            mensaje: 'Debe enviar al menos un campo para actualizar'
        });
        return;
    }

    const campoNoPermitido = camposEnviados.find(
        campo => !camposPermitidos.includes(campo)
    );

    if (campoNoPermitido) {
        res.status(400).json({
            mensaje: `El campo ${campoNoPermitido} no está permitido`
        });
        return;
    }

    const {parentesco, es_contacto_principal} = req.body;

    if (
        parentesco !== undefined &&
        (typeof parentesco !== 'string' || !parentesco.trim())
    ) {
        res.status(400).json({
            mensaje: 'El parentesco debe ser un texto válido'
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