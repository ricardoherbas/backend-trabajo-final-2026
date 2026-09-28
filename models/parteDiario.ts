import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';

export class ParteDiario extends Model {
    declare id: CreationOptional<number>;
    declare asignacion_id: number;
    declare fecha: Date;
    declare animo: string | null;
    declare alimentacion: string | null;
    declare descanso: string | null;
    declare higiene: string | null;
    declare novedades: string | null;
    declare observaciones: string | null;
    declare creado_en: CreationOptional<Date>;
}

ParteDiario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asignacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        animo: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        alimentacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        descanso: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        higiene: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        novedades: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        creado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'partes_diarios',
        timestamps: false
    }
);
