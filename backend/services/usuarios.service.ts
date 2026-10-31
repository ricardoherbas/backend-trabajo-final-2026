import bcrypt from 'bcryptjs';
import {Transaction} from 'sequelize';

import {sequelize} from '../config/conexion-bd';

import {
    Persona,
    Usuario,
    Administrador,
    Secretaria,
    Cuidadora,
    Familiar,
    Asignacion,
    VinculoFamiliar
} from '../models';

import {
    DatosCrearUsuario,
    DatosActualizarUsuario
} from '../interfaces/usuario.interface';

import {RolUsuario} from '../types/rol-usuario.type';
import {AppError} from '../utils/app-error';

// Crea el perfil correspondiente al rol.
const crearPerfil = async (
    rol: RolUsuario,
    personaId: number,
    transaction: Transaction
): Promise<void> => {
    switch (rol) {
        case 'administrador':
            await Administrador.create(
                {persona_id: personaId},
                {transaction}
            );
            break;

        case 'secretaria':
            await Secretaria.create(
                {persona_id: personaId},
                {transaction}
            );
            break;

        case 'cuidadora':
            await Cuidadora.create(
                {persona_id: personaId},
                {transaction}
            );
            break;

        case 'familiar':
            await Familiar.create(
                {persona_id: personaId},
                {transaction}
            );
            break;
    }
};

// Elimina el perfil anterior solamente si es seguro hacerlo.
const eliminarPerfilAnterior = async (
    rol: RolUsuario,
    personaId: number,
    transaction: Transaction
): Promise<void> => {
    switch (rol) {
        case 'administrador': {
            const perfil = await Administrador.findOne({
                where: {persona_id: personaId},
                transaction
            });

            if (!perfil) {
                throw new AppError(
                    'No se encontró el perfil de administrador',
                    404
                );
            }

            await perfil.destroy({transaction});
            break;
        }

        case 'secretaria': {
            const perfil = await Secretaria.findOne({
                where: {persona_id: personaId},
                transaction
            });

            if (!perfil) {
                throw new AppError(
                    'No se encontró el perfil de secretaria',
                    404
                );
            }

            await perfil.destroy({transaction});
            break;
        }

        case 'cuidadora': {
            const perfil = await Cuidadora.findOne({
                where: {persona_id: personaId},
                transaction
            });

            if (!perfil) {
                throw new AppError(
                    'No se encontró el perfil de cuidadora',
                    404
                );
            }

            const asignaciones = await Asignacion.count({
                where: {cuidador_id: perfil.id},
                transaction
            });

            if (asignaciones > 0) {
                throw new AppError(
                    'No se puede cambiar el rol: la cuidadora tiene asignaciones relacionadas',
                    409
                );
            }

            await perfil.destroy({transaction});
            break;
        }

        case 'familiar': {
            const perfil = await Familiar.findOne({
                where: {persona_id: personaId},
                transaction
            });

            if (!perfil) {
                throw new AppError(
                    'No se encontró el perfil de familiar',
                    404
                );
            }

            const vinculos = await VinculoFamiliar.count({
                where: {familiar_id: perfil.id},
                transaction
            });

            if (vinculos > 0) {
                throw new AppError(
                    'No se puede cambiar el rol: el familiar tiene vínculos con pacientes',
                    409
                );
            }

            await perfil.destroy({transaction});
            break;
        }
    }
};

// Crea una persona, su usuario y el perfil correspondiente.
export const crearUsuario = async (
    datos: DatosCrearUsuario
) => {
    return await sequelize.transaction(async transaction => {
        const usuarioExistente = await Usuario.findOne({
            where: {email: datos.email},
            transaction
        });

        if (usuarioExistente) {
            throw new AppError(
                'El email ya está registrado',
                409
            );
        }

        const personaExistente = await Persona.findOne({
            where: {dni: datos.dni},
            transaction
        });

        if (personaExistente) {
            throw new AppError(
                'El DNI ya está registrado',
                409
            );
        }

        const passwordHash = await bcrypt.hash(
            datos.password,
            10
        );

        const persona = await Persona.create(
            {
                nombre: datos.nombre,
                apellido: datos.apellido,
                dni: datos.dni,
                fecha_nacimiento: datos.fecha_nacimiento ?? null,
                telefono: datos.telefono ?? null
            },
            {transaction}
        );

        const usuario = await Usuario.create(
            {
                persona_id: persona.id,
                email: datos.email,
                password_hash: passwordHash,
                rol: datos.rol,
                activo: true
            },
            {transaction}
        );

        await crearPerfil(
            datos.rol,
            persona.id,
            transaction
        );

        return {
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        };
    });
};

