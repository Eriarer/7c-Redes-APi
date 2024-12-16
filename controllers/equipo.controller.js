import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.equipo)

export const addEquipo = async (req, res) => {
  const { nombre, descripcion, disponible } = req.body
  try {
    let values = { nombre }
    values.descripcion = descripcion || ''
    values.disponible = disponible || true
    const newEquipo = await db.saveDocument('equipos', values)
    res
      .status(201)
      .json({ status: 'success', message: 'Equipo agregado', data: newEquipo })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getEquipos = async (req, res) => {
  try {
    const equipos = await db.queryDocuments('equipos')
    if (equipos.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay equipos' })
    }
    res.status(200).json({ status: 'success', data: equipos })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getEquipoById = async (req, res) => {
  const { id } = req.params
  try {
    const equipo = await db.getDocument('equipos', id)
    res.status(200).json(equipo ? [equipo] : [])
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteEquipo = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.updateDocument('equipos', id, { activo: false })
    res.status(200).json({
      status: 'success',
      message: 'Equipo eliminado exitosamente',
      data: result
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const updateEquipo = async (req, res) => {
  const { idEquipo, nombre, descripcion, activo } = req.body
  const updateData = {}
  if (nombre) updateData.nombre = nombre
  if (descripcion) updateData.descripcion = descripcion
  if (activo) updateData.activo = activo

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Datos insuficientes' })
  }

  if (!idEquipo) return res.status(400).json({ error: 'IdEquipo es requerido' })

  try {
    const updatedEquipo = await db.updateDocument(
      'equipos',
      idEquipo,
      updateData
    )
    if (!updatedEquipo) {
      throw new Error('Hubo un error al actualizar el equipo')
    }
    res.status(200).json({
      status: 'success',
      message: 'Equipo actualizado',
      data: updatedEquipo
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
