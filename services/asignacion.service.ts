import {Asignacion, Turno, Cuidadora, Paciente} from '../models';
import {DatosCrearAsignacion, DatosActualizarAsignacion} from '../interfaces/asignacion.interface';

export const crearAsignacion = async (
    datos: DatosCrearAsignacion
) => {
    const turno =
        await Turno.findByPk(
            datos.turno_id
        );
    if (!turno) {
        throw new Error(
            'El turno no existe'
        );
    }
    const cuidadora =
        await Cuidadora.findByPk(
            datos.cuidador_id
        );
    if (!cuidadora) {
        throw new Error(
            'La cuidadora no existe'
        );
    }
    const paciente =
        await Paciente.findByPk(
            datos.paciente_id
        );
    if (!paciente) {
        throw new Error(
            'El paciente no existe'
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
        throw new Error(
            'La asignación ya existe'
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
export const obtenerAsignacion = async (
    id: number
) => {
    const asignacion =
        await Asignacion.findByPk(
            id,
            {
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
            }
        );
    if (!asignacion) {
        throw new Error(
            'Asignación no encontrada'
        );
    }
    return asignacion;
};
export const listarAsignaciones = async () => {
    return await Asignacion.findAll({
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
        throw new Error(
            'Asignación no encontrada'
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
        throw new Error(
            'Asignación no encontrada'
        );
    }
    await asignacion.destroy();
};