INSERT INTO personas (
    nombre,
    apellido,
    dni,
    fecha_nacimiento,
    telefono
)
VALUES (
    'Administrador',
    'Principal',
    '00000000',
    NULL,
    NULL
)
ON CONFLICT (dni) DO NOTHING;

INSERT INTO usuarios (
    persona_id,
    email,
    password_hash,
    rol,
    activo
)
SELECT
    id,
    'admin@email.com',
    '$2b$10$NLvydfMbayxlanjqQj2Zlex1J7VFUzG1UNamVn3QLsoOJLjtirHAW',
    'administrador',
    TRUE
FROM personas
WHERE dni = '00000000'
ON CONFLICT (email) DO NOTHING;

INSERT INTO administradores (
    persona_id
)
SELECT
    p.id
FROM personas p
JOIN usuarios u
    ON u.persona_id = p.id
WHERE p.dni = '00000000'
  AND u.email = 'admin@email.com'
ON CONFLICT (persona_id) DO NOTHING;
