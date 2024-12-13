import { z } from 'zod'

export const addEquipoSchema = z.object({
  id_equipo: z
    .string({
      required_error: 'El id del equipo es requerido'
    })
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres'),
  nombre: z
    .string({
      required_error: 'El nombre del equipo es requerido'
    })
    .max(45, 'El nombre del equipo debe tener a lo sumo 20 caracteres'),
  descripcion: z
    .string({
      required_error: 'La descripción del equipo es requerida'
    })
    .max(200, 'La descripción del equipo debe tener a lo sumo 100 caracteres'),
  disponible: z.boolean().default(true).optional()
})

export const updateEquipoSchema = z.object({
  id_equipo: z
    .string({})
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres')
    .optional(),
  nombre: z
    .string({})
    .max(45, 'El nombre del equipo debe tener a lo sumo 20 caracteres')
    .optional(),
  descripcion: z
    .string({})
    .max(200, 'La descripción del equipo debe tener a lo sumo 100 caracteres'),
  disponible: z.boolean().optional()
})
