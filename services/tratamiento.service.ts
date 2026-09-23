import {Tratamiento, Paciente, Medicamento} from '../models';

interface DatosCrearTratamiento {
    paciente_id: number;
    medicamento_id: number;
    dosis: string;
    frecuencia: string;
    horario?: string | null;
    desde?: Date | null;
    hasta?: Date | null;
    activa?: boolean;
}

interface DatosActualizarTratamiento {
    paciente_id?: number;
    medicamento_id?: number;
    dosis?: string;
    frecuencia?: string;
    horario?: string | null;
    desde?: Date | null;
    hasta?: Date | null;
    activa?: boolean;
}

export const crearTratamiento = async (
    datos: DatosCrearTratamiento
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

    const medicamento =
        await Medicamento.findByPk(
            datos.medicamento_id
        );

    if (!medicamento) {
        throw new Error(
            'El medicamento no existe'
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
    id: number
) => {
    const tratamiento =
        await Tratamiento.findByPk(
            id,
            {
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
            }
        );

    if (!tratamiento) {
        throw new Error(
            'Tratamiento no encontrado'
        );
    }

    return tratamiento;
};

export const listarTratamientos = async () => {
    return await Tratamiento.findAll({
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
        throw new Error(
            'Tratamiento no encontrado'
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

    if (datos.medicamento_id !== undefined) {
        const medicamento =
            await Medicamento.findByPk(
                datos.medicamento_id
            );

        if (!medicamento) {
            throw new Error(
                'El medicamento no existe'
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
        throw new Error(
            'Tratamiento no encontrado'
        );
    }

    await tratamiento.destroy();
};
