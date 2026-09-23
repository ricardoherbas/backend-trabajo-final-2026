import { DataTypes, Model, CreationOptional } from 'sequelize';
import { sequelize } from '../config/conexion-bd';

export class Familiar extends Model {
    declare id: CreationOptional<number>;
    declare persona_id: number;
}

Familiar.init(
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
    },
    {
        sequelize,
        tableName: 'familiares',
        timestamps: false,
    }
);