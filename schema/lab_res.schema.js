import { z } from 'zod'

export const LabResSchema = z.object({
  id_responsable: z
    .string({
      required_error: 'El id del responsable es requerido'
    })
    .max(6, 'El id del responsable debe tener a lo sumo 6 caracteres'),
  id_lab: z
    .string({
      required_error: 'El id del laboratorio es requerido'
    })
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  activo: z.boolean().default(true)
})

export const UpdateLabResSchema = z.object({
  id_responsable: z
    .string({})
    .max(6, 'El id del responsable debe tener a lo sumo 6 caracteres'),
  id_lab: z
    .string({})
    .max(6, 'El id del laboratorio debe tener a lo sumo 6 caracteres'),
  activo: z.boolean()
})
