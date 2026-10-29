import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';

export class Tratamiento extends Model {
    declare id: CreationOptional<number>;
    declare paciente_id: number;
    declare medicamento_id: number;
    declare dosis: string;
    declare frecuencia: string;
    declare horario: string | null;
    declare desde: Date | null;
    declare hasta: Date | null;
    declare activa: boolean;
    declare creado_en: CreationOptional<Date>;
}

Tratamiento.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        medicamento_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dosis: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        frecuencia: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        horario: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        desde: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        hasta: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        activa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        creado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'tratamientos',
        timestamps: false
    }
);