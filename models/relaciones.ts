import { Persona } from './persona';
import { Usuario } from './usuario';
import { Administrador } from './administrador';
import { Secretaria } from './secretaria';
import { Cuidadora } from './cuidadora';
import { Familiar } from './familiar';
import { Paciente } from './paciente';
import { VinculoFamiliar } from './vinculoFamiliar';
import { Turno } from './turno';
import { Asignacion } from './asignacion';
import { Medicamento } from './medicamento';
import { Tratamiento } from './tratamiento';
import { ParteDiario } from './parteDiario';
import { Pago } from './pago';

/*
 * PERSONA - USUARIO
 *
 * Una persona puede tener como máximo una cuenta de usuario.
 * Un usuario pertenece a una única persona.
 */
Persona.hasOne(Usuario, {
    foreignKey: 'persona_id',
    as: 'usuario',
});

Usuario.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * PERSONA - ADMINISTRADOR
 *
 * Una persona puede corresponder a un administrador.
 * Un administrador pertenece a una única persona.
 */
Persona.hasOne(Administrador, {
    foreignKey: 'persona_id',
    as: 'administrador',
});

Administrador.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * PERSONA - SECRETARIA
 *
 * Una persona puede corresponder a una secretaria.
 * Una secretaria pertenece a una única persona.
 */
Persona.hasOne(Secretaria, {
    foreignKey: 'persona_id',
    as: 'secretaria',
});

Secretaria.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * PERSONA - CUIDADORA
 *
 * Una persona puede corresponder a una cuidadora.
 * Una cuidadora pertenece a una única persona.
 */
Persona.hasOne(Cuidadora, {
    foreignKey: 'persona_id',
    as: 'cuidadora',
});

Cuidadora.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * PERSONA - FAMILIAR
 *
 * Una persona puede corresponder a un familiar.
 * Un familiar pertenece a una única persona.
 */
Persona.hasOne(Familiar, {
    foreignKey: 'persona_id',
    as: 'familiar',
});

Familiar.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * PERSONA - PACIENTE
 *
 * Una persona puede corresponder a un paciente.
 * Un paciente pertenece a una única persona.
 */
Persona.hasOne(Paciente, {
    foreignKey: 'persona_id',
    as: 'paciente',
});

Paciente.belongsTo(Persona, {
    foreignKey: 'persona_id',
    as: 'persona',
});


/*
 * FAMILIAR - VINCULO_FAMILIAR
 *
 * Un familiar puede tener varios vínculos.
 * Cada vínculo pertenece a un único familiar.
 */
Familiar.hasMany(VinculoFamiliar, {
    foreignKey: 'familiar_id',
    as: 'vinculos',
});

VinculoFamiliar.belongsTo(Familiar, {
    foreignKey: 'familiar_id',
    as: 'familiar',
});


/*
 * PACIENTE - VINCULO_FAMILIAR
 *
 * Un paciente puede tener varios familiares.
 * Cada vínculo pertenece a un único paciente.
 */
Paciente.hasMany(VinculoFamiliar, {
    foreignKey: 'paciente_id',
    as: 'vinculosFamiliares',
});

VinculoFamiliar.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'paciente',
});


/*
 * TURNO - ASIGNACION
 *
 * Un turno puede tener varias asignaciones.
 * Cada asignación pertenece a un único turno.
 */
Turno.hasMany(Asignacion, {
    foreignKey: 'turno_id',
    as: 'asignaciones',
});

Asignacion.belongsTo(Turno, {
    foreignKey: 'turno_id',
    as: 'turno',
});


/*
 * CUIDADORA - ASIGNACION
 *
 * Una cuidadora puede tener varias asignaciones.
 * Cada asignación pertenece a una única cuidadora.
 */
Cuidadora.hasMany(Asignacion, {
    foreignKey: 'cuidador_id',
    as: 'asignaciones',
});

Asignacion.belongsTo(Cuidadora, {
    foreignKey: 'cuidador_id',
    as: 'cuidadora',
});


/*
 * PACIENTE - ASIGNACION
 *
 * Un paciente puede tener varias asignaciones.
 * Cada asignación pertenece a un único paciente.
 */
Paciente.hasMany(Asignacion, {
    foreignKey: 'paciente_id',
    as: 'asignaciones',
});

Asignacion.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'paciente',
});


/*
 * PACIENTE - TRATAMIENTO
 *
 * Un paciente puede tener varios tratamientos.
 * Cada tratamiento pertenece a un único paciente.
 */
Paciente.hasMany(Tratamiento, {
    foreignKey: 'paciente_id',
    as: 'tratamientos',
});

Tratamiento.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'paciente',
});


/*
 * MEDICAMENTO - TRATAMIENTO
 *
 * Un medicamento puede aparecer en varios tratamientos.
 * Cada tratamiento utiliza un único medicamento.
 */
Medicamento.hasMany(Tratamiento, {
    foreignKey: 'medicamento_id',
    as: 'tratamientos',
});

Tratamiento.belongsTo(Medicamento, {
    foreignKey: 'medicamento_id',
    as: 'medicamento',
});


/*
 * ASIGNACION - PARTE_DIARIO
 *
 * Una asignación puede tener varios partes diarios.
 * Cada parte diario pertenece a una única asignación.
 */
Asignacion.hasMany(ParteDiario, {
    foreignKey: 'asignacion_id',
    as: 'partesDiarios',
});

ParteDiario.belongsTo(Asignacion, {
    foreignKey: 'asignacion_id',
    as: 'asignacion',
});


/*
 * PACIENTE - PAGO
 *
 * Un paciente puede tener varios pagos.
 * Cada pago pertenece a un único paciente.
 */
Paciente.hasMany(Pago, {
    foreignKey: 'paciente_id',
    as: 'pagos',
});

Pago.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'paciente',
});