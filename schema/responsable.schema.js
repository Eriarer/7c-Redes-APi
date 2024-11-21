import { z } from 'zod'

export const ResponsableSchema = z.object({
  id_responsable: z
    .string({
      required_error: 'El id del responsable es requerido'
    })
    .max(6),
  nombre: z
    .string({
      required_error: 'El nombre del responsable es requerido'
    })
    .max(60),
  tipo: z.enum(['E', 'P', 'A'], {
    required_error: 'El tipo de responsable es requerido'
  }),
  activo: z.boolean().default(true)
})

export const UpdateResponsableSchema = z.object({
  id_responsable: z.string().max(6),
  nombre: z.string().max(60),
  tipo: z.enum(['E', 'P', 'A'], {
    invalid_type_error: 'El tipo de responsable debe ser una cadena de texto'
  }),
  activo: z.boolean()
})
