import { Router } from 'express'
import {
  gethorarios,
  deletehorario,
  addhorario
} from '../controllers/responsable.controller.js'
import { addResponsableSchema } from '../schema/responsable.schema.js'
import { validateSchema } from '../middleware/validateSchema.middleware.js'

const router = Router()

router.get('/horarios', gethorarios)
router.delete('/horarios/:id', deletehorario)
router.post('/horarios', validateSchema(addResponsableSchema), addhorario)

export default router
