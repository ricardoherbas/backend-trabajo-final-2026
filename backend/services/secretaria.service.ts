import {Secretaria, Persona} from '../models';
import {DatosCrearSecretaria} from '../interfaces/secretaria.interface';
import {AppError} from '../utils/app-error';

export const crearSecretaria = async (
    datos: DatosCrearSecretaria
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

    const secretariaExistente =
        await Secretaria.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (secretariaExistente) {
        throw new AppError(
            'La persona ya es secretaria',
            409
        );
    }

    const secretaria =
        await Secretaria.create({
            persona_id:
                datos.persona_id
        });

    return secretaria;
};

export const obtenerSecretaria = async (
    id: number
) => {
    const secretaria =
        await Secretaria.findByPk(
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

    if (!secretaria) {
        throw new AppError(
            'Secretaria no encontrada',
            404
        );
    }

    return secretaria;
};

export const listarSecretarias = async () => {
    return await Secretaria.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

export const eliminarSecretaria = async (
    id: number
) => {
    const secretaria =
        await Secretaria.findByPk(id);

    if (!secretaria) {
        throw new AppError(
            'Secretaria no encontrada',
            404
        );
    }

    await secretaria.destroy();
};