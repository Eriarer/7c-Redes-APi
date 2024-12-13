import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.usuario)

export const addUsuario = async (req, res) => {
  const { idusuario, nombre, apellido, carrera, correo, tipo, activo } =
    req.body

  try {
    let values = { idusuario, nombre, correo }

    values.apellido = apellido ? apellido : ""
    values.carrera = carrera ? carrera : ""
    values.tipo = tipo ? tipo : 'E'
    values.activo = activo ? tactivo : true

    console.log(values)

    const newUser = await db.saveDocument('usuarios', values)

    res.status(201).json({ status: 'success', data: newUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.updateDocument('usuarios', id, { activo: 0 })
    if (!result) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.status(200).json({ status: 'success', data: 'Usuario eliminado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  const { id, newId, nombre, apellido, carrera, correo, tipo, activo } =
    req.body

  const updateData = {}
  if (newId) updateData.idusuario = newId
  if (nombre) updateData.nombre = nombre
  if (apellido) updateData.apellido = apellido
  if (carrera) updateData.carrera = carrera
  if (correo) updateData.correo = correo
  if (tipo) updateData.tipo = tipo
  if (activo) updateData.activo = activo

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Datos insuficientes' })
  }

  if (!id) return res.status(400).json({ error: 'Id es requerido' })

  try {
    const updatedUser = await db.updateDocument('usuarios', id, updateData)
    if (!updatedUser) {
      throw new Error('Hubo un error al actualizar el usuario')
    }
    res.status(200).json({ status: 'success', message: 'Usuario actualizado' })
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const users = await db.queryDocuments('usuarios')
    res.status(200).json({ status: 'success', data: users })
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
