
import {Administrador, Persona} from '../models';
import {DatosCrearAdministrador} from '../interfaces/administrador.interface';
import {AppError} from '../utils/app-error';

export const crearAdministrador = async (
    datos: DatosCrearAdministrador
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

    const administradorExistente =
        await Administrador.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (administradorExistente) {
        throw new AppError(
            'La persona ya es administrador',
            409
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
        throw new AppError(
            'Administrador no encontrado',
            404
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
        throw new AppError(
            'Administrador no encontrado',
            404
        );
    }

    await administrador.destroy();
};
