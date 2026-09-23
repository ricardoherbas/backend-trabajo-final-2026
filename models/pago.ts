import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Pago as PagoInterface} from '../interfaces/pago.interface';

export class Pago
    extends Model<PagoInterface, Partial<PagoInterface>>
    implements PagoInterface
{
    declare id: CreationOptional<number>;
    declare paciente_id: number;
    declare periodo: Date;
    declare monto: number;
    declare fecha_pago: Date | null;
    declare medio_pago:
        | 'efectivo'
        | 'tarjeta'
        | 'transferencia'
        | 'qr'
        | 'obra_social'
        | null;
    public estado!:
        | 'pendiente'
        | 'pagado'
        | 'vencido';
    public observaciones!: string | null;
    public creado_en!: CreationOptional<Date>;
}

Pago.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        periodo: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        fecha_pago: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        medio_pago: {
            type: DataTypes.ENUM(
                'efectivo',
                'tarjeta',
                'transferencia',
                'qr',
                'obra_social'
            ),
            allowNull: true,
        },
        estado: {
            type: DataTypes.ENUM(
                'pendiente',
                'pagado',
                'vencido'
            ),
            allowNull: false,
            defaultValue: 'pendiente',
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        creado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'pagos',
        timestamps: false,
    }
);
