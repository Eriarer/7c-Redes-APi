import JsonDatabase from '../db/db.js'
import { appConfig } from '../config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection('usuarios')

export const addUsuario = async (req, res) => {
  const { idusuario, tipo, nombre } = req.body
  try {
    const newUser = await db.saveDocument('usuarios', {
      idusuario,
      tipo,
      nombre,
      activo: true
    })
    res.status(201).json({ status: 'success', data: newUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuarios = async (req, res) => {
  const { ids } = req.body
  try {
    const deletedUsers = await Promise.all(
      ids.map((id) => db.deleteDocument('usuarios', id))
    )
    res.status(200).json(deletedUsers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.deleteDocument('usuarios', id)
    res.status(200).json({ deleted: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  const { id } = req.params
  const { newId, tipo, nombre } = req.query

  try {
    // Prepare update data
    const updateData = {}
    if (newId) updateData.idusuario = newId
    if (tipo) updateData.tipo = tipo
    if (nombre) updateData.nombre = nombre

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Request is empty' })
    }

    const updatedUser = await db.updateDocument('usuarios', id, updateData)
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const users = await db.queryDocuments('usuarios')
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsuariosFiltered = async (req, res) => {
  const { idinf, idsup, nombre, tipo } = req.body

  try {
    // Construct the filter object dynamically
    const filter = {}

    if (idinf) {
      filter.idusuario = { egt: idinf }
    }

    if (idsup) {
      filter.idusuario = {
        ...filter.idusuario,
        elt: idsup
      }
    }

    if (nombre) {
      filter.nombre = { like: nombre }
    }

    if (tipo) {
      filter.tipo = { in: tipo.split(',').map((t) => t.trim()) }
    }
    console.log(filter)

    // Assuming this is a method of a class that manages documents
    const filteredUsers = await db.queryDocuments('usuarios', filter)

    res.status(200).json(filteredUsers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await db.getDocument('usuarios', id)
    res.status(200).json(user ? [user] : [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
