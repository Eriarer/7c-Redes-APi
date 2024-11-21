import { z } from 'zod'

export const LaboratorioSchema = z.object({
  id_lab: z
    .string({
      required_error: 'El id del laboratorio es requerido'
    })
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  plantel: z
    .string({
      required_error: 'El plantel es requerido'
    })
    .max(4, 'El plantel debe tener a lo sumo 4 caracteres'),
  num_ed: z
    .string({
      required_error: 'El número de edificio es requerido'
    })
    .max(4, 'El número de edificio debe tener a lo sumo 4 caracteres'),
  aula: z
    .string({
      required_error: 'El aula es requerida'
    })
    .max(6, 'El aula debe tener a lo sumo 6 caracteres'),
  departamento: z
    .string({
      required_error: 'El departamento es requerido'
    })
    .max(80, 'El departamento debe tener a lo sumo 80 caracteres'),
  cupo: z
    .string({
      required_error: 'El cupo es requerido'
    })
    .max(2, 'El cupo debe tener a lo sumo 2 caracteres'),
  activo: z.boolean().default(true)
})

export const UpdateLaboratorioSchema = z.object({
  id_lab: z
    .string({})
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  plantel: z.string({}).max(4, 'El plantel debe tener a lo sumo 4 caracteres'),
  num_ed: z
    .string({})
    .max(4, 'El número de edificio debe tener a lo sumo 4 caracteres'),
  aula: z.string({}).max(6, 'El aula debe tener a lo sumo 6 caracteres'),
  departamento: z
    .string({})
    .max(80, 'El departamento debe tener a lo sumo 80 caracteres'),
  cupo: z.string({}).max(2, 'El cupo debe tener a lo sumo 2 caracteres'),
  activo: z.boolean()
})
