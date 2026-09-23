CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    telefono VARCHAR(30)
);
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE,
    CHECK (rol IN ('administrador','secretaria','cuidadora','familiar'))
);
CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_administrador_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE
);
CREATE TABLE secretarias (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_secretaria_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE
);
CREATE TABLE cuidadores (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_cuidador_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE
);
CREATE TABLE familiares (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_familiar_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE
);
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    persona_id INT NOT NULL UNIQUE,
    direccion VARCHAR(200),
    obra_social VARCHAR(100),
    observaciones TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paciente_persona
        FOREIGN KEY (persona_id)
        REFERENCES personas(id)
        ON DELETE CASCADE
);
CREATE TABLE vinculos_familiares (
    id SERIAL PRIMARY KEY,
    familiar_id INT NOT NULL,
    paciente_id INT NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    es_contacto_principal BOOLEAN NOT NULL DEFAULT FALSE,
    codigo_vinculacion VARCHAR(100) UNIQUE,
    codigo_usado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vinculo_familiar
        FOREIGN KEY (familiar_id)
        REFERENCES familiares(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_vinculo_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_familiar_paciente
        UNIQUE (familiar_id,paciente_id)
);
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (dia_semana IN ('lunes','martes','miércoles','jueves','viernes','sábado','domingo')),
    CHECK (hora_fin > hora_inicio)
);
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    turno_id INT NOT NULL,
    cuidador_id INT NOT NULL,
    paciente_id INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asignacion_turno
        FOREIGN KEY (turno_id)
        REFERENCES turnos(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_asignacion_cuidador
        FOREIGN KEY (cuidador_id)
        REFERENCES cuidadores(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_asignacion_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_asignacion
        UNIQUE (turno_id,cuidador_id,paciente_id)
);
CREATE TABLE medicamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    presentacion VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT chk_medicamento_cantidad
        CHECK (cantidad > 0)
);
CREATE TABLE tratamientos (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL,
    medicamento_id INT NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    horario VARCHAR(100),
    desde DATE,
    hasta DATE,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tratamiento_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tratamiento_medicamento
        FOREIGN KEY (medicamento_id)
        REFERENCES medicamentos(id)
        ON DELETE RESTRICT,
    CHECK (hasta IS NULL OR desde IS NULL OR hasta >= desde)
);
CREATE TABLE partes_diarios (
    id SERIAL PRIMARY KEY,
    asignacion_id INT NOT NULL,
    fecha DATE NOT NULL,
    animo VARCHAR(50),
    alimentacion VARCHAR(100),
    descanso VARCHAR(100),
    higiene VARCHAR(100),
    novedades TEXT,
    observaciones TEXT,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parte_asignacion
        FOREIGN KEY (asignacion_id)
        REFERENCES asignaciones(id)
        ON DELETE RESTRICT
);
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL,
    periodo DATE NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha_pago DATE,
    medio_pago VARCHAR(30),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id)
        ON DELETE RESTRICT,
    CHECK (monto >= 0),
    CHECK (medio_pago IS NULL OR medio_pago IN ('efectivo','tarjeta','transferencia','qr','obra_social')),
    CHECK (estado IN ('pendiente','pagado','vencido')),
    CONSTRAINT uq_pago_paciente_periodo
        UNIQUE (paciente_id,periodo)
);


CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_usuarios_actualizado
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE OR REPLACE FUNCTION actualizar_estado_pago()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_pago IS NOT NULL THEN
        NEW.estado = 'pagado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_actualizar_estado_pago
BEFORE INSERT OR UPDATE ON pagos
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_pago();

CREATE OR REPLACE FUNCTION actualizar_pagos_vencidos()
RETURNS VOID AS $$
BEGIN
    UPDATE pagos
    SET estado = 'vencido'
    WHERE estado = 'pendiente'
      AND fecha_pago IS NULL
      AND periodo < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;