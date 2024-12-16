import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.hoarioProfesor)

export const addHorarioProfesor = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    hora_inicio,
    hora_cierre,
    dias,
    descripcion = ''
  } = req.body

  try {
    const newHorario = await db.saveDocument(collections.hoarioProfesor, {
      idlaboratorio,
      idusuario,
      hora_inicio,
      hora_cierre,
      dias,
      descripcion
    })

    if (!newHorario) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el horario de profesor'
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Horario de profesor agregado exitosamente',
      data: newHorario
    })
  } catch (error) {
    console.error('Error al agregar horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const getHorariosProfesores = async (req, res) => {
  try {
    const horarios = await db.getAllDocuments(collections.hoarioProfesor)

    if (horarios.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No hay horarios disponibles' })
    }

    res.status(200).json({
      status: 'success',
      data: horarios
    })
  } catch (error) {
    console.error('Error al obtener horarios:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

// Obtener un horario de profesor por ID
export const getHorarioProfesor = async (req, res) => {
  const { id } = req.params

  try {
    const horario = await db.getDocument(collections.hoarioProfesor, id)

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
    console.error('Error al obtener horario por ID:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

// Actualizar un horario de profesor
export const updateHorarioProfesor = async (req, res) => {
  const { id } = req.params
  const {
    idlaboratorio,
    idusuario,
    hora_inicio,
    hora_cierre,
    dias,
    descripcion,
    activo
  } = req.body

  const updateData = {}
  if (idlaboratorio) updateData.idlaboratorio = idlaboratorio
  if (idusuario) updateData.idusuario = idusuario
  if (hora_inicio) updateData.hora_inicio = hora_inicio
  if (hora_cierre) updateData.hora_cierre = hora_cierre
  if (dias) updateData.dias = dias
  if (descripcion) updateData.descripcion = descripcion
  if (typeof activo === 'boolean') updateData.activo = activo

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No se proporcionaron datos para actualizar'
    })
  }

  try {
    const updatedHorario = await db.updateDocument(
      collections.hoarioProfesor,
      id,
      updateData
    )

    if (!updatedHorario) {
      return res.status(404).json({
        status: 'error',
        message: 'Horario no encontrado o no se pudo actualizar'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Horario actualizado exitosamente',
      data: updatedHorario
    })
  } catch (error) {
    console.error('Error al actualizar horario:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Error interno del servidor' })
  }
}

export const deleteHorarioProfesor = async (req, res) => {
  const { id } = req.params

  try {
    const deleted = await db.deleteDocument(collections.hoarioProfesor, id)
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Horario no encontrado o no se pudo eliminar'
      })
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
