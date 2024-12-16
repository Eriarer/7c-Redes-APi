// Importar la base de datos JSON
import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

// Crear instancia de la base de datos
const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.lab_res)

// **Agregar relación laboratorio-responsable**
export const addLabRes = async (req, res) => {
  const { idlaboratorio, idresponsable } = req.body

  try {
    const newRelation = await db.saveDocument(collections.lab_res, {
      idlaboratorio,
      idresponsable
    })

    res.status(201).json({
      status: 'success',
      message: 'Relación laboratorio-responsable agregada',
      data: newRelation
    })
  } catch (error) {
    console.error('Error al agregar relación laboratorio-responsable:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

// **Eliminar relación laboratorio-responsable**
export const deleteLabRes = async (req, res) => {
  const { idlaboratorio, idresponsable } = req.params

  try {
    const documents = await db.getAllDocuments(collections.lab_res)

    if (documents.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay relaciones laboratorio-responsable'
      })
    }

    const deletedRelation = documents.find(
      (relation) =>
        relation.idlaboratorio === idlaboratorio &&
        relation.idresponsable === idresponsable
    )

    if (!deletedRelation) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró la relación laboratorio-responsable'
      })
    }

    const deleted = await db.deleteDocument(
      collections.lab_res,
      deletedRelation._id
    )

    if (!deleted) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo eliminar la relación laboratorio-responsable'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Relación laboratorio-responsable eliminada'
    })
  } catch (error) {
    console.error('Error al eliminar relación laboratorio-responsable:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}
