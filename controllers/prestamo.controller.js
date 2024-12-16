import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.prestamo)

export const addPrestamo = async (req, res) => {
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horainicio,
    duracion,
    observaciones,
    materiales
  } = req.body

  try {
    const newPrestamo = await db.saveDocument(collections.prestamo, {
      idlaboratorio,
      idusuario,
      fecha,
      horainicio,
      duracion,
      observaciones: observaciones ?? ''
    })
    if (!newPrestamo) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo agregar el prestamo'
      })
    }
    const prestamoId = newPrestamo._id
    const errors = []
    const materials = []

    if (materiales && materiales.length > 0) {
      for (const material of materiales) {
        const materialData = {
          ...material,
          idprestamo: prestamoId,
          idlaboratorio: idlaboratorio
        }
        const newMaterial = await db.saveDocument(
          collections.material,
          materialData
        )
        if (!newMaterial) {
          errors.push(material)
        } else {
          materials.push(newMaterial)
        }
      }
    }

    if (errors.length > 0) {
      return res.status(207).json({
        status: 'success',
        message: 'Prestamo agregado con errores',
        data: newPrestamo,
        materials: materials,
        errors: errors
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Prestamo agregado exitosamente',
      data: newPrestamo,
      materials: materials
    })
  } catch (error) {
    console.error('Error al agregar prestamo:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getPrestamos = async (req, res) => {
  try {
    const prestamos = await db.getAllDocuments(collections.prestamo)

    if (prestamos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay prestamos'
      })
    }

    res.status(200).json({
      status: 'success',
      data: prestamos
    })
  } catch (error) {
    console.error('Error al obtener prestamos:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getPrestamoById = async (req, res) => {
  const { id } = req.params

  try {
    const prestamo = await db.getDocument(collections.prestamo, id)

    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'Prestamo no encontrado'
      })
    }

    res.status(200).json({
      status: 'success',
      data: prestamo
    })
  } catch (error) {
    console.error('Error al obtener prestamo por ID:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const getPrestamoByIdUsuario = async (req, res) => {
  const { idusuario } = req.params

  try {
    const prestamos = await db.getAllDocuments(collections.prestamo)

    if (prestamos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay prestamos'
      })
    }

    const userPrestamos = prestamos.filter(
      (prestamo) => prestamo.idusuario === idusuario
    )

    if (userPrestamos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay prestamos para el usuario'
      })
    }

    res.status(200).json({
      status: 'success',
      data: userPrestamos
    })
  } catch (error) {
    console.error('Error al obtener prestamos por ID de usuario:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const deletePrestamo = async (req, res) => {
  const { id, estado } = req.params
  const estados = ['C', 'D', 'F']
  if (!estados.includes(estado)) {
    return res.status(400).json({
      status: 'error',
      message: 'Estado inválido'
    })
  }
  try {
    const prestamo = await db.updateDocument(collections.prestamo, id, {
      estado
    })
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'Prestamo no encontrado'
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Prestamo eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar prestamo:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}

export const updatePrestamo = async (req, res) => {
  const { id } = req.params
  const {
    idlaboratorio,
    idusuario,
    fecha,
    horainicio,
    duracion,
    observaciones,
    estado
  } = req.body
  const updateData = {}
  if (idlaboratorio) updateData.idlaboratorio = idlaboratorio
  if (idusuario) updateData.idusuario = idusuario
  if (fecha) updateData.fecha = fecha
  if (horainicio) updateData.horainicio = horainicio
  if (duracion) updateData.duracion = duracion
  if (observaciones) updateData.observaciones = observaciones
  if (estado) updateData.estado = estado
  try {
    const updatedPrestamo = await db.updateDocument(
      collections.prestamo,
      id,
      updateData
    )
    if (!updatedPrestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'Prestamo no encontrado'
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Prestamo actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error al actualizar prestamo:', error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ha salido mal, inténtalo más tarde'
    })
  }
}
