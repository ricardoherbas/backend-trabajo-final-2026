# Frontend · Gestión de pacientes y cuidados

React + TypeScript + Vite. Consume el backend `backend-trabajo-final-2026` (`/api/...`).

## Puesta en marcha

```bash
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

En el backend, definir `FRONTEND_URL=http://localhost:5173` para que el enlace
del email de recuperación apunte a `/restablecer-password?token=...`.

## Arquitectura

| Carpeta | Rol |
|---|---|
| `src/app/router/routes.config.tsx` | **Única fuente** de rutas y roles (espeja `verificarRol` del back). Lo leen el router, el guard y el menú. |
| `src/core/api` | `httpClient` (Singleton + interceptores JWT) y `crudApi` (Factory de services CRUD). |
| `src/core/auth` | `AuthContext` (Provider), `useAuth`, `tokenStorage`. |
| `src/core/types` | Espejo de `types/` e `interfaces/` del backend. |
| `src/features/<modulo>` | `interfaces/ services/ validators/ hooks/ adapters/ pages/ components/` por módulo. |
| `src/shared` | Componentes, layouts, hooks y utilidades reutilizables. |

Patrones: Feature-based, Service layer, Factory, Singleton + Interceptor,
Provider, Guard, Strategy (permisos por rol), Adapter, Custom hooks.

## Estado de los módulos

| Módulo | Estado |
|---|---|
| Auth (login, registro con código/QR, recuperar y restablecer contraseña) | Completo |
| Perfil | Completo |
| Pacientes | CRUD completo |
| Usuarios | Solo alta (el back no tiene listar/editar) |
| Vínculos familiares + QR | Listado, alta y QR |
| **Medicamentos** (Persona B) | CRUD completo: alta/edición en modal, búsqueda, eliminar (solo admin). Cuidadora: solo lectura. |
| **Tratamientos** (Persona B) | CRUD completo: formulario en página, filtros por estado/paciente/medicamento. Cuidadora: solo lectura. |
| **Pagos** (Persona B) | CRUD completo, filtros, resumen de montos y acción rápida *Registrar cobro*. Solo admin y secretaria. |
| Familiares, cuidadoras, turnos, asignaciones, partes diarios | Listado de solo lectura. Service e interfaces ya listos; falta alta/edición. |

Para completar un módulo: crear `hooks/` + `components/<Entidad>Form.tsx` +
`pages/<Entidad>FormPage.tsx` siguiendo el patrón de `features/pacientes`.

## Reglas de negocio de Medicamentos → Tratamientos → Pagos

- Un **tratamiento** necesita un paciente y un medicamento ya existentes (el form avisa y enlaza al catálogo si faltan).
- Hay un solo **pago por paciente y mes**: el período se carga por mes y se guarda siempre como día 1.
- El backend devuelve `paciente` sin la persona en tratamientos y pagos, por eso los nombres se
  resuelven con `shared/hooks/usePacienteOpciones` (misma cache que la lista de pacientes).
- `PUT` exige el cuerpo completo (usa el mismo validador que el alta): los formularios siempre envían todos los campos.

## Brechas del backend que afectan al front

1. **No hay endpoint para crear una Persona.** `POST /pacientes`, `/cuidadoras` y
   `/familiares` piden un `persona_id` existente; solo `POST /usuarios` crea personas
   (y siempre con cuenta y rol). Hoy el alta de paciente pide el ID a mano.
2. **`POST /auth/registro`**: el validador exige `nombre`, `apellido` y `dni`, pero el
   service solo usa `codigo_vinculacion`, `email` y `password`. El front envía todo.
3. La cuidadora ve **todas** las asignaciones, turnos y pacientes (no hay filtro por usuario).
4. El familiar solo puede leer `GET /pacientes/:id` y `GET /vinculosFamiliares/:id`:
   no hay endpoints de partes, tratamientos ni pagos para su rol.
5. `GET /cuidadoras` y `GET /familiares` son solo de administrador (la propuesta le da
   estos módulos también a la secretaria).
6. Usuarios: no existen listar, editar ni desactivar.
7. Los pagos no pasan solos a `vencido`: hoy el estado se cambia a mano. Si se quiere automático, tiene que resolverlo el back.
8. El backend usa `cors()` abierto; en producción conviene restringirlo al dominio de Vercel.

## Deploy (Vercel)

`vercel.json` ya incluye el rewrite a `index.html`. Definir `VITE_API_URL` en las
variables de entorno del proyecto.

Nota: `.npmrc` tiene `legacy-peer-deps=true` por un conflicto de peer dependencies
de `@hookform/resolvers` con la versión de `effect` que resuelve npm.
