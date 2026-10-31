import { Op } from 'sequelize';
import { Tratamiento, Paciente, Medicamento } from '../models';
import {
    DatosCrearTratamiento,
    DatosActualizarTratamiento
} from '../interfaces/tratamiento.interface';
import { AppError } from '../utils/app-error';
import { obtenerPacientesVinculados } from './vinculoFamiliar.service';
import { obtenerPacientesAsignados } from './asignacion.service';

export const crearTratamiento = async (
    datos: DatosCrearTratamiento
) => {
    const paciente =
        await Paciente.findByPk(
            datos.paciente_id
        );

    if (!paciente) {
        throw new AppError(
            'El paciente no existe',
            404
        );
    }

    const medicamento =
        await Medicamento.findByPk(
            datos.medicamento_id
        );

    if (!medicamento) {
        throw new AppError(
            'El medicamento no existe',
            404
        );
    }

    const tratamiento =
        await Tratamiento.create({
            paciente_id:
                datos.paciente_id,
            medicamento_id:
                datos.medicamento_id,
            dosis:
                datos.dosis,
            frecuencia:
                datos.frecuencia,
            horario:
                datos.horario ?? null,
            desde:
                datos.desde ?? null,
            hasta:
                datos.hasta ?? null,
            activa:
                datos.activa ?? true
        });

    return tratamiento;
};

export const obtenerTratamiento = async (
    id: number,
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    const where: {
        id: number;
        paciente_id?: {
            [Op.in]: number[];
        };
    } = { id };

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        where.paciente_id = {
            [Op.in]: pacienteIds
        };
    }

    if (personaIdCuidadora !== undefined) {
        const pacienteIds =
            await obtenerPacientesAsignados(
                personaIdCuidadora
            );

        where.paciente_id = {
            [Op.in]: pacienteIds
        };
    }

    const tratamiento =
        await Tratamiento.findOne({
            where,
            include: [
                {
                    model: Paciente,
                    as: 'paciente'
                },
                {
                    model: Medicamento,
                    as: 'medicamento'
                }
            ]
        });

    if (!tratamiento) {
        throw new AppError(
            'Tratamiento no encontrado',
            404
        );
    }

    return tratamiento;
};

export const listarTratamientos = async (
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    const where: {
        paciente_id?: {
            [Op.in]: number[];
        };
    } = {};

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        where.paciente_id = {
            [Op.in]: pacienteIds
        };
    }

    if (personaIdCuidadora !== undefined) {
        const pacienteIds =
            await obtenerPacientesAsignados(
                personaIdCuidadora
            );

        where.paciente_id = {
            [Op.in]: pacienteIds
        };
    }

    return await Tratamiento.findAll({
        where,
        include: [
            {
                model: Paciente,
                as: 'paciente'
            },
            {
                model: Medicamento,
                as: 'medicamento'
            }
        ]
    });
};

export const actualizarTratamiento = async (
    id: number,
    datos: DatosActualizarTratamiento
) => {
    const tratamiento =
        await Tratamiento.findByPk(id);

    if (!tratamiento) {
        throw new AppError(
            'Tratamiento no encontrado',
            404
        );
    }

    if (datos.paciente_id !== undefined) {
        const paciente =
            await Paciente.findByPk(
                datos.paciente_id
            );

        if (!paciente) {
            throw new AppError(
                'El paciente no existe',
                404
            );
        }
    }

    if (datos.medicamento_id !== undefined) {
        const medicamento =
            await Medicamento.findByPk(
                datos.medicamento_id
            );

        if (!medicamento) {
            throw new AppError(
                'El medicamento no existe',
                404
            );
        }
    }

    await tratamiento.update(datos);

    return tratamiento;
};

export const eliminarTratamiento = async (
    id: number
) => {
    const tratamiento =
        await Tratamiento.findByPk(id);

    if (!tratamiento) {
        throw new AppError(
            'Tratamiento no encontrado',
            404
        );
    }

    await tratamiento.destroy();
};