import { z } from 'zod';
import type { DatosPersona } from '../interfaces/persona.interface';

export const personaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  dni: z
    .string()
    .trim()
    .min(1, 'El DNI es obligatorio')
    .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 números, sin puntos'),
  fecha_nacimiento: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), 'La fecha de nacimiento no es válida')
    .refine((v) => !v || Date.parse(v) <= Date.now(), 'La fecha de nacimiento no puede ser futura'),
  telefono: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]*$/, 'El teléfono solo admite números, espacios, +, - y paréntesis')
    .optional(),
});
export type PersonaFormValues = z.infer<typeof personaSchema>;

/** Convierte el formulario al payload del backend ('' → null). */
export const personaFormAPayload = (f: PersonaFormValues): DatosPersona => ({
  nombre: f.nombre.trim(),
  apellido: f.apellido.trim(),
  dni: f.dni.trim(),
  fecha_nacimiento: f.fecha_nacimiento || null,
  telefono: f.telefono?.trim() || null,
});