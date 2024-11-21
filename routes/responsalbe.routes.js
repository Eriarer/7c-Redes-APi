import { Router } from 'express'
import {
  getResponsables,
  addResponsable
} from '../controllers/responsable.controller.js'
import { addResponsableSchema } from '../schema/responsable.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'

const router = Router()

router.post('/create', validateSchema(addResponsableSchema), addResponsable)
router.get('/find', getResponsables)

export default router
