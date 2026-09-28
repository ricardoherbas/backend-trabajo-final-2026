import {Pago, Paciente} from '../models';
import {DatosCrearPago, DatosActualizarPago} from '../interfaces/pago.interface';

export const crearPago = async (
    datos: DatosCrearPago
) => {
    const paciente =
        await Paciente.findByPk(
            datos.paciente_id
        );

    if (!paciente) {
        throw new Error(
            'El paciente no existe'
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
        throw new Error(
            'Ya existe un pago para este paciente y período'
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
    id: number
) => {
    const pago =
        await Pago.findByPk(
            id,
            {
                include: [
                    {
                        model: Paciente,
                        as: 'paciente'
                    }
                ]
            }
        );

    if (!pago) {
        throw new Error(
            'Pago no encontrado'
        );
    }

    return pago;
};

export const listarPagos = async () => {
    return await Pago.findAll({
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
        throw new Error(
            'Pago no encontrado'
        );
    }

    if (datos.paciente_id !== undefined) {
        const paciente =
            await Paciente.findByPk(
                datos.paciente_id
            );

        if (!paciente) {
            throw new Error(
                'El paciente no existe'
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
        throw new Error(
            'Pago no encontrado'
        );
    }

    await pago.destroy();
};