import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.horario_profesor)

export const addHorarioProfesor = async (req, res) => {
  const { idusuario, hora_inicio, hora_cierre, dias, descripcion } = req.body
  try {
    let values = { idusuario, hora_inicio, hora_cierre, dias }
    if (descripcion) values.descripcion = descripcion
    const newHorario = await db.saveDocument('horario_profesor', values)
    res.status(201).json({
      status: 'success',
      message: 'Horario de profesor agregado',
      data: newHorario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getHorariosProfesores = async (req, res) => {
  try {
    const horarios = await db.queryDocuments('horario_profesor')
    if (horarios.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay horarios de profesores' })
    }
    res.status(200).json({ status: 'success', data: horarios })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getHorarioProfesor = async (req, res) => {
  const { id } = req.params
  try {
    const horario = await db.getDocument('horario_profesor', id)
    if (!horario) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Horario de profesor no encontrado' })
    }
    res.status(200).json({ status: 'success', data: horario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const updateHorarioProfesor = async (req, res) => {
  const { id } = req.params
  const { idusuario, hora_inicio, hora_cierre, dias, descripcion } = req.body
  const updateData = {}
  if (idusuario) updateData.idusuario = idusuario
  if (hora_inicio) updateData.hora_inicio = hora_inicio
  if (hora_cierre) updateData.hora_cierre = hora_cierre
  if (dias) updateData.dias = dias
  if (descripcion) updateData.descripcion = descripcion

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Datos insuficientes' })
  }

  try {
    const updatedHorario = await db.updateDocument(
      'horario_profesor',
      id,
      updateData
    )
    if (!updatedHorario) {
      throw new Error('Hubo un error al actualizar el horario del profesor')
    }
    res.status(200).json({
      status: 'success',
      message: 'Horario de profesor actualizado',
      data: updatedHorario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const deleteHorarioProfesor = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.deleteDocument('horario_profesor', id)
    res.status(200).json({
      status: 'success',
      message: 'Horario de profesor eliminado',
      data: result
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
