import {Administrador, Persona} from '../models';

interface DatosCrearAdministrador {
    persona_id: number;
}

export const crearAdministrador = async (
    datos: DatosCrearAdministrador
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

    const administradorExistente =
        await Administrador.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (administradorExistente) {
        throw new Error(
            'La persona ya es administrador'
        );
    }

    const administrador =
        await Administrador.create({
            persona_id:
                datos.persona_id
        });

    return administrador;
};

export const obtenerAdministrador = async (
    id: number
) => {
    const administrador =
        await Administrador.findByPk(
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

    if (!administrador) {
        throw new Error(
            'Administrador no encontrado'
        );
    }

    return administrador;
};

export const listarAdministradores = async () => {
    return await Administrador.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

export const eliminarAdministrador = async (
    id: number
) => {
    const administrador =
        await Administrador.findByPk(id);

    if (!administrador) {
        throw new Error(
            'Administrador no encontrado'
        );
    }

    await administrador.destroy();
};
