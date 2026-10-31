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
};