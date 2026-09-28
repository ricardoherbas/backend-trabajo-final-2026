import {randomBytes} from 'crypto';
import {VinculoFamiliar, Familiar, Paciente} from '../models';
import {DatosCrearVinculo, DatosActualizarVinculo} from '../interfaces/vinculoFamiliar.interface';

const generarTokenVinculacion = (): string => {
    return randomBytes(32).toString('hex');
};

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

    const tokenVinculacion =
        generarTokenVinculacion();

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
                tokenVinculacion,
            codigo_usado:
                false
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

export const listarVinculosFamiliares =
    async () => {
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

export const actualizarVinculoFamiliar =
    async (
        id: number,
        datos: DatosActualizarVinculo
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

export const eliminarVinculoFamiliar =
    async (id: number) => {
        const vinculo =
            await VinculoFamiliar.findByPk(id);

        if (!vinculo) {
            throw new Error(
                'Vínculo familiar no encontrado'
            );
        }

        await vinculo.destroy();
    };