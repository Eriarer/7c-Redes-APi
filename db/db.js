import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class JsonDatabase {
  constructor(dbPath = './DB') {
    this.dbPath = path.resolve(dbPath)
  }

  async init() {
    await fs.mkdir(this.dbPath, { recursive: true })
  }

  async createCollection(name) {
    const collectionPath = path.join(this.dbPath, name)
    await fs.mkdir(collectionPath, { recursive: true })
  }

  async saveDocument(collection, data, id = uuidv4()) {
    await this.createCollection(collection)
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)

    const documentData = {
      _id: id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await fs.writeFile(documentPath, JSON.stringify(documentData, null, 2))
    return documentData
  }

  async getDocument(collection, id) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)
    try {
      const rawData = await fs.readFile(documentPath, 'utf-8')
      return JSON.parse(rawData)
    } catch (error) {
      return null
    }
  }

  async updateDocument(collection, id, updateData) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)

    try {
      const existingDoc = await this.getDocument(collection, id)
      if (!existingDoc) return null

      const updatedDoc = {
        ...existingDoc,
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      await fs.writeFile(documentPath, JSON.stringify(updatedDoc, null, 2))
      return updatedDoc
    } catch (error) {
      return null
    }
  }

  async deleteDocument(collection, id) {
    const documentPath = path.join(this.dbPath, collection, `${id}.json`)

    try {
      await fs.unlink(documentPath)
      return true
    } catch (error) {
      return false
    }
  }
}

export default JsonDatabase
