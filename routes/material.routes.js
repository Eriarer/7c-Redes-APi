import express from 'express'
import { validateSchema } from '../middleware/validateSchema.middleware.js'
import {
  addMaterial,
  getMateriales,
  getMaterialById,
  deleteMaterial
} from '../controllers/material.controller.js'
import { addMaterialSchema } from '../schema/material.schema.js'

const router = express.Router()

router.post('/create', validateSchema(addMaterialSchema), addMaterial)

router.get('/get', getMateriales)
router.get('/get/:id', getMaterialById)

router.delete('/delete/:id', deleteMaterial)

export default router
