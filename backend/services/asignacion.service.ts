
import {Asignacion, Turno, Cuidadora, Paciente} from '../models';
import {DatosCrearAsignacion, DatosActualizarAsignacion} from '../interfaces/asignacion.interface';
import {AppError} from '../utils/app-error';

export const crearAsignacion = async (
    datos: DatosCrearAsignacion
) => {
    const turno =
        await Turno.findByPk(
            datos.turno_id
        );

    if (!turno) {
        throw new AppError(
            'El turno no existe',
            404
        );
    }

    const cuidadora =
        await Cuidadora.findByPk(
            datos.cuidador_id
        );

    if (!cuidadora) {
        throw new AppError(
            'La cuidadora no existe',
            404
        );
    }

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

    const asignacionExistente =
        await Asignacion.findOne({
            where: {
                turno_id:
                    datos.turno_id,
                cuidador_id:
                    datos.cuidador_id,
                paciente_id:
                    datos.paciente_id
            }
        });

    if (asignacionExistente) {
        throw new AppError(
            'La asignación ya existe',
            409
        );
    }

    const asignacion =
        await Asignacion.create({
            turno_id:
                datos.turno_id,
            cuidador_id:
                datos.cuidador_id,
            paciente_id:
                datos.paciente_id,
            activo:
                datos.activo ?? true
        });

    return asignacion;
};

export const obtenerCuidadoraPorPersona = async (
    personaId: number
) => {
    const cuidadora =
        await Cuidadora.findOne({
            where: {
                persona_id: personaId
            }
        });

    if (!cuidadora) {
        throw new AppError(
            'Perfil de cuidadora no encontrado',
            404
        );
    }

    return cuidadora;
};

export const obtenerPacientesAsignados = async (
    personaIdCuidadora: number
): Promise<number[]> => {
    const cuidadora =
        await obtenerCuidadoraPorPersona(
            personaIdCuidadora
        );

    const asignaciones =
        await Asignacion.findAll({
            where: {
                cuidador_id: cuidadora.id,
                activo: true
            },
            attributes: [
                'paciente_id'
            ],
            group: [
                'paciente_id'
            ]
        });

    return asignaciones.map(
        asignacion => asignacion.paciente_id
    );
};

export const obtenerAsignacion = async (
    id: number,
    personaIdCuidadora?: number
) => {
    const where: {
        id: number;
        cuidador_id?: number;
    } = {id};

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        where.cuidador_id = cuidadora.id;
    }

    const asignacion =
        await Asignacion.findOne({
            where,
            include: [
                {
                    model: Turno,
                    as: 'turno'
                },
                {
                    model: Cuidadora,
                    as: 'cuidadora'
                },
                {
                    model: Paciente,
                    as: 'paciente'
                }
            ]
        });

    if (!asignacion) {
        throw new AppError(
            'Asignación no encontrada',
            404
        );
    }

    return asignacion;
};

export const listarAsignaciones = async (
    personaIdCuidadora?: number
) => {
    const where: {
        cuidador_id?: number;
    } = {};

    if (personaIdCuidadora !== undefined) {
        const cuidadora =
            await obtenerCuidadoraPorPersona(
                personaIdCuidadora
            );

        where.cuidador_id = cuidadora.id;
    }

    return await Asignacion.findAll({
        where,
        include: [
            {
                model: Turno,
                as: 'turno'
            },
            {
                model: Cuidadora,
                as: 'cuidadora'
            },
            {
                model: Paciente,
                as: 'paciente'
            }
        ]
    });
};

export const actualizarAsignacion = async (
    id: number,
    datos: DatosActualizarAsignacion
) => {
    const asignacion =
        await Asignacion.findByPk(id);

    if (!asignacion) {
        throw new AppError(
            'Asignación no encontrada',
            404
        );
    }

    await asignacion.update(datos);

    return asignacion;
};

export const eliminarAsignacion = async (
    id: number
) => {
    const asignacion =
        await Asignacion.findByPk(id);

    if (!asignacion) {
        throw new AppError(
            'Asignación no encontrada',
            404
        );
    }

    await asignacion.destroy();
};
