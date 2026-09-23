import { Secretaria, Persona } from '../models';

interface DatosCrearSecretaria {
    persona_id: number;
}
export const crearSecretaria = async (datos: DatosCrearSecretaria) => {
    const persona = await Persona.findByPk(datos.persona_id);
    if (!persona) {
        throw new Error('La persona no existe');
    }
    const secretariaExistente = await Secretaria.findOne({
        where: {
            persona_id: datos.persona_id
        }
    });
    if (secretariaExistente) {
        throw new Error('La persona ya es secretaria');
    }
    const secretaria = await Secretaria.create({
        persona_id: datos.persona_id
    });
    return secretaria;
};
export const obtenerSecretaria = async (id: number) => {
    const secretaria = await Secretaria.findByPk(id, {
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
    if (!secretaria) {
        throw new Error('Secretaria no encontrada');
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
export const eliminarSecretaria = async (id: number) => {
    const secretaria = await Secretaria.findByPk(id);
    if (!secretaria) {
        throw new Error('Secretaria no encontrada');
    }
    await secretaria.destroy();
};

