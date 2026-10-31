import 'dotenv/config';
import {Server} from './core/server';
import {sequelize} from './config/conexion-bd';

const server = new Server();

const esperar = (milisegundos: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, milisegundos);
    });
};

const conectarBaseDeDatos = async (): Promise<void> => {
    const maxIntentos = 10;

    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            await sequelize.authenticate();

            console.log(
                'Conexión a PostgreSQL establecida'
            );

            return;
        } catch (error) {
            console.log(
                `PostgreSQL todavía no está disponible. Intento ${intento}/${maxIntentos}`
            );

            if (intento === maxIntentos) {
                throw error;
            }

            await esperar(2000);
        }
    }
};

const iniciarAplicacion = async (): Promise<void> => {
    try {
        await conectarBaseDeDatos();

        server.listen();
    } catch (error) {
        console.error(
            'Error al conectar con PostgreSQL:',
            error
        );

        process.exit(1);
    }
};

iniciarAplicacion();
