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

  async queryDocuments(collection, filter = {}) {
    const collectionPath = path.join(this.dbPath, collection)

    try {
      const files = await fs.readdir(collectionPath)
      const documents = await Promise.all(
        files.map(async (file) => {
          const rawData = await fs.readFile(
            path.join(collectionPath, file),
            'utf-8'
          )
          return JSON.parse(rawData)
        })
      )

      return documents.filter((doc) =>
        Object.entries(filter).every(([key, filterCondition]) => {
          const value = doc[key]

          // Handle different filter types
          if (typeof filterCondition !== 'object') {
            // Simple direct equality check
            return value === filterCondition
          }

          // Advanced filtering
          if (filterCondition.eq !== undefined) {
            return value === filterCondition.eq
          }

          if (filterCondition.neq !== undefined) {
            return value !== filterCondition.neq
          }

          // Comparison operators that work with dates, numbers, and strings
          if (filterCondition.lt !== undefined) {
            return compareValues(value, filterCondition.lt, '<')
          }

          if (filterCondition.elt !== undefined) {
            return compareValues(value, filterCondition.elt, '<=')
          }

          if (filterCondition.gt !== undefined) {
            return compareValues(value, filterCondition.gt, '>')
          }

          if (filterCondition.egt !== undefined) {
            return compareValues(value, filterCondition.egt, '>=')
          }

          // Range filter
          if (filterCondition.range !== undefined) {
            const [start, end] = filterCondition.range
            return (
              compareValues(value, start, '>=') &&
              compareValues(value, end, '<=')
            )
          }

          // In filter for arrays
          if (filterCondition.in !== undefined) {
            return filterCondition.in.includes(value)
          }

          return true
        })
      )
    } catch (error) {
      return []
    }
  }

  async compareValues(a, b, operator) {
    // Convert to Date if both are date-like strings
    const isDateString = (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime()) && typeof val === 'string'
    }

    if (isDateString(a) && isDateString(b)) {
      a = new Date(a)
      b = new Date(b)
    }

    switch (operator) {
      case '<':
        return a < b
      case '<=':
        return a <= b
      case '>':
        return a > b
      case '>=':
        return a >= b
      default:
        return false
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
