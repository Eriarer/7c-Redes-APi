import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.laboratorio)

export const addLaboratorio = async (req, res) => {
  const {
    plantel,
    num_ed,
    aula,
    departamento,
    cupo,
    latitude,
    longitude,
    descripcion
  } = req.body

  try {
    const newLaboratorio = await db.saveDocument(collections.laboratorio, {
      plantel,
      num_ed,
      aula,
      departamento,
      cupo,
      latitude,
      longitude,
      descripcion: descripcion ?? '',
      activo: true
    })

    res.status(201).json({
      status: 'success',
      message: 'Laboratorio agregado',
      data: newLaboratorio
    })
  } catch (error) {
    console.error('Error al agregar laboratorio:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getLaboratorios = async (req, res) => {
  try {
    const laboratorios = await db.findAll(collections.laboratorio)

    if (laboratorios.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay laboratorios'
      })
    }

    res.status(200).json({
      status: 'success',
      data: laboratorios
    })
  } catch (error) {
    console.error('Error al obtener laboratorios:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getLaboratorioById = async (req, res) => {
  const { id } = req.params

  try {
    const laboratorio = await db.findDocument(collections.laboratorio, id)

    if (!laboratorio) {
      return res.status(404).json({
        status: 'error',
        message: 'Laboratorio no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      data: laboratorio
    })
  } catch (error) {
    console.error('Error al obtener laboratorio por ID:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const deleteLaboratorio = async (req, res) => {
  const { id } = req.params

  try {
    const deletedLaboratorio = await db.updateDocument(
      collections.laboratorio,
      id,
      { activo: false }
    )

    if (!deletedLaboratorio) {
      return res.status(404).json({
        status: 'error',
        message: 'Laboratorio no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Laboratorio eliminado'
    })
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const updateLaboratorio = async (req, res) => {
  const { id } = req.params
  const {
    plantel,
    num_ed,
    aula,
    departamento,
    cupo,
    latitude,
    longitude,
    descripcion,
    activo
  } = req.body
  const updateData = {}

  if (plantel) updateData.plantel = plantel
  if (num_ed) updateData.num_ed = num_ed
  if (aula) updateData.aula = aula
  if (departamento) updateData.departamento = departamento
  if (cupo) updateData.cupo = cupo
  if (latitude) updateData.latitude = latitude
  if (longitude) updateData.longitude = longitude
  if (descripcion) updateData.descripcion = descripcion
  if (activo) updateData.activo = activo

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No hay campos para actualizar'
    })
  }

  try {
    const updatedLaboratorio = await db.updateDocument(
      collections.laboratorio,
      id,
      updateData
    )

    if (!updatedLaboratorio) {
      return res.status(400).json({
        status: 'error',
        message: 'Laboratorio no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Laboratorio actualizado',
      data: updatedLaboratorio
    })
  } catch (error) {
    console.error('Error al actualizar laboratorio:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}
