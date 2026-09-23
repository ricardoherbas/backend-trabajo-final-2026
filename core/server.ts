import express from 'express';
import cors from 'cors';
import authRouter from '../routes/auth.route';
import usuarioRouter from '../routes/usuarios.route';
import administradorRouter from '../routes/administrador.route';
import secretariaRouter from '../routes/secretaria.route';
import cuidadoraRouter from '../routes/cuidadora.route';
import familiarRouter from '../routes/familiar.route';
import pacienteRouter from '../routes/paciente.route';
import vinculoFamiliarRouter from '../routes/vinculoFamiliar.route';
import turnoRouter from '../routes/turno.route';
import asignacionRouter from '../routes/asignacion.route';
import medicamentoRouter from '../routes/medicamentos.route';
import tratamientoRouter from '../routes/tratamiento.route';
import parteDiarioRouter from '../routes/parteDiario.route';
import pagoRouter from '../routes/pago.route';
import {manejarError} from '../middlewares/error.middleware';

export class Server {
    public app;
    public port: number;

    constructor() {
        this.app = express();
        this.port =
            Number(process.env.PORT) || 3000;

        this.middleware();
        this.rutas();
        this.errorHandlerGlobal();
    }

    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    rutas() {
        this.app.use('/api/auth', authRouter);
        this.app.use('/api/usuarios', usuarioRouter);
        this.app.use('/api/administradores', administradorRouter);
        this.app.use('/api/secretarias', secretariaRouter);
        this.app.use('/api/cuidadoras', cuidadoraRouter);
        this.app.use('/api/familiares', familiarRouter);
        this.app.use('/api/pacientes', pacienteRouter);
        this.app.use('/api/vinculosFamiliares', vinculoFamiliarRouter);
        this.app.use('/api/turnos', turnoRouter);
        this.app.use('/api/asignaciones', asignacionRouter);
        this.app.use('/api/medicamentos', medicamentoRouter);
        this.app.use('/api/tratamientos', tratamientoRouter);
        this.app.use('/api/partesDiarios', parteDiarioRouter);
        this.app.use('/api/pagos', pagoRouter);
    }

    errorHandlerGlobal() {this.app.use(manejarError);}

    getApp() {return this.app;}

    listen() {this.app.listen(this.port, '0.0.0.0', () => {
                console.log(`La API está escuchando en el puerto: ${this.port}`);
            }
        );
    }
}
