import { z } from 'zod'

export const InventarioSchema = z.object({
  id_equipo: z
    .string({
      required_error: 'El id del equipo es requerido'
    })
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres'),
  id_lab: z
    .string({
      required_error: 'El id del laboratorio es requerido'
    })
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  cantidad: z
    .number({
      required_error: 'La cantidad es requerida'
    })
    .int('La cantidad debe ser un número entero'),
  activo: z.boolean().default(true)
})

export const UpdateInventarioSchema = z.object({
  id_equipo: z
    .string({})
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres'),
  id_lab: z
    .string({})
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  cantidad: z.number({}).int('La cantidad debe ser un número entero'),
  activo: z.boolean()
})
