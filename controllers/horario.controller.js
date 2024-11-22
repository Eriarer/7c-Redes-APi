import JsonDatabase from '../db/db.js'
import { appConfig } from '../config/config.js'
import { collections } from '../config/colletion.names.config.js'

const db = new JsonDatabase(appConfig.dbDirectory)
await db.init()
await db.createCollection(collections.horario)

export const addHorario = async (req, res) => {
  const { horariocierre, horarioinicio, horarioid, labid, dia, descripcion } =
    req.body
  try {
    const horario = await db.insert(collections.horario, {
      horariocierre,
      horarioinicio,
      horarioid,
      labid,
      dia,
      descripcion
    })
    res.status(201).json({ status: 'success', data: newHorario })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getHorarios = async (req, res) => {
  try {
    const horarios = await db.queryDocuments(collections.horario)
    res.status(200).json({ status: 'success', data: horarios })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteHorario = async (req, res) => {
  const { horarioid } = req.params
  try {
    const horario = await db.delete(collections.horario, { horarioid })
    res.status(200).json({ status: 'success', data: horario })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
