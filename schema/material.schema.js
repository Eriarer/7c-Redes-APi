import { z } from 'zod'

export const addMaterialSchema = z.object({
  idprestamo: z.string({ message: 'El Id de préstamo es requerido' }),
  idlaboratorio: z.string({ message: 'El Id de laboratorio es requerido' }),
  idunidad: z.string({ message: 'El Id de unidad es requerido' }),
  cantidad: z
    .number({ message: 'La cantidad es requerida' })
    .int({ message: 'La cantidad debe ser un número entero' })
    .positive({ message: 'La cantidad debe ser mayor a 0' })
})

export const updateMaterialSchema = z.object({
  cantidad: z
    .number({ message: 'La cantidad es requerida' })
    .int({ message: 'La cantidad debe ser un número entero' })
    .positive({ message: 'La cantidad debe ser mayor a 0' })
})
