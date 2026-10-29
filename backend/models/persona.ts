import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';

export class Persona extends Model {
    declare id: CreationOptional<number>;
    declare nombre: string;
    declare apellido: string;
    declare dni: string;
    declare fecha_nacimiento: Date | null;
    declare telefono: string | null;
}

Persona.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(30),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'personas',
        timestamps: false
    }
);