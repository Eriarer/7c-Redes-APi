import { z } from 'zod'

export const PrestamoSchema = z.object({
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
  fecha_hora: z.date({
    required_error: 'La fecha y hora del préstamo son requeridas'
  }),
  observaciones: z
    .string({
      required_error: 'Las observaciones son requeridas'
    })
    .max(280, 'Las observaciones deben tener a lo sumo 280 caracteres'),
  estado: z.enum(['A', 'I'], {
    required_error: 'El estado del préstamo es requerido'
  }),
  activo: z.boolean().default(true)
})

export const UpdatePrestamoSchema = z.object({
  id_lab: z
    .string({})
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  id_prestamo: z
    .string({})
    .max(6, 'El id del préstamo debe tener a lo sumo 6 caracteres'),
  id_usuario: z
    .string({})
    .max(6, 'El id del usuario debe tener a lo sumo 6 caracteres'),
  fecha_hora: z.date({}),
  observaciones: z
    .string({})
    .max(280, 'Las observaciones deben tener a lo sumo 280 caracteres'),
  estado: z.enum(['A', 'I']),
  activo: z.boolean()
})
