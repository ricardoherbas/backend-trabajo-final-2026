import {Familiar, Persona} from '../models';
import {DatosCrearFamiliar} from '../interfaces/familiar.interface';

export const crearFamiliar = async (
    datos: DatosCrearFamiliar
) => {
    const persona =
        await Persona.findByPk(
            datos.persona_id
        );

    if (!persona) {
        throw new Error(
            'La persona no existe'
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
        throw new Error(
            'La persona ya es familiar'
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
        throw new Error(
            'Familiar no encontrado'
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
        throw new Error(
            'Familiar no encontrado'
        );
    }

    await familiar.destroy();
};