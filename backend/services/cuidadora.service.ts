import {Cuidadora, Persona} from '../models';
import {DatosCrearCuidadora} from '../interfaces/cuidadora.interface';
import {AppError} from '../utils/app-error';

export const crearCuidadora = async (
    datos: DatosCrearCuidadora
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

    const cuidadoraExistente =
        await Cuidadora.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (cuidadoraExistente) {
        throw new AppError(
            'La persona ya es cuidadora',
            409
        );
    }

    const cuidadora =
        await Cuidadora.create({
            persona_id:
                datos.persona_id
        });

    return cuidadora;
};

export const obtenerCuidadora = async (
    id: number
) => {
    const cuidadora =
        await Cuidadora.findByPk(
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

    if (!cuidadora) {
        throw new AppError(
            'Cuidadora no encontrada',
            404
        );
    }

    return cuidadora;
};

export const listarCuidadoras = async () => {
    return await Cuidadora.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

export const eliminarCuidadora = async (
    id: number
) => {
    const cuidadora =
        await Cuidadora.findByPk(id);

    if (!cuidadora) {
        throw new AppError(
            'Cuidadora no encontrada',
            404
        );
    }

    await cuidadora.destroy();
};