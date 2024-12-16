import argon2 from 'argon2'
import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.usuario)

export const addUsuario = async (req, res) => {
  const {
    idusuario,
    nombre,
    apellido,
    carrera,
    correo,
    password,
    tipo,
    activo
  } = req.body

  const hashedPassword = await argon2.hash(password)

  try {
    let values = { idusuario, nombre, correo, password: hashedPassword }

    values.apellido = apellido ? apellido : ''
    values.carrera = carrera ? carrera : ''
    values.tipo = tipo ? tipo : 'E'
    values.activo = activo ? activo : true

    const newUser = await db.saveDocument(collections.usuario, values)

    res.status(201).json({ status: 'success', data: newUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.deleteDocument(collections.usuario, id)
    if (!result) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res
      .status(200)
      .json({ status: 'success', data: 'Usuario eliminado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  const { id } = req.params
  const { newId, nombre, apellido, carrera, correo, tipo, activo } = req.body

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
    const updatedUser = await db.updateDocument(
      collections.usuario,
      id,
      updateData
    )
    if (!updatedUser) {
      throw new Error('Hubo un error al actualizar el usuario')
    }
    res.status(200).json({ status: 'success', message: 'Usuario actualizado' })
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const updatePassword = async (req, res) => {
  const { id } = req.params
  const { password, newPassword } = req.body

  try {
    const user = await db.getDocument(collections.usuario, id)
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }
    if (!(await argon2.verify(user.password, password))) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Algo ah salido mal, intentalo más tarde' })
  }

  const hashedPassword = await argon2.hash(newPassword)

  try {
    const updatedUser = await db.updateDocument(collections.usuario, id, {
      password: hashedPassword
    })
    if (!updatedUser) {
      throw new Error('Hubo un error al actualizar la contraseña')
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Contraseña actualizada' })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const users = await db.getAllDocuments(collections.usuario)
    res.status(200).json({ status: 'success', data: users })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await db.getDocument(collections.usuario, id)
    res.status(200).json(user ? [user] : [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
