import {VinculoFamiliar, Familiar, Paciente} from '../models';

interface DatosCrearVinculo {
    familiar_id: number;
    paciente_id: number;
    parentesco: string;
    es_contacto_principal?: boolean;
    codigo_vinculacion?: string | null;
    codigo_usado?: boolean;
}

export const crearVinculoFamiliar = async (
    datos: DatosCrearVinculo
) => {
    const familiar =
        await Familiar.findByPk(
            datos.familiar_id
        );

    if (!familiar) {
        throw new Error(
            'El familiar no existe'
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

    const vinculoExistente =
        await VinculoFamiliar.findOne({
            where: {
                familiar_id:
                    datos.familiar_id,
                paciente_id:
                    datos.paciente_id
            }
        });

    if (vinculoExistente) {
        throw new Error(
            'El familiar ya está vinculado con este paciente'
        );
    }

    const vinculo =
        await VinculoFamiliar.create({
            familiar_id:
                datos.familiar_id,
            paciente_id:
                datos.paciente_id,
            parentesco:
                datos.parentesco,
            es_contacto_principal:
                datos.es_contacto_principal ?? false,
            codigo_vinculacion:
                datos.codigo_vinculacion ?? null,
            codigo_usado:
                datos.codigo_usado ?? false
        });

    return vinculo;
};

export const obtenerVinculoFamiliar = async (
    id: number
) => {
    const vinculo =
        await VinculoFamiliar.findByPk(
            id,
            {
                include: [
                    {
                        model: Familiar,
                        as: 'familiar'
                    },
                    {
                        model: Paciente,
                        as: 'paciente'
                    }
                ]
            }
        );

    if (!vinculo) {
        throw new Error(
            'Vínculo familiar no encontrado'
        );
    }

    return vinculo;
};

export const listarVinculosFamiliares = async () => {
    return await VinculoFamiliar.findAll({
        include: [
            {
                model: Familiar,
                as: 'familiar'
            },
            {
                model: Paciente,
                as: 'paciente'
            }
        ]
    });
};

export const actualizarVinculoFamiliar = async (
    id: number,
    datos: Partial<DatosCrearVinculo>
) => {
    const vinculo =
        await VinculoFamiliar.findByPk(id);

    if (!vinculo) {
        throw new Error(
            'Vínculo familiar no encontrado'
        );
    }

    await vinculo.update(datos);

    return vinculo;
};

export const eliminarVinculoFamiliar = async (
    id: number
) => {
    const vinculo =
        await VinculoFamiliar.findByPk(id);

    if (!vinculo) {
        throw new Error(
            'Vínculo familiar no encontrado'
        );
    }

    await vinculo.destroy();
};