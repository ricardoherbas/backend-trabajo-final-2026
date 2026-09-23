import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
    Usuario,
    Persona,
    Familiar,
    VinculoFamiliar
} from '../models';

interface DatosRegistroFamiliar {
    codigo_vinculacion: string;
    email: string;
    password: string;
}

interface DatosLogin {
    email: string;
    password: string;
}

export const registrarFamiliar = async (
    datos: DatosRegistroFamiliar
) => {
    const vinculo =
        await VinculoFamiliar.findOne({
            where: {
                codigo_vinculacion:
                    datos.codigo_vinculacion,
                codigo_usado: false
            }
        });

    if (!vinculo) {
        throw new Error(
            'El código de vinculación no es válido o ya fue utilizado'
        );
    }

    const familiar =
        await Familiar.findByPk(
            vinculo.familiar_id
        );

    if (!familiar) {
        throw new Error(
            'El familiar no existe'
        );
    }

    const usuarioExistente =
        await Usuario.findOne({
            where: {
                persona_id: familiar.persona_id
            }
        });

    if (usuarioExistente) {
        throw new Error(
            'El familiar ya tiene una cuenta registrada'
        );
    }

    const emailExistente =
        await Usuario.findOne({
            where: {
                email: datos.email
            }
        });

    if (emailExistente) {
        throw new Error(
            'El email ya está registrado'
        );
    }

    const passwordHash =
        await bcrypt.hash(
            datos.password,
            10
        );

    const usuario =
        await Usuario.create({
            persona_id: familiar.persona_id,
            email: datos.email,
            password_hash: passwordHash,
            rol: 'familiar',
            activo: true
        });

    vinculo.codigo_usado = true;

    await vinculo.save();

    return {
        id: usuario.id,
        persona_id: usuario.persona_id,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
    };
};

export const iniciarSesion = async (
    datos: DatosLogin
) => {
    const usuario =
        await Usuario.findOne({
            where: {
                email: datos.email
            }
        });

    if (!usuario) {
        throw new Error(
            'Email o contraseña incorrectos'
        );
    }

    if (!usuario.activo) {
        throw new Error(
            'El usuario está inactivo'
        );
    }

    const passwordCorrecta =
        await bcrypt.compare(
            datos.password,
            usuario.password_hash
        );

    if (!passwordCorrecta) {
        throw new Error(
            'Email o contraseña incorrectos'
        );
    }

    const secreto =
        process.env.JWT_SECRET;

    if (!secreto) {
        throw new Error(
            'JWT_SECRET no configurado'
        );
    }

    const token =
        jwt.sign(
            {
                id: usuario.id,
                persona_id: usuario.persona_id,
                rol: usuario.rol
            },
            secreto,
            {
                expiresIn: '7d'
            }
        );

    return {
        token,
        usuario: {
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        }
    };
};

export const obtenerPerfil = async (
    usuarioId: number
) => {
    const usuario =
        await Usuario.findByPk(
            usuarioId,
            {
                attributes: [
                    'id',
                    'persona_id',
                    'email',
                    'rol',
                    'activo',
                    'creado_en',
                    'actualizado_en'
                ],
                include: [
                    {
                        model: Persona,
                        as: 'persona'
                    }
                ]
            }
        );

    if (!usuario) {
        throw new Error(
            'Usuario no encontrado'
        );
    }

    return usuario;
};
