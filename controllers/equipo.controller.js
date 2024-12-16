import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.equipo)

export const addEquipo = async (req, res) => {
  const { nombre, descripcion, disponible } = req.body

  try {
    const newEquipo = await db.saveDocument(collections.equipo, {
      nombre,
      descripcion: descripcion ?? '',
      disponible: disponible ?? true
    })

    if (!newEquipo) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el equipo'
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Equipo agregado',
      data: newEquipo
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal, intentalo más tarde'
    })
  }
}

export const getEquipos = async (req, res) => {
  try {
    const equipos = await db.getAllDocuments(collections.equipo)

    if (equipos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay equipos'
      })
    }

    res.status(200).json({
      status: 'success',
      data: equipos.filter((equipo) => equipo.activo)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal, intentalo más tarde'
    })
  }
}

export const getEquipoById = async (req, res) => {
  const { id } = req.params

  try {
    const equipo = await db.getDocument(collections.equipo, id)

    if (!equipo || !equipo.activo) {
      return res.status(404).json({
        status: 'error',
        message: 'Equipo no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      data: equipo
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal, intentalo más tarde'
    })
  }
}

export const deleteEquipo = async (req, res) => {
  const { id } = req.params

  try {
    const updatedEquipo = await db.updateDocument(collections.equipo, id, {
      activo: false
    })

    if (!updatedEquipo) {
      return res.status(404).json({
        status: 'error',
        message: 'Equipo no encontrado o ya estaba eliminado'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Equipo eliminado exitosamente'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal, intentalo más tarde'
    })
  }
}

export const updateEquipo = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, disponible } = req.body

  const updateData = {}

  if (nombre) updateData.nombre = nombre
  if (descripcion) updateData.descripcion = descripcion
  if (disponible) updateData.disponible = disponible

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No se proporcionaron datos para actualizar'
    })
  }

  try {
    const updatedEquipo = await db.updateDocument(
      collections.equipo,
      id,
      updateData
    )

    if (!updatedEquipo) {
      return res.status(404).json({
        status: 'error',
        message: 'Equipo no encontrado o no se pudo actualizar'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Equipo actualizado exitosamente',
      data: updatedEquipo
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal, intentalo más tarde'
    })
  }
}
