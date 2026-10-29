import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {Persona, Usuario, Administrador} from '../../models';

const crearAdministrador = async () => {
    const nombre = process.env.ADMIN_NOMBRE;
    const apellido = process.env.ADMIN_APELLIDO;
    const dni = process.env.ADMIN_DNI;
    const fechaNacimiento =
        process.env.ADMIN_FECHA_NACIMIENTO || null;
    const telefono =
        process.env.ADMIN_TELEFONO || null;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (
        !nombre ||
        !apellido ||
        !dni ||
        !email ||
        !password
    ) {
        throw new Error(
            'Faltan datos obligatorios del administrador en el .env'
        );
    }

    const personaExistente =
        await Persona.findOne({
            where: {
                dni
            }
        });

    const persona =
        personaExistente ??
        await Persona.create({
            nombre,
            apellido,
            dni,
            fecha_nacimiento:
                fechaNacimiento,
            telefono
        });

    const usuarioExistente =
        await Usuario.findOne({
            where: {
                email
            }
        });

    const usuario =
        usuarioExistente ??
        await Usuario.create({
            persona_id: persona.id,
            email,
            password_hash:
                await bcrypt.hash(password, 10),
            rol: 'administrador',
            activo: true
        });

    const administradorExistente =
        await Administrador.findOne({
            where: {
                persona_id: persona.id
            }
        });

    if (!administradorExistente) {
        await Administrador.create({
            persona_id: persona.id
        });
    }

    console.log(
        `Administrador creado/verificado: ${usuario.email}`
    );
};

crearAdministrador()
    .then(() => {
        console.log('Seed ejecutado correctamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error(
            'Error ejecutando el seed:',
            error
        );
        process.exit(1);
    });
