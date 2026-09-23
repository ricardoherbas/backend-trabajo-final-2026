import {Request, Response} from 'express';
import {crearVinculoFamiliar, obtenerVinculoFamiliar, listarVinculosFamiliares, actualizarVinculoFamiliar, eliminarVinculoFamiliar} from '../services/vinculoFamiliar.service';

export const crear = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const vinculo =
            await crearVinculoFamiliar(req.body);

        res.status(201).json({
            mensaje:
                'Vínculo familiar creado correctamente',
            vinculo
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al crear vínculo familiar';

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

        const vinculo =
            await obtenerVinculoFamiliar(id);

        res.status(200).json(
            vinculo
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener vínculo familiar';

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
        const vinculos =
            await listarVinculosFamiliares();

        res.status(200).json(
            vinculos
        );
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al obtener vínculos familiares';

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
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al actualizar vínculo familiar';

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

        await eliminarVinculoFamiliar(id);

        res.status(200).json({
            mensaje:
                'Vínculo familiar eliminado correctamente'
        });
    } catch (error) {
        const mensaje =
            error instanceof Error
                ? error.message
                : 'Error al eliminar vínculo familiar';

        res.status(404).json({
            mensaje
        });
    }
};
