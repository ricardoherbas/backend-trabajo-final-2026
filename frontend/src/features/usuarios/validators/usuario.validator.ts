import { z } from 'zod';

export const usuarioSchema = z.object({
  nombre: z.string().min(1, 'Ingresá el nombre'),
  apellido: z.string().min(1, 'Ingresá el apellido'),
  dni: z.string().min(1, 'Ingresá el DNI'),
  fecha_nacimiento: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().min(1, 'Ingresá el email').email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: z.enum(['administrador', 'secretaria', 'cuidadora', 'familiar'], { error: 'Elegí un rol' }),
});
export type UsuarioForm = z.infer<typeof usuarioSchema>;
