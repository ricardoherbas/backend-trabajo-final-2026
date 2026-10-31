import {Op, IncludeOptions, WhereOptions} from 'sequelize';
import {ParteDiario, Asignacion} from '../models';
import {DatosCrearParteDiario, DatosActualizarParteDiario} from '../interfaces/parteDiario.interface';
import {obtenerPacientesVinculados} from './vinculoFamiliar.service';
import {obtenerCuidadoraPorPersona} from './asignacion.service';
import {AppError} from '../utils/app-error';

export const crearParteDiario = async (
    datos: DatosCrearParteDiario,
    personaIdCuidadora?: number
) => {
    const whereAsignacion: WhereOptions<Asignacion> = {
        id: datos.asignacion_id
    };

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        whereAsignacion.cuidador_id =
            cuidadora.id;
    }

    const asignacion =
        await Asignacion.findOne({
            where: whereAsignacion
        });

    if (!asignacion) {
        throw new AppError(
            'La asignación no existe o no pertenece a la cuidadora',
            404
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
    id: number,
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    const includeAsignacion: IncludeOptions = {
        model: Asignacion,
        as: 'asignacion'
    };

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        includeAsignacion.where = {
            paciente_id: {
                [Op.in]: pacienteIds
            }
        };

        includeAsignacion.required = true;
    }

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        includeAsignacion.where = {
            cuidador_id: cuidadora.id
        };

        includeAsignacion.required = true;
    }

    const parte =
        await ParteDiario.findOne({
            where: {id},
            include: [
                includeAsignacion
            ]
        });

    if (!parte) {
        throw new AppError(
            'Parte diario no encontrado',
            404
        );
    }

    return parte;
};

export const listarPartesDiarios = async (
    personaIdFamiliar?: number,
    personaIdCuidadora?: number
) => {
    const includeAsignacion: IncludeOptions = {
        model: Asignacion,
        as: 'asignacion'
    };

    if (personaIdFamiliar !== undefined) {
        const pacienteIds =
            await obtenerPacientesVinculados(
                personaIdFamiliar
            );

        includeAsignacion.where = {
            paciente_id: {
                [Op.in]: pacienteIds
            }
        };

        includeAsignacion.required = true;
    }

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        includeAsignacion.where = {
            cuidador_id: cuidadora.id
        };

        includeAsignacion.required = true;
    }

    return await ParteDiario.findAll({
        include: [
            includeAsignacion
        ]
    });
};

export const actualizarParteDiario = async (
    id: number,
    datos: DatosActualizarParteDiario,
    personaIdCuidadora?: number
) => {
    let parte;

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        parte = await ParteDiario.findOne({
            where: {id},
            include: [
                {
                    model: Asignacion,
                    as: 'asignacion',
                    where: {
                        cuidador_id: cuidadora.id
                    },
                    required: true
                }
            ]
        });
    } else {
        parte =
            await ParteDiario.findByPk(id);
    }

    if (!parte) {
        throw new AppError(
            'Parte diario no encontrado o no pertenece a la cuidadora',
            404
        );
    }

    if (datos.asignacion_id !== undefined) {
        const whereAsignacion: WhereOptions<Asignacion> = {
            id: datos.asignacion_id
        };

        if (personaIdCuidadora !== undefined) {
            const cuidadora =
                await obtenerCuidadoraPorPersona(
                    personaIdCuidadora
                );

            whereAsignacion.cuidador_id =
                cuidadora.id;
        }

        const asignacion =
            await Asignacion.findOne({
                where: whereAsignacion
            });

        if (!asignacion) {
            throw new AppError(
                'La asignación no existe o no pertenece a la cuidadora',
                404
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
        throw new AppError(
            'Parte diario no encontrado',
            404
        );
    }

    await parte.destroy();
};