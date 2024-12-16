import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.horarioServicio)

export const addHorarioServicio = async (req, res) => {
  const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.body

  try {
    const newHorario = await db.saveDocument(collections.horarioServicio, {
      idlaboratorio,
      hora_inicio,
      hora_cierre,
      dias
    })
    if (!newHorario) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el horario de servicio'
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Horario de servicio agregado exitosamente',
      data: newHorario
    })
  } catch (error) {
    console.error('Error al agregar horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const getHorariosServicio = async (req, res) => {
  try {
    const horarios = await db.getAllDocuments(collections.horarioServicio)

    if (horarios.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay horarios disponibles' })
    }

    res.status(200).json({
      status: 'success',
      data: horarios
    })
  } catch {
    console.error('Error al obtener horarios:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const getHorarioServicioById = async (req, res) => {
  const { id } = req.params
  try {
    const horario = await db.getDocumentById(collections.horarioServicio, id)
    if (!horario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario no encontrado' })
    }
    res.status(200).json({
      status: 'success',
      data: horario
    })
  } catch (error) {
    console.error('Error al obtener horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const deleteHorarioServicio = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await db.deleteDocument(collections.horarioServicio, id)
    if (!deleted) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario no encontrado' })
    }
    res.status(200).json({
      status: 'success',
      message: 'Horario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const updateHorarioServicio = async (req, res) => {
  const { id } = req.params
  const { idlaboratorio, hora_inicio, hora_cierre, dias } = req.body
  const updateData = {}
  if (idlaboratorio) updateData.idlaboratorio = idlaboratorio
  if (hora_inicio) updateData.hora_inicio = hora_inicio
  if (hora_cierre) updateData.hora_cierre = hora_cierre
  if (dias) updateData.dias = dias
  try {
    const updatedHorario = await db.updateDocument(
      collections.horarioServicio,
      id,
      updateData
    )
    if (!updatedHorario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario no encontrado' })
    }
    res.status(200).json({
      status: 'success',
      message: 'Horario actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error al actualizar horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}