// Lista todos los usuarios, incluidos los desactivados.
export const listarUsuarios = async () => {
    return await Usuario.findAll({
        attributes: {
            exclude: ['password_hash']
        },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ],
        order: [['id', 'ASC']]
    });
};

// Obtiene un usuario por su ID.
export const obtenerUsuario = async (id: number) => {
    const usuario = await Usuario.findByPk(id, {
        attributes: {
            exclude: ['password_hash']
        },
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

// Actualiza datos personales, credenciales y rol.
export const actualizarUsuario = async (
    id: number,
    datos: DatosActualizarUsuario
) => {
    return await sequelize.transaction(async transaction => {
        const usuario = await Usuario.findByPk(id, {
            transaction
        });

        if (!usuario) {
            throw new AppError(
                'Usuario no encontrado',
                404
            );
        }

        const persona = await Persona.findByPk(
            usuario.persona_id,
            {transaction}
        );

        if (!persona) {
            throw new AppError(
                'Persona asociada al usuario no encontrada',
                404
            );
        }

        // Verifica que el email no pertenezca a otro usuario.
        if (datos.email !== undefined) {
            const emailExistente = await Usuario.findOne({
                where: {email: datos.email},
                transaction
            });

            if (
                emailExistente &&
                emailExistente.id !== usuario.id
            ) {
                throw new AppError(
                    'El email ya está registrado',
                    409
                );
            }
        }

        // Verifica que el DNI no pertenezca a otra persona.
        if (datos.dni !== undefined) {
            const dniExistente = await Persona.findOne({
                where: {dni: datos.dni},
                transaction
            });

            if (
                dniExistente &&
                dniExistente.id !== persona.id
            ) {
                throw new AppError(
                    'El DNI ya está registrado',
                    409
                );
            }
        }

        // Actualiza el perfil cuando cambia el rol.
        if (
            datos.rol !== undefined &&
            datos.rol !== usuario.rol
        ) {
            await crearPerfil(
                datos.rol,
                persona.id,
                transaction
            );

            await eliminarPerfilAnterior(
                usuario.rol,
                persona.id,
                transaction
            );
        }

        // Actualiza los datos personales.
        await persona.update(
            {
                ...(datos.nombre !== undefined && {
                    nombre: datos.nombre
                }),
                ...(datos.apellido !== undefined && {
                    apellido: datos.apellido
                }),
                ...(datos.dni !== undefined && {
                    dni: datos.dni
                }),
                ...(datos.fecha_nacimiento !== undefined && {
                    fecha_nacimiento: datos.fecha_nacimiento
                }),
                ...(datos.telefono !== undefined && {
                    telefono: datos.telefono
                })
            },
            {transaction}
        );

        // Actualiza los datos de acceso.
        const datosUsuario: {
            email?: string;
            password_hash?: string;
            rol?: RolUsuario;
        } = {};

        if (datos.email !== undefined) {
            datosUsuario.email = datos.email;
        }

        if (datos.password !== undefined) {
            datosUsuario.password_hash = await bcrypt.hash(
                datos.password,
                10
            );
        }

        if (datos.rol !== undefined) {
            datosUsuario.rol = datos.rol;
        }

        if (Object.keys(datosUsuario).length > 0) {
            await usuario.update(
                datosUsuario,
                {transaction}
            );
        }

        // Devuelve el usuario actualizado sin su contraseña.
        const usuarioActualizado = await Usuario.findByPk(id, {
            attributes: {
                exclude: ['password_hash']
            },
            include: [
                {
                    model: Persona,
                    as: 'persona'
                }
            ],
            transaction
        });

        return usuarioActualizado;
    });
};

// Desactiva una cuenta sin eliminar registros.
export const desactivarUsuario = async (id: number) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new AppError(
            'Usuario no encontrado',
            404
        );
    }

    if (!usuario.activo) {
        throw new AppError(
            'El usuario ya está desactivado',
            409
        );
    }

    await usuario.update({
        activo: false
    });

    return {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
    };
};

// Reactiva una cuenta existente.
export const activarUsuario = async (id: number) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new AppError(
            'Usuario no encontrado',
            404
        );
    }

    if (usuario.activo) {
        throw new AppError(
            'El usuario ya está activo',
            409
        );
    }

    await usuario.update({
        activo: true
    });

    return {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
    };
};