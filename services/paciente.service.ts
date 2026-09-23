import {Paciente, Persona} from '../models';

interface DatosCrearPaciente {
    persona_id: number;
    direccion?: string | null;
    obra_social?: string | null;
    observaciones?: string | null;
}

interface DatosActualizarPaciente {
    direccion?: string | null;
    obra_social?: string | null;
    observaciones?: string | null;
    activo?: boolean;
}

export const crearPaciente = async (
    datos: DatosCrearPaciente
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

    const pacienteExistente =
        await Paciente.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (pacienteExistente) {
        throw new Error(
            'La persona ya es paciente'
        );
    }

    const paciente =
        await Paciente.create({
            persona_id:
                datos.persona_id,
            direccion:
                datos.direccion ?? null,
            obra_social:
                datos.obra_social ?? null,
            observaciones:
                datos.observaciones ?? null,
            activo: true
        });

    return paciente;
};

export const obtenerPaciente = async (
    id: number
) => {
    const paciente =
        await Paciente.findByPk(
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

    if (!paciente) {
        throw new Error(
            'Paciente no encontrado'
        );
    }

    return paciente;
};

export const listarPacientes = async () => {
    return await Paciente.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

export const actualizarPaciente = async (
    id: number,
    datos: DatosActualizarPaciente
) => {
    const paciente =
        await Paciente.findByPk(id);

    if (!paciente) {
        throw new Error(
            'Paciente no encontrado'
        );
    }

    await paciente.update(datos);

    return paciente;
};

export const eliminarPaciente = async (
    id: number
) => {
    const paciente =
        await Paciente.findByPk(id);

    if (!paciente) {
        throw new Error(
            'Paciente no encontrado'
        );
    }

    await paciente.destroy();
};
