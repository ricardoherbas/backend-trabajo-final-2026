import {Turno} from '../models';

interface DatosCrearTurno {
    dia_semana:
        | 'lunes'
        | 'martes'
        | 'miércoles'
        | 'jueves'
        | 'viernes'
        | 'sábado'
        | 'domingo';
    hora_inicio: string;
    hora_fin: string;
    activo?: boolean;
}

interface DatosActualizarTurno {
    dia_semana?:
        | 'lunes'
        | 'martes'
        | 'miércoles'
        | 'jueves'
        | 'viernes'
        | 'sábado'
        | 'domingo';
    hora_inicio?: string;
    hora_fin?: string;
    activo?: boolean;
}

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
    id: number
) => {
    const turno =
        await Turno.findByPk(id);

    if (!turno) {
        throw new Error(
            'Turno no encontrado'
        );
    }

    return turno;
};

export const listarTurnos = async () => {
    return await Turno.findAll();
};

export const actualizarTurno = async (
    id: number,
    datos: DatosActualizarTurno
) => {
    const turno =
        await Turno.findByPk(id);

    if (!turno) {
        throw new Error(
            'Turno no encontrado'
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
        throw new Error(
            'Turno no encontrado'
        );
    }

    await turno.destroy();
};
