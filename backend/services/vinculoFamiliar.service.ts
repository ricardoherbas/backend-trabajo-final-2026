import {randomBytes} from 'crypto';
import {VinculoFamiliar, Familiar, Paciente} from '../models';
import {DatosCrearVinculo, DatosActualizarVinculo} from '../interfaces/vinculoFamiliar.interface';
import {AppError} from '../utils/app-error';

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
        throw new AppError(
            'El familiar no existe',
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
        throw new AppError(
            'El familiar ya está vinculado con este paciente',
            409
        );
    }

    const tokenVinculacion =
        generarTokenVinculacion();

    const expiraEn =
        new Date(Date.now() + 2 * 60 * 60 * 1000);

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
                false,
            expira_en:
                expiraEn,
            activo:
                true
        });

    return vinculo;
};

export const obtenerVinculoFamiliar = async (
    id: number,
    personaIdFamiliar?: number
) => {
    let familiarId: number | undefined;

    if (personaIdFamiliar !== undefined) {
        const familiar =
            await Familiar.findOne({
                where: {
                    persona_id: personaIdFamiliar
                }
            });

        if (!familiar) {
            throw new AppError(
                'Vínculo familiar no encontrado',
                404
            );
        }

        familiarId = familiar.id;
    }

    const vinculo =
        await VinculoFamiliar.findOne({
            where: {
                id,
                ...(familiarId !== undefined
                    ? {
                        familiar_id: familiarId,
                        activo: true
                    }
                    : {})
            },
            attributes: {
                exclude: [
                    'codigo_vinculacion',
                    'codigo_usado'
                ]
            },
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

    if (!vinculo) {
        throw new AppError(
            'Vínculo familiar no encontrado',
            404
        );
    }

    return vinculo;
};

export const listarVinculosFamiliares =
    async () => {
        return await VinculoFamiliar.findAll({
            attributes: {
                exclude: [
                    'codigo_vinculacion',
                    'codigo_usado'
                ]
            },
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
            throw new AppError(
                'Vínculo familiar no encontrado',
                404
            );
        }

        const datosPermitidos: DatosActualizarVinculo = {};

        if (datos.parentesco !== undefined) {
            datosPermitidos.parentesco = datos.parentesco;
        }

        if (datos.es_contacto_principal !== undefined) {
            datosPermitidos.es_contacto_principal =
                datos.es_contacto_principal;
        }

        if (Object.keys(datosPermitidos).length === 0) {
            throw new AppError(
                'No hay campos válidos para actualizar',
                400
            );
        }

        await vinculo.update(datosPermitidos);

        return vinculo;
    };

export const desactivarVinculoFamiliar =
    async (id: number) => {
        const vinculo =
            await VinculoFamiliar.findByPk(id);

        if (!vinculo) {
            throw new AppError(
                'Vínculo familiar no encontrado',
                404
            );
        }

        if (!vinculo.activo) {
            throw new AppError(
                'El vínculo familiar ya está desactivado',
                409
            );
        }

        await vinculo.update({
            activo: false
        });

        return vinculo;
    };

export const activarVinculoFamiliar =
    async (id: number) => {
        const vinculo =
            await VinculoFamiliar.findByPk(id);

        if (!vinculo) {
            throw new AppError(
                'Vínculo familiar no encontrado',
                404
            );
        }

        if (vinculo.activo) {
            throw new AppError(
                'El vínculo familiar ya está activo',
                409
            );
        }

        await vinculo.update({
            activo: true
        });

        return vinculo;
    };

export const obtenerPacientesVinculados = async (
    personaId: number
): Promise<number[]> => {
    const familiar = await Familiar.findOne({
        where: {
            persona_id: personaId
        }
    });

    if (!familiar) {
        throw new AppError(
            'No se encontró el perfil familiar',
            404
        );
    }

    const vinculos = await VinculoFamiliar.findAll({
        where: {
            familiar_id: familiar.id,
            activo: true
        },
        attributes: ['paciente_id']
    });

    return vinculos.map(
        (vinculo) => vinculo.paciente_id
    );
};