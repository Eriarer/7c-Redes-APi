import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.resposable)

export const getResponsables = async (req, res) => {
  try {
    const responsables = await db.queryDocuments(collections.resposable)
    res.status(200).json({ status: 'success', data: responsables })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addResponsable = async (req, res) => {
  const { id, nombre, tipo } = req.body
  try {
    const newResponsable = await db.saveDocument(collections.resposable, {
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

export const deleteResponsable = async (req, res) => {
  const { id } = req.params
  try {
    const updatedResponsable = await db.updateDocument(
      collections.resposable,
      { id },
      { activo: false }
    )
    res.status(200).json({ status: 'success', data: updatedResponsable })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
