import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Medicamento as MedicamentoInterface} from '../interfaces/medicamento.interface';

export class Medicamento
    extends Model<MedicamentoInterface, Partial<MedicamentoInterface>>
    implements MedicamentoInterface
{
    declare id: CreationOptional<number>;
    declare nombre: string;
    declare presentacion: string;
    declare cantidad: number;
}

Medicamento.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        presentacion: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'medicamentos',
        timestamps: false,
    }
);
