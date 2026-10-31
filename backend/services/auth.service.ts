
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {Usuario, Persona, Familiar, VinculoFamiliar, TokenRecuperacion} from '../models';
import {DatosRegistroFamiliar, DatosLogin} from '../interfaces/auth.interface';
import transporter from '../config/conexion-email';
import {sequelize} from '../config/conexion-bd';
import {AppError} from '../utils/app-error';

export const registrarFamiliar = async (datos: DatosRegistroFamiliar) => {
    const passwordHash = await bcrypt.hash(datos.password, 10);

    const usuario = await sequelize.transaction(async (transaction) => {
        const vinculo = await VinculoFamiliar.findOne({
            where: {
                codigo_vinculacion: datos.codigo_vinculacion,
                codigo_usado: false,
                activo: true
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!vinculo) {
            throw new AppError(
                'El código de vinculación no es válido o ya fue utilizado',
                400
            );
        }

        if (new Date(vinculo.expira_en).getTime() <= Date.now()) {
            throw new AppError(
                'El código de vinculación ha expirado',
                410
            );
        }

        const familiar = await Familiar.findByPk(
            vinculo.familiar_id,
            {transaction}
        );

        if (!familiar) {
            throw new AppError(
                'El familiar no existe',
                404
            );
        }

        const usuarioExistente = await Usuario.findOne({
            where: {
                persona_id: familiar.persona_id
            },
            transaction
        });

        if (usuarioExistente) {
            throw new AppError(
                'El familiar ya tiene una cuenta registrada',
                409
            );
        }

        const emailExistente = await Usuario.findOne({
            where: {
                email: datos.email
            },
            transaction
        });

        if (emailExistente) {
            throw new AppError(
                'El email ya está registrado',
                409
            );
        }

        const nuevoUsuario = await Usuario.create({
            persona_id: familiar.persona_id,
            email: datos.email,
            password_hash: passwordHash,
            rol: 'familiar',
            activo: true
        }, {transaction});

        vinculo.codigo_usado = true;

        await vinculo.save({transaction});

        return nuevoUsuario;
    });

    return {
        id: usuario.id,
        persona_id: usuario.persona_id,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
    };
};

export const iniciarSesion = async (datos: DatosLogin) => {
    const usuario = await Usuario.findOne({
        where: {
            email: datos.email
        }
    });

    if (!usuario) {
        throw new AppError(
            'Email o contraseña incorrectos',
            401
        );
    }

    if (!usuario.activo) {
        throw new AppError(
            'El usuario está inactivo',
            403
        );
    }

    const passwordCorrecta = await bcrypt.compare(
        datos.password,
        usuario.password_hash
    );

    if (!passwordCorrecta) {
        throw new AppError(
            'Email o contraseña incorrectos',
            401
        );
    }

    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        throw new Error(
            'JWT_SECRET no configurado'
        );
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            persona_id: usuario.persona_id,
            rol: usuario.rol
        },
        secreto,
        {expiresIn: '2h'}
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

export const obtenerPerfil = async (usuarioId: number) => {
    const usuario = await Usuario.findByPk(usuarioId, {
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
    });

    if (!usuario) {
        throw new AppError(
            'Usuario no encontrado',
            404
        );
    }

    return usuario;
};

export const solicitarRecuperacionPassword = async (email: string) => {
    const respuesta = {
        mensaje: 'Si existe una cuenta con ese email, recibirás instrucciones para recuperar tu contraseña'
    };

    const usuario = await Usuario.findOne({
        where: {
            email,
            activo: true
        }
    });

    if (!usuario) {
        return respuesta;
    }

    const tokenOriginal = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto.createHash('sha256')
        .update(tokenOriginal)
        .digest('hex');

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
        throw new Error(
            'FRONTEND_URL no configurada'
        );
    }

    const enlace = new URL(
        '/restablecer-password',
        frontendUrl
    );

    enlace.searchParams.set(
        'token',
        tokenOriginal
    );

    const expiraEn = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await sequelize.transaction(async (transaction) => {
        await TokenRecuperacion.update(
            {usado: true},
            {
                where: {
                    usuario_id: usuario.id,
                    usado: false
                },
                transaction
            }
        );

        await TokenRecuperacion.create({
            usuario_id: usuario.id,
            token_hash: tokenHash,
            expira_en: expiraEn,
            usado: false
        }, {transaction});
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: usuario.email,
            subject: 'Recuperación de contraseña',
            text: [
                'Recibimos una solicitud para restablecer tu contraseña.',
                '',
                `Ingresá al siguiente enlace para continuar: ${enlace.toString()}`,
                '',
                'El enlace vence en 15 minutos.',
                'Si no solicitaste este cambio, podés ignorar este correo.'
            ].join('\n'),
            html: `<h2>Recuperación de contraseña</h2><p>Recibimos una solicitud para restablecer tu contraseña.</p><p><a href="${enlace.toString()}">Restablecer contraseña</a></p><p>El enlace vence en 15 minutos.</p><p>Si no solicitaste este cambio, ignorá este correo.</p>`
        });
    } catch {
        await TokenRecuperacion.update(
            {usado: true},
            {
                where: {
                    usuario_id: usuario.id,
                    token_hash: tokenHash,
                    usado: false
                }
            }
        );

        throw new Error(
            'No se pudo enviar el correo de recuperación'
        );
    }

    return respuesta;
};

export const restablecerPassword = async (
    token: string,
    nuevaPassword: string
) => {
    if (!token || !nuevaPassword) {
        throw new AppError(
            'El token y la nueva contraseña son obligatorios',
            400
        );
    }

    if (nuevaPassword.length < 8) {
        throw new AppError(
            'La contraseña debe tener al menos 8 caracteres',
            400
        );
    }

    const tokenHash = crypto.createHash('sha256')
        .update(token)
        .digest('hex');

    const registro = await TokenRecuperacion.findOne({
        where: {
            token_hash: tokenHash,
            usado: false
        }
    });

    if (!registro) {
        throw new AppError(
            'El enlace de recuperación no es válido o ya fue utilizado',
            400
        );
    }

    if (new Date(registro.expira_en).getTime() <= Date.now()) {
        await TokenRecuperacion.update(
            {usado: true},
            {
                where: {
                    id: registro.id,
                    usado: false
                }
            }
        );

        throw new AppError(
            'El enlace de recuperación ha expirado',
            410
        );
    }

    await sequelize.transaction(async (transaction) => {
        const registroBloqueado = await TokenRecuperacion.findOne({
            where: {
                id: registro.id,
                usado: false
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!registroBloqueado) {
            throw new AppError(
                'El enlace de recuperación no es válido o ya fue utilizado',
                400
            );
        }

        if (new Date(registroBloqueado.expira_en).getTime() <= Date.now()) {
            throw new AppError(
                'El enlace de recuperación ha expirado',
                410
            );
        }

        const usuario = await Usuario.findByPk(
            registroBloqueado.usuario_id,
            {transaction}
        );

        if (!usuario) {
            throw new AppError(
                'Usuario no encontrado',
                404
            );
        }

        usuario.password_hash = await bcrypt.hash(
            nuevaPassword,
            10
        );

        await usuario.save({transaction});

        registroBloqueado.usado = true;

        await registroBloqueado.save({transaction});

        await TokenRecuperacion.update(
            {usado: true},
            {
                where: {
                    usuario_id: usuario.id,
                    usado: false
                },
                transaction
            }
        );
    });

    return {
        mensaje: 'La contraseña se restableció correctamente'
    };
};
