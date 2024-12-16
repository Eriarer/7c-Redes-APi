import argon2 from 'argon2'
import JsonDatabase from '../db/db.js'
import { generateToken } from '../middleware/jwt.middleware.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.usuario)

export const login = async (req, res) => {
  const { correo, password } = req.body
  try {
    const users = await db.getAllDocuments('usuarios', { correo })
    if (users.length === 0) {
      return res.status(400).json({ error: 'Correo o contraseña incorrecta' })
    }
    const user = users[0]
    if (!user.activo) {
      return res.status(400).json({
        error: 'No puedes ingresar con esta cuenta, esta desactivada.'
      })
    }
    if (!(await argon2.verify(user.password, password))) {
      return res.status(400).json({ error: 'Correo o contraseña incorrecta' })
    }
    const token = generateToken(user)
    const data = {
      idusuario: user.idusuario,
      nombre: user.nombre,
      apellido: user.apellido,
      carrera: user.carrera,
      correo: user.correo,
      tipo: user.tipo
    }
    res.status(200).json({ status: 'success', token, data: data })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Algo ah salido mal, intentalo más tarde'
    })
  }
}

export const readToken = (req, res) => {
  const { idusuario, nombre, apellido, correo, tipo } = req.user
  if (!idusuario || !nombre || !correo || !tipo) {
    return res.status(403).json({
      status: 'error',
      message: 'Authenticación fallida'
    })
  }

  res.status(200).json({
    status: 'success',
    data: { idusuario, nombre, apellido, correo, tipo }
  })
}

export const regenerateToken = (req, res) => {
  const { idusuario, nombre, apellido, correo, tipo } = req.user
  if (!idusuario || !nombre || !correo || !tipo) {
    return res.status(403).json({
      status: 'error',
      message: 'Authenticación fallida'
    })
  }
  const data = { idusuario, nombre, apellido, correo, tipo }
  const token = generateToken(data)
  res.status(200).json({ status: 'success', token, data: data })
}
