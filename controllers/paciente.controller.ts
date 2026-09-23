import {Request, Response} from 'express';
import {crearPaciente, obtenerPaciente, listarPacientes, actualizarPaciente, eliminarPaciente} from '../services/paciente.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const paciente =
            await crearPaciente(req.body);

        res.status(201).json({
            mensaje:
                'Paciente creado correctamente',
            paciente
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear paciente';

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

        const paciente =
            await obtenerPaciente(id);

        res.status(200).json(
            paciente
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener paciente';

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
        const pacientes =
            await listarPacientes();

        res.status(200).json(
            pacientes
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener pacientes';

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

        const paciente =
            await actualizarPaciente(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Paciente actualizado correctamente',
            paciente
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar paciente';

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

        await eliminarPaciente(id);

        res.status(200).json({
            mensaje:
                'Paciente eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar paciente';

        res.status(404).json({
            mensaje
        });
    }
};