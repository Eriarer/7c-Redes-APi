import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.inventario)

export const addInventario = async (req, res) => {
  const { idlaboratorio, idunidad, cantidad } = req.body

  try {
    const newInventario = await db.saveDocument(collections.inventario, {
      idlaboratorio,
      idunidad,
      cantidad: cantidad ?? 0
    })

    res.status(201).json({
      status: 'success',
      message: 'Inventario agregado exitosamente',
      data: newInventario
    })
  } catch (error) {
    console.error('Error al agregar inventario:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getInventarios = async (req, res) => {
  try {
    const inventarios = await db.getAllDocuments(collections.inventario)

    if (inventarios.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay inventarios'
      })
    }

    res.status(200).json({
      status: 'success',
      data: inventarios
    })
  } catch (error) {
    console.error('Error al obtener inventarios:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getInventarioById = async (req, res) => {
  const { idlaboratorio, idunidad } = req.params

  try {
    const inventario = await db.getAllDocuments(collections.inventario)

    if (inventario.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay inventarios'
      })
    }

    const foundInventario = inventario.find(
      (inv) => inv.idlaboratorio === idlaboratorio && inv.idunidad === idunidad
    )

    if (!foundInventario) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventario no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      data: foundInventario
    })
  } catch (error) {
    console.error('Error al obtener inventario por ID:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const deleteInventario = async (req, res) => {
  const { idlaboratorio, idunidad } = req.params

  try {
    const result = await db.getAllDocuments(collections.inventario)

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay inventarios'
      })
    }

    const deletedInventario = await db.deleteDocument(
      collections.inventario,
      (doc) => doc.idlaboratorio === idlaboratorio && doc.idunidad === idunidad
    )

    if (!deletedInventario) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventario no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Inventario eliminado'
    })
  } catch (error) {
    console.error('Error al eliminar inventario:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const updateInventario = async (req, res) => {
  const { idlab, iduni } = req.params
  const { idlaboratorio, idunidad, cantidad } = req.body

  try {
    const fieldsToUpdate = {}

    if (idlaboratorio) fieldsToUpdate.idlaboratorio = idlaboratorio
    if (idunidad) fieldsToUpdate.idunidad = idunidad
    if (cantidad) fieldsToUpdate.cantidad = cantidad

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No hay campos para actualizar'
      })
    }

    const inventarios = await db.getAllDocuments(collections.inventario)

    if (inventarios.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay inventarios'
      })
    }

    const updatedInventario = await db.updateDocument(
      collections.inventario,
      (doc) => doc.idlaboratorio === idlab && doc.idunidad === iduni,
      fieldsToUpdate
    )

    if (!updatedInventario) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventario no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Inventario actualizado'
    })
  } catch (error) {
    console.error('Error al actualizar inventario:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}
