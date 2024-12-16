import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.material)

export const addMaterial = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad, cantidad } = req.body
  const data = { idprestamo, idlaboratorio, idunidad, cantidad }

  try {
    const material = await db.saveDocument(collections.material, data)
    res.status(201).json({
      status: 'success',
      message: 'Material agregado',
      data: material
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getMateriales = async (req, res) => {
  try {
    const materiales = await db.getAllDocuments(collections.material)
    if (materiales.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay materiales'
      })
    }
    res.status(200).json({
      status: 'success',
      data: materiales
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getMaterialById = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad } = req.params
  try {
    const materiales = await db.getAllDocuments(collections.material)
    if (materiales.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay materiales'
      })
    }
    const material = materiales.find(
      (material) =>
        material.idprestamo === idprestamo &&
        material.idlaboratorio === idlaboratorio &&
        material.idunidad === idunidad
    )
    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      data
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const deleteMaterial = async (req, res) => {
  const { idprestamo, idlaboratorio, idunidad } = req.params
  try {
    const docs = await db.getAllDocuments(collections.material)
    if (docs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay materiales'
      })
    }
    const deletedMaterial = docs.find(
      (material) =>
        material.idprestamo === idprestamo &&
        material.idlaboratorio === idlaboratorio &&
        material.idunidad === idunidad
    )
    if (!deletedMaterial) {
      return res.status(404).json({
        status: 'error',
        message: 'Material no encontrado'
      })
    }
    const deleted = await db.deleteDocument(
      collections.material,
      deletedMaterial._id
    )
    if (!deleted) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo eliminar el material'
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Material eliminado'
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}
