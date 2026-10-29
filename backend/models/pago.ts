import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {EstadoPago} from '../types/estado-pago.type';
import {MedioPago} from '../types/medio-pago.type';

export class Pago extends Model {
    declare id: CreationOptional<number>;
    declare paciente_id: number;
    declare periodo: Date;
    declare monto: number;
    declare fecha_pago: Date | null;
    declare medio_pago: MedioPago | null;
    declare estado: EstadoPago;
    declare observaciones: string | null;
    declare creado_en: CreationOptional<Date>;
}

Pago.init(
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
        periodo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        fecha_pago: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        medio_pago: {
            type: DataTypes.ENUM(
                'efectivo',
                'tarjeta',
                'transferencia',
                'qr',
                'obra_social'
            ),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM(
                'pendiente',
                'pagado',
                'vencido'
            ),
            allowNull: false,
            defaultValue: 'pendiente'
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
        tableName: 'pagos',
        timestamps: false
    }
);