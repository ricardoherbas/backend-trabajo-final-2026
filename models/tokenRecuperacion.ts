import {DataTypes, Model, CreationOptional} from 'sequelize';
import { sequelize } from '../config/conexion-bd';

export class TokenRecuperacion extends Model {
    declare id: CreationOptional<number>;
    declare usuario_id: number;
    declare token_hash: string;
    declare expira_en: Date;
    declare usado: CreationOptional<boolean>;
    declare creado_en: CreationOptional<Date>;
}

TokenRecuperacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        token_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
        },
        expira_en: {
            type: DataTypes.DATE,
            allowNull: false
        },
        usado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        creado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'tokens_recuperacion',
        timestamps: false
    }
);
