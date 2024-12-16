import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class JsonDatabase {
  constructor(dbPath = './DB') {
    this.dbPath = path.resolve(dbPath)
    this.collections = new Set()
  }

  async init() {
    await fs.mkdir(this.dbPath, { recursive: true })
  }

  async createCollection(name) {
    const collectionPath = path.join(this.dbPath, name)

    if (!this.collections.has(name)) {
      await fs.mkdir(collectionPath, { recursive: true })
      this.collections.add(name)
    }
  }

  async _writeJsonFile(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData)
  }

  async saveDocument(collection, data, id = uuidv4()) {
    await this.createCollection(collection)

    const documentPath = path.join(this.dbPath, collection, `${id}.json`)
    const now = new Date().toISOString()

    const documentData = {
      _id: id,
      ...data,
      createdAt: now,
      updatedAt: now
    }

    await this._writeJsonFile(documentPath, documentData)
    return documentData
  }

  async getDocument(collection, id) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)
    try {
      const rawData = await fs.readFile(documentPath, 'utf-8')
      return JSON.parse(rawData)
    } catch (error) {
      if (error.code === 'ENOENT') return null
      throw error
    }
  }

  async updateDocument(collection, id, updateData) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)

    const existingDoc = await this.getDocument(collection, id)
    if (!existingDoc) return null

    const updatedDoc = {
      ...existingDoc,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    await this._writeJsonFile(documentPath, updatedDoc)
    return updatedDoc
  }

  async deleteDocument(collection, id) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)
    try {
      await fs.unlink(documentPath)
      return true
    } catch (error) {
      // Retornar false si no existe el archivo
      if (error.code === 'ENOENT') return false
      throw error
    }
  }
}

export default JsonDatabase
