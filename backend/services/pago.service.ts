import {Op} from 'sequelize';
import {Pago, Paciente} from '../models';
import {DatosCrearPago, DatosActualizarPago} from '../interfaces/pago.interface';
import {obtenerPacientesVinculados} from './vinculoFamiliar.service';
import {AppError} from '../utils/app-error';

export const crearPago = async (
    datos: DatosCrearPago
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

    const pagoExistente =
        await Pago.findOne({
            where: {
                paciente_id:
                    datos.paciente_id,
                periodo:
                    datos.periodo
            }
        });

    if (pagoExistente) {
        throw new AppError(
            'Ya existe un pago para este paciente y período',
            409
        );
    }

    const pago =
        await Pago.create({
            paciente_id:
                datos.paciente_id,
            periodo:
                datos.periodo,
            monto:
                datos.monto,
            fecha_pago:
                datos.fecha_pago ?? null,
            medio_pago:
                datos.medio_pago ?? null,
            observaciones:
                datos.observaciones ?? null,
            estado:
                datos.estado ?? 'pendiente'
        });

    return pago;
};

export const obtenerPago = async (
    id: number,
    personaIdFamiliar?: number
) => {
    const where: {
        id: number;
        paciente_id?: {
            [Op.in]: number[];
        };
    } = {id};

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        where.paciente_id = {
            [Op.in]: pacienteIds
        };
    }

    const pago =
        await Pago.findOne({
            where,
            include: [
                {
                    model: Paciente,
                    as: 'paciente'
                }
            ]
        });

    if (!pago) {
        throw new AppError(
            'Pago no encontrado',
            404
        );
    }

    return pago;
};

export const listarPagos = async (
    personaIdFamiliar?: number
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

    return await Pago.findAll({
        where,
        include: [
            {
                model: Paciente,
                as: 'paciente'
            }
        ]
    });
};

export const actualizarPago = async (
    id: number,
    datos: DatosActualizarPago
) => {
    const pago =
        await Pago.findByPk(id);

    if (!pago) {
        throw new AppError(
            'Pago no encontrado',
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

    await pago.update(datos);

    return pago;
};

export const eliminarPago = async (
    id: number
) => {
    const pago =
        await Pago.findByPk(id);

    if (!pago) {
        throw new AppError(
            'Pago no encontrado',
            404
        );
    }

    await pago.destroy();
};