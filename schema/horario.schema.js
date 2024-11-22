import { z } from 'zod'

export const HorarioSchema = z.object({
  id_horario: z
    .string({
      required_error: 'El id del horario es requerido'
    })
    .min(1, 'El id del horario debe tener al menos 1 caracter')
    .max(6, 'El id del horario debe tener a lo sumo 6 caracteres'),
  id_lab: z
    .string({
      required_error: 'El id del laboratorio es requerido'
    })
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  hora_inicio: z.string({
    required_error: 'La hora de inicio es requerida'
  }),
  hora_cierre: z.string({
    required_error: 'La hora de cierre es requerida'
  }),
  dia: z
    .string({
      required_error: 'El día es requerido'
    })
    .max(9, 'El día debe tener a lo sumo 9 caracteres'),
  descripcion: z
    .string()
    .max(300, {
      message: 'La descripción debe tener a lo sumo 300 caracteres'
    })
    .optional()
})

export const UpdateHorarioSchema = z.object({
  id_horario: z
    .string()
    .max(6, 'El id del horario debe tener a lo sumo 6 caracteres')
    .optional(),
  id_lab: z
    .string()
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres')
    .optional(),
  hora_inicio: z.string().optional(),
  hora_cierre: z.string().optional(),
  dia: z.string().max(9, 'El día debe tener a lo sumo 9 caracteres').optional(),
  descripcion: z
    .string()
    .max(300, {
      message: 'La descripción debe tener a lo sumo 300 caracteres'
    })
    .optional()
})
