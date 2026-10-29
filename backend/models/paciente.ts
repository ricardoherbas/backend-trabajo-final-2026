import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Paciente as PacienteInterface} from '../interfaces/paciente.interface';

export class Paciente
    extends Model<PacienteInterface, Partial<PacienteInterface>>
    implements PacienteInterface
{
    declare id: CreationOptional<number>;
    declare persona_id: number;
    declare direccion: string | null;
    declare obra_social: string | null;
    declare observaciones: string | null;
    declare activo: boolean;
    declare creado_en: CreationOptional<Date>;
}

Paciente.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        persona_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        obra_social: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        creado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'pacientes',
        timestamps: false,
    }
);
