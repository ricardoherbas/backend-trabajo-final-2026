import bcrypt from 'bcryptjs';

import {Persona, Usuario, Administrador, Secretaria, Cuidadora, Familiar} from '../models';

type Rol =
    | 'administrador'
    | 'secretaria'
    | 'cuidadora'
    | 'familiar';

interface DatosCrearUsuario {
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento?: Date | null;
    telefono?: string | null;
    email: string;
    password: string;
    rol: Rol;
}

export const crearUsuario = async (
    datos: DatosCrearUsuario
) => {
    const usuarioExistente =
        await Usuario.findOne({
            where: {
                email: datos.email
            }
        });

    if (usuarioExistente) {
        throw new Error(
            'El email ya está registrado'
        );
    }

    const personaExistente =
        await Persona.findOne({
            where: {
                dni: datos.dni
            }
        });

    if (personaExistente) {
        throw new Error(
            'El DNI ya está registrado'
        );
    }

    const passwordHash =
        await bcrypt.hash(
            datos.password,
            10
        );

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

    try {
        const usuario =
            await Usuario.create({
                persona_id: persona.id,
                email: datos.email,
                password_hash: passwordHash,
                rol: datos.rol,
                activo: true
            });

        switch (datos.rol) {
            case 'administrador':
                await Administrador.create({
                    persona_id: persona.id
                });
                break;

            case 'secretaria':
                await Secretaria.create({
                    persona_id: persona.id
                });
                break;

            case 'cuidadora':
                await Cuidadora.create({
                    persona_id: persona.id
                });
                break;

            case 'familiar':
                await Familiar.create({
                    persona_id: persona.id
                });
                break;
        }

        return {
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        };
    } catch (error) {
        await persona.destroy();

        throw error;
    }
};
