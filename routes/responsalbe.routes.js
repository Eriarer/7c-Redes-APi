import { Router } from 'express'
import {
  getResponsables,
  addResponsable,
  deleteResponsable
} from '../controllers/responsable.controller.js'
import { addResponsableSchema } from '../schema/responsable.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'

const router = Router()

router.post('/create', validateSchema(addResponsableSchema), addResponsable)
router.get('/find', getResponsables)
router.delete('/delete/:id', deleteResponsable)

export default router
