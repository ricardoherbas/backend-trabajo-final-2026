import {DataTypes, Model, CreationOptional} from 'sequelize';
import {sequelize} from '../config/conexion-bd';

export class VinculoFamiliar extends Model {
    declare id: CreationOptional<number>;
    declare familiar_id: number;
    declare paciente_id: number;
    declare parentesco: string;
    declare es_contacto_principal: boolean;
    declare codigo_vinculacion: string | null;
    declare codigo_usado: boolean;
    declare creado_en: CreationOptional<Date>;
}

VinculoFamiliar.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        familiar_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parentesco: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        es_contacto_principal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        codigo_vinculacion: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true
        },
        codigo_usado: {
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
        tableName: 'vinculos_familiares',
        timestamps: false
    }
);
