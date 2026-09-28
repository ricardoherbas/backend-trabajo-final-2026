import {Cuidadora, Persona} from '../models';
import {DatosCrearCuidadora} from '../interfaces/cuidadora.interface';
export const crearCuidadora = async (
    datos: DatosCrearCuidadora
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
    const cuidadoraExistente =
        await Cuidadora.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });
    if (cuidadoraExistente) {
        throw new Error(
            'La persona ya es cuidadora'
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
        throw new Error(
            'Cuidadora no encontrada'
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
        throw new Error(
            'Cuidadora no encontrada'
        );
    }
    await cuidadora.destroy();
};