import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {
    crearPaciente,
    obtenerPaciente,
    listarPacientes,
    actualizarPaciente,
    eliminarPaciente
} from '../services/paciente.service';

export const crear = async (
    req: Request,
    res: Response,
    next: NextFunction
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

        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const paciente =
            await obtenerPaciente(
                id,
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            paciente
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

        const personaIdCuidadora =
            req.usuario?.rol === 'cuidadora'
                ? req.usuario.persona_id
                : undefined;

        const pacientes =
            await listarPacientes(
                personaIdFamiliar,
                personaIdCuidadora
            );

        res.status(200).json(
            pacientes
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

        await eliminarPaciente(id);

        res.status(200).json({
            mensaje:
                'Paciente eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};