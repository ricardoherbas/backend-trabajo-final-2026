import {Op} from 'sequelize';
import {Paciente, Persona} from '../models';
import {
    DatosCrearPaciente,
    DatosActualizarPaciente
} from '../interfaces/paciente.interface';
import {obtenerPacientesVinculados} from './vinculoFamiliar.service';
import {obtenerPacientesAsignados} from './asignacion.service';
import {AppError} from '../utils/app-error';

export const crearPaciente = async (
    datos: DatosCrearPaciente
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

    const pacienteExistente =
        await Paciente.findOne({
            where: {
                persona_id:
                    datos.persona_id
            }
        });

    if (pacienteExistente) {
        throw new AppError(
            'La persona ya es paciente',
            409
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
            activo:
                true
        });

    return paciente;
};

export const obtenerPaciente = async (
    id: number,
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        if (!pacienteIds.includes(id)) {
            throw new AppError(
                'Paciente no encontrado',
                404
            );
        }
    }

    if (personaIdCuidadora !== undefined) {
        const pacienteIds =
            await obtenerPacientesAsignados(
                personaIdCuidadora
            );

        if (!pacienteIds.includes(id)) {
            throw new AppError(
                'Paciente no encontrado',
                404
            );
        }
    }

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
        throw new AppError(
            'Paciente no encontrado',
            404
        );
    }

    return paciente;
};

export const listarPacientes = async (
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    let where = {};

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        where = {
            id: {
                [Op.in]: pacienteIds
            }
        };
    }

    if (personaIdCuidadora !== undefined) {
        const pacienteIds =
            await obtenerPacientesAsignados(
                personaIdCuidadora
            );

        where = {
            id: {
                [Op.in]: pacienteIds
            }
        };
    }

    return await Paciente.findAll({
        where,
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
        throw new AppError(
            'Paciente no encontrado',
            404
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
        throw new AppError(
            'Paciente no encontrado',
            404
        );
    }

    await paciente.destroy();
};