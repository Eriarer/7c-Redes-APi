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

          // Case-insensitive, wildcard-like search
          if (filterCondition.like !== undefined) {
            if (typeof value !== 'string') return false

            // Convert both to lowercase for case-insensitive search
            const searchTerm = filterCondition.like.toLowerCase()
            const docValue = value.toLowerCase()

            return docValue.includes(searchTerm)
          }

          return true
        })
      )
    } catch (error) {
      return []
    }
  }

  async compareValues(a, b, operator) {
    // Helper function to normalize numeric strings with leading zeros
    const normalizeValue = (val) => {
      if (typeof val === 'string' && /^0+\d+$/.test(val)) {
        return val // Keep leading zeros for strict ASCII comparison
      }
      return val
    }

    // Normalize the input values
    a = normalizeValue(a)
    b = normalizeValue(b)

    // Helper function to check if a value is a valid date string
    const isDateString = (val) => {
      if (typeof val !== 'string') return false
      const date = new Date(val)
      return !isNaN(date.getTime())
    }

    // Helper function to check if a value can be treated as a number
    const isNumeric = (val) => {
      return !isNaN(parseFloat(val)) && isFinite(val)
    }

    // 1. Compare as dates if both values are valid date strings
    if (isDateString(a) && isDateString(b)) {
      const dateA = new Date(a)
      const dateB = new Date(b)
      switch (operator) {
        case '<':
          return dateA < dateB
        case '<=':
          return dateA <= dateB
        case '>':
          return dateA > dateB
        case '>=':
          return dateA >= dateB
      }
    }

    // 2. Compare as numbers if both values are numeric
    if (isNumeric(a) && isNumeric(b)) {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      switch (operator) {
        case '<':
          return numA < numB
        case '<=':
          return numA <= numB
        case '>':
          return numA > numB
        case '>=':
          return numA >= numB
      }
    }

    // 3. Compare as strings using ASCII order
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
        throw new Error(`Invalid operator: ${operator}`)
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
