import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Asignacion as AsignacionInterface} from '../interfaces/asignacion.interface';

export class Asignacion
    extends Model<AsignacionInterface, Partial<AsignacionInterface>>
    implements AsignacionInterface
{
    declare id: CreationOptional<number>;
    declare turno_id: number;
    declare cuidador_id: number;
    declare paciente_id: number;
    declare activo: boolean;
    declare creado_en: CreationOptional<Date>;
}

Asignacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        turno_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cuidador_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'asignaciones',
        timestamps: false,
    }
);
