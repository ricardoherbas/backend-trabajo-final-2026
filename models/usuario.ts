import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';
import {Usuario as UsuarioInterface} from '../interfaces/usuario.interface';

export class Usuario
    extends Model<UsuarioInterface, Partial<UsuarioInterface>>
    implements UsuarioInterface
{
    declare id: CreationOptional<number>;
    declare persona_id: number;
    declare email: string;
    declare password_hash: string;
    declare rol:
        | 'administrador'
        | 'secretaria'
        | 'cuidadora'
        | 'familiar';
    declare activo: boolean;
    declare creado_en: CreationOptional<Date>;
    declare actualizado_en: CreationOptional<Date>;
}

Usuario.init(
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
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM(
                'administrador',
                'secretaria',
                'cuidadora',
                'familiar'
            ),
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
        actualizado_en: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: false,
    }
);
