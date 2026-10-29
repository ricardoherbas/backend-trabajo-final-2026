import {Request, Response} from 'express';
import {crearTratamiento, obtenerTratamiento, listarTratamientos, actualizarTratamiento, eliminarTratamiento} from '../services/tratamiento.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const tratamiento =
            await crearTratamiento(req.body);

        res.status(201).json({
            mensaje:
                'Tratamiento creado correctamente',
            tratamiento
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear tratamiento';

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

        const tratamiento =
            await obtenerTratamiento(id);

        res.status(200).json(
            tratamiento
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener tratamiento';

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
        const tratamientos =
            await listarTratamientos();

        res.status(200).json(
            tratamientos
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener tratamientos';

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

        const tratamiento =
            await actualizarTratamiento(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Tratamiento actualizado correctamente',
            tratamiento
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar tratamiento';

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

        await eliminarTratamiento(id);

        res.status(200).json({
            mensaje:
                'Tratamiento eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar tratamiento';

        res.status(404).json({
            mensaje
        });
    }
};
