import { z } from 'zod'

export const addEquipoSchema = z.object({
  nombre: z
    .string({ message: 'El nombre es requerido' })
    .min(4, { message: 'El nombre debe tener al menos 4 caracteres' })
    .max(45, { message: 'El nombre no puede exceder 45 caracteres' }),
  descripcion: z
    .string()
    .max(200, { message: 'La descripción no puede exceder 200 caracteres' })
    .optional(),
  disponible: z.boolean().optional()
})

export const updateEquipoSchema = z
  .object({
    nombre: z
      .string()
      .min(4, { message: 'El nombre debe tener al menos 4 caracteres' })
      .max(45, { message: 'El nombre no puede exceder 45 caracteres' })
      .optional(),
    descripcion: z
      .string()
      .max(200, { message: 'La descripción no puede exceder 200 caracteres' })
      .optional(),
    disponible: z.boolean().optional()
  })
  .partial()
