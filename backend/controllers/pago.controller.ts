import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {crearPago, obtenerPago, listarPagos, actualizarPago, eliminarPago} from '../services/pago.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const pago =
            await crearPago(req.body);

        res.status(201).json({
            mensaje:
                'Pago creado correctamente',
            pago
        });
    } catch (error) {
        next(error);
    }
};

export const obtener = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const personaIdFamiliar =
            req.usuario?.rol === 'familiar'
                ? req.usuario.persona_id
                : undefined;

        const pago =
            await obtenerPago(
                id,
                personaIdFamiliar
            );

        res.status(200).json(
            pago
        );
    } catch (error) {
        next(error);
    }
};

export const listar = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const personaIdFamiliar =
            req.usuario?.rol === 'familiar'
                ? req.usuario.persona_id
                : undefined;

        const pagos =
            await listarPagos(
                personaIdFamiliar
            );

        res.status(200).json(
            pagos
        );
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const pago =
            await actualizarPago(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Pago actualizado correctamente',
            pago
        });
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        await eliminarPago(id);

        res.status(200).json({
            mensaje:
                'Pago eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};