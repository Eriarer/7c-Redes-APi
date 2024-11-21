import { z } from 'zod'

export const MaterialSchema = z.object({
  id_lab: z
    .string({
      required_error: 'El id del laboratorio es requerido'
    })
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  id_prestamo: z
    .string({
      required_error: 'El id del préstamo es requerido'
    })
    .max(6, 'El id del préstamo debe tener a lo sumo 6 caracteres'),
  id_usuario: z
    .string({
      required_error: 'El id del usuario es requerido'
    })
    .max(6, 'El id del usuario debe tener a lo sumo 6 caracteres'),
  id_equipo: z
    .string({
      required_error: 'El id del equipo es requerido'
    })
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres'),
  activo: z.boolean().default(true)
})

export const UpdateMaterialSchema = z.object({
  id_lab: z
    .string({})
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  id_prestamo: z
    .string({})
    .max(6, 'El id del préstamo debe tener a lo sumo 6 caracteres'),
  id_usuario: z
    .string({})
    .max(6, 'El id del usuario debe tener a lo sumo 6 caracteres'),
  id_equipo: z
    .string({})
    .max(6, 'El id del equipo debe tener a lo sumo 6 caracteres'),
  activo: z.boolean()
})
