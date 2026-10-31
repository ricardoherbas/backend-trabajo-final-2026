import {Turno, Asignacion} from '../models';
import {
    DatosCrearTurno,
    DatosActualizarTurno
} from '../interfaces/turno.interface';
import {AppError} from '../utils/app-error';
import {obtenerCuidadoraPorPersona} from './asignacion.service';

export const crearTurno = async (
    datos: DatosCrearTurno
) => {
    const turno =
        await Turno.create({
            dia_semana:
                datos.dia_semana,
            hora_inicio:
                datos.hora_inicio,
            hora_fin:
                datos.hora_fin,
            activo:
                datos.activo ?? true
        });

    return turno;
};

export const obtenerTurno = async (
    id: number,
    personaIdCuidadora?: number
) => {
    let turno;

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        turno = await Turno.findOne({
            where: {id},
            include: [
                {
                    model: Asignacion,
                    as: 'asignaciones',
                    attributes: [],
                    where: {
                        cuidador_id: cuidadora.id,
                        activo: true
                    },
                    required: true
                }
            ]
        });
    } else {
        turno =
            await Turno.findByPk(id);
    }

    if (!turno) {
        throw new AppError(
            'Turno no encontrado',
            404
        );
    }

    return turno;
};

export const listarTurnos = async (
    personaIdCuidadora?: number
) => {
    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        return await Turno.findAll({
            include: [
                {
                    model: Asignacion,
                    as: 'asignaciones',
                    attributes: [],
                    where: {
                        cuidador_id: cuidadora.id,
                        activo: true
                    },
                    required: true
                }
            ]
        });
    }

    return await Turno.findAll();
};

export const actualizarTurno = async (
    id: number,
    datos: DatosActualizarTurno
) => {
    const turno =
        await Turno.findByPk(id);

    if (!turno) {
        throw new AppError(
            'Turno no encontrado',
            404
        );
    }

    await turno.update(datos);

    return turno;
};

export const eliminarTurno = async (
    id: number
) => {
    const turno =
        await Turno.findByPk(id);

    if (!turno) {
        throw new AppError(
            'Turno no encontrado',
            404
        );
    }

    await turno.destroy();
};