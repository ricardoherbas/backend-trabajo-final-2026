import {Request, Response} from 'express';
import {crearMedicamento, obtenerMedicamento, listarMedicamentos, actualizarMedicamento, eliminarMedicamento} from '../services/medicamentos.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const medicamento =
            await crearMedicamento(req.body);

        res.status(201).json({
            mensaje:
                'Medicamento creado correctamente',
            medicamento
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear medicamento';

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

        const medicamento =
            await obtenerMedicamento(id);

        res.status(200).json(
            medicamento
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener medicamento';

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
        const medicamentos =
            await listarMedicamentos();

        res.status(200).json(
            medicamentos
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener medicamentos';

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

        const medicamento =
            await actualizarMedicamento(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Medicamento actualizado correctamente',
            medicamento
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar medicamento';

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

        await eliminarMedicamento(id);

        res.status(200).json({
            mensaje:
                'Medicamento eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar medicamento';

        res.status(404).json({
            mensaje
        });
    }
};
