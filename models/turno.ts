import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Turno as TurnoInterface} from '../interfaces/turno.interface';

export class Turno
    extends Model<TurnoInterface, Partial<TurnoInterface>>
    implements TurnoInterface
{
    declare id: CreationOptional<number>;
    declare dia_semana:
        | 'lunes'
        | 'martes'
        | 'miércoles'
        | 'jueves'
        | 'viernes'
        | 'sábado'
        | 'domingo';
    declare hora_inicio: string;
    declare hora_fin: string;
    declare activo: boolean;
    declare creado_en: CreationOptional<Date>;
}

Turno.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        dia_semana: {
            type: DataTypes.ENUM(
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado',
                'domingo'
            ),
            allowNull: false,
        },
        hora_inicio: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        hora_fin: {
            type: DataTypes.TIME,
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
        tableName: 'turnos',
        timestamps: false,
    }
);
