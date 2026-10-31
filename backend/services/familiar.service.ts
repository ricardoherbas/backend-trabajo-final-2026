import {Familiar, Persona} from '../models';
import {DatosCrearFamiliar} from '../interfaces/familiar.interface';
import {AppError} from '../utils/app-error';

export const crearFamiliar = async (
    datos: DatosCrearFamiliar
) => {
    const persona =
        await Persona.findByPk(
            datos.persona_id
        );

    if (!persona) {
        throw new AppError(
            'La persona no existe',
            404
        );
    }

    const familiarExistente =
        await Familiar.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (familiarExistente) {
        throw new AppError(
            'La persona ya es familiar',
            409
        );
    }

    const familiar =
        await Familiar.create({
            persona_id:
                datos.persona_id
        });

    return familiar;
};

export const obtenerFamiliar = async (
    id: number
) => {
    const familiar =
        await Familiar.findByPk(
            id,
            {
                include: [
                    {
                        model: Persona,
                        as: 'persona'
                    }
                ]
            }
        );

    if (!familiar) {
        throw new AppError(
            'Familiar no encontrado',
            404
        );
    }

    return familiar;
};

export const listarFamiliares = async () => {
    return await Familiar.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

export const eliminarFamiliar = async (
    id: number
) => {
    const familiar =
        await Familiar.findByPk(id);

    if (!familiar) {
        throw new AppError(
            'Familiar no encontrado',
            404
        );
    }

    await familiar.destroy();
};