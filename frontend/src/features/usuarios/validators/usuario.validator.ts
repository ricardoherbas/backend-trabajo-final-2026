import { z } from 'zod';

const ROLES = ['administrador', 'secretaria', 'cuidadora', 'familiar'] as const;

const camposComunes = {
  nombre: z.string().min(1, 'Ingresá el nombre'),
  apellido: z.string().min(1, 'Ingresá el apellido'),
  dni: z.string().min(1, 'Ingresá el DNI'),
  fecha_nacimiento: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().min(1, 'Ingresá el email').email('El email no es válido'),
  rol: z.enum(ROLES, { error: 'Elegí un rol' }),
};

/** alta: la contraseña inicial es obligatoria. */
export const usuarioSchema = z.object({
  ...camposComunes,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
export type UsuarioForm = z.infer<typeof usuarioSchema>;

/** edicion: la contraseña es opcional; vacia significa "no cambiarla". */
export const usuarioEdicionSchema = z.object({
  ...camposComunes,
  password: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 8, 'La contraseña debe tener al menos 8 caracteres'),
});
export type UsuarioEdicionForm = z.infer<typeof usuarioEdicionSchema>;