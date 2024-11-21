import { Router } from 'express'
import { addResponsable } from '../controllers/responsable.controller.js'
import { addResponsableSchema } from '../schema/responsable.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'

const router = Router()

router.post('/create', validateSchema(addResponsableSchema), addResponsable)

export default router
