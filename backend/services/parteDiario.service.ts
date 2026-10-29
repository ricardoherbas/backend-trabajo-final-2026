import {ParteDiario, Asignacion} from '../models';
import {DatosCrearParteDiario, DatosActualizarParteDiario} from '../interfaces/parteDiario.interface';

export const crearParteDiario = async (
    datos: DatosCrearParteDiario
) => {
    const asignacion =
        await Asignacion.findByPk(
            datos.asignacion_id
        );

    if (!asignacion) {
        throw new Error(
            'La asignación no existe'
        );
    }

    const parte =
        await ParteDiario.create({
            asignacion_id:
                datos.asignacion_id,
            fecha:
                datos.fecha,
            animo:
                datos.animo ?? null,
            alimentacion:
                datos.alimentacion ?? null,
            descanso:
                datos.descanso ?? null,
            higiene:
                datos.higiene ?? null,
            novedades:
                datos.novedades ?? null,
            observaciones:
                datos.observaciones ?? null
        });

    return parte;
};

export const obtenerParteDiario = async (
    id: number
) => {
    const parte =
        await ParteDiario.findByPk(
            id,
            {
                include: [
                    {
                        model: Asignacion,
                        as: 'asignacion'
                    }
                ]
            }
        );

    if (!parte) {
        throw new Error(
            'Parte diario no encontrado'
        );
    }

    return parte;
};

export const listarPartesDiarios = async () => {
    return await ParteDiario.findAll({
        include: [
            {
                model: Asignacion,
                as: 'asignacion'
            }
        ]
    });
};

export const actualizarParteDiario = async (
    id: number,
    datos: DatosActualizarParteDiario
) => {
    const parte =
        await ParteDiario.findByPk(id);

    if (!parte) {
        throw new Error(
            'Parte diario no encontrado'
        );
    }

    if (
        datos.asignacion_id !== undefined
    ) {
        const asignacion =
            await Asignacion.findByPk(
                datos.asignacion_id
            );

        if (!asignacion) {
            throw new Error(
                'La asignación no existe'
            );
        }
    }

    await parte.update(datos);

    return parte;
};

export const eliminarParteDiario = async (
    id: number
) => {
    const parte =
        await ParteDiario.findByPk(id);

    if (!parte) {
        throw new Error(
            'Parte diario no encontrado'
        );
    }

    await parte.destroy();
};