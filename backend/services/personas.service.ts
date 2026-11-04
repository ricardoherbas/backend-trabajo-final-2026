
import {UniqueConstraintError} from 'sequelize';
import {Persona} from '../models';
import {AppError} from '../utils/app-error';

export const crearPersona = async (
    datos: {
        nombre: string;
        apellido: string;
        dni: string;
        fecha_nacimiento?: Date | null;
        telefono?: string | null;
    }
) => {
    const personaExistente =
        await Persona.findOne({
            where: {
                dni: datos.dni
            }
        });

    if (personaExistente) {
        throw new AppError(
            'El DNI ya está registrado',
            409
        );
    }

    try {
        const persona =
            await Persona.create({
                nombre: datos.nombre,
                apellido: datos.apellido,
                dni: datos.dni,
                fecha_nacimiento:
                    datos.fecha_nacimiento ?? null,
                telefono:
                    datos.telefono ?? null
            });

        return persona;
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new AppError(
                'El DNI ya está registrado',
                409
            );
        }

        throw error;
    }
};

export const actualizarPersona = async (
    id: number,
    datos: {
        nombre: string;
        apellido: string;
        dni: string;
        fecha_nacimiento?: Date | null;
        telefono?: string | null;
    }
) => {
    const persona = await Persona.findByPk(id);

    if (!persona) {
        throw new AppError(
            'Persona no encontrada',
            404
        );
    }

    const personaExistente = await Persona.findOne({
        where: {
            dni: datos.dni
        }
    });

    if (
        personaExistente &&
        personaExistente.id !== persona.id
    ) {
        throw new AppError(
            'El DNI ya está registrado',
            409
        );
    }

    try {
        await persona.update({
            nombre: datos.nombre,
            apellido: datos.apellido,
            dni: datos.dni,
            fecha_nacimiento:
                datos.fecha_nacimiento ?? null,
            telefono:
                datos.telefono ?? null
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new AppError(
                'El DNI ya está registrado',
                409
            );
        }

        throw error;
    }

    return persona;
};
