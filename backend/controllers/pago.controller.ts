import {Request, Response} from 'express';
import {crearPago, obtenerPago, listarPagos, actualizarPago, eliminarPago} from '../services/pago.service';

export const crear = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear pago';

        res.status(400).json({
            mensaje
        });
    }
};

export const obtener = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const pago =
            await obtenerPago(id);

        res.status(200).json(
            pago
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener pago';

        res.status(404).json({
            mensaje
        });
    }
};

export const listar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const pagos =
            await listarPagos();

        res.status(200).json(
            pagos
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener pagos';

        res.status(500).json({
            mensaje
        });
    }
};

export const actualizar = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar pago';

        res.status(400).json({
            mensaje
        });
    }
};

export const eliminar = async (
    req: Request,
    res: Response
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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar pago';

        res.status(404).json({
            mensaje
        });
    }
};
