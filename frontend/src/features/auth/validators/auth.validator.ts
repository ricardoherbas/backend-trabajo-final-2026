import { z } from 'zod';

const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');

export const loginSchema = z.object({
  email: z.string().min(1, 'Ingresá tu email').email('El email no es válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const recuperarSchema = z.object({
  email: z.string().min(1, 'Ingresá tu email').email('El email no es válido'),
});
export type RecuperarForm = z.infer<typeof recuperarSchema>;

export const restablecerSchema = z
  .object({
    nuevaPassword: password,
    repetir: z.string(),
  })
  .refine((d) => d.nuevaPassword === d.repetir, {
    path: ['repetir'],
    message: 'Las contraseñas no coinciden',
  });
export type RestablecerForm = z.infer<typeof restablecerSchema>;

export const registroFamiliarSchema = z
  .object({
    codigo_vinculacion: z.string().min(1, 'Ingresá el código de vinculación'),
    nombre: z.string().min(1, 'Ingresá tu nombre'),
    apellido: z.string().min(1, 'Ingresá tu apellido'),
    dni: z.string().min(1, 'Ingresá tu DNI'),
    fecha_nacimiento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().min(1, 'Ingresá tu email').email('El email no es válido'),
    password,
    repetir: z.string(),
  })
  .refine((d) => d.password === d.repetir, {
    path: ['repetir'],
    message: 'Las contraseñas no coinciden',
  });
export type RegistroFamiliarForm = z.infer<typeof registroFamiliarSchema>;
