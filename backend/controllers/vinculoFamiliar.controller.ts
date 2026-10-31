import {Request, Response, NextFunction} from 'express';
import {RequestAutenticado} from '../middlewares/auth.middleware';
import {crearVinculoFamiliar,
    obtenerVinculoFamiliar,
    listarVinculosFamiliares,
    actualizarVinculoFamiliar,
    desactivarVinculoFamiliar,
    activarVinculoFamiliar
} from '../services/vinculoFamiliar.service';

export const crear = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const vinculo =
            await crearVinculoFamiliar(req.body);

        res.status(201).json({
            mensaje:
                'Vínculo familiar creado correctamente',
            vinculo: {
                id: vinculo.id,
                familiar_id: vinculo.familiar_id,
                paciente_id: vinculo.paciente_id,
                parentesco: vinculo.parentesco,
                es_contacto_principal: vinculo.es_contacto_principal,
                codigo_vinculacion: vinculo.codigo_vinculacion,
                expira_en: vinculo.expira_en
            }
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

        const vinculo =
            await obtenerVinculoFamiliar(
                id,
                personaIdFamiliar
            );

        res.status(200).json(
            vinculo
        );
    } catch (error) {
        next(error);
    }
};

export const listar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const vinculos =
            await listarVinculosFamiliares();

        res.status(200).json(
            vinculos
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

        const vinculo =
            await actualizarVinculoFamiliar(
                id,
                req.body
            );

        res.status(200).json({
            mensaje:
                'Vínculo familiar actualizado correctamente',
            vinculo
        });
    } catch (error) {
        next(error);
    }
};

export const desactivar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const vinculo =
            await desactivarVinculoFamiliar(id);

        res.status(200).json({
            mensaje:
                'Vínculo familiar desactivado correctamente',
            vinculo: {
                id: vinculo.id,
                familiar_id: vinculo.familiar_id,
                paciente_id: vinculo.paciente_id,
                activo: vinculo.activo
            }
        });
    } catch (error) {
        next(error);
    }
};

export const activar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id =
            Number(req.params.id);

        const vinculo =
            await activarVinculoFamiliar(id);

        res.status(200).json({
            mensaje:
                'Vínculo familiar activado correctamente',
            vinculo: {
                id: vinculo.id,
                familiar_id: vinculo.familiar_id,
                paciente_id: vinculo.paciente_id,
                activo: vinculo.activo
            }
        });
    } catch (error) {
        next(error);
    }
};