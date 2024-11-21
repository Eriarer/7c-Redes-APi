import JsonDatabase from '../db/db.js'
import { appConfig } from '../config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection('usuarios')

export const addResponsable = async (req, res) => {
  const { id, nombre, tipo } = req.body
  try {
    const newResponsable = await db.saveDocument('responsables', {
      id,
      nombre,
      tipo,
      activo: true
    })
    res.status(201).json({ status: 'success', data: newResponsable })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
