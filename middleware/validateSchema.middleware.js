export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.errors.map((error) => error.message) })
  }
}

export const validateSchemaWithParams = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params)
    next()
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.errors.map((error) => error.message) })
  }
}

export const validateSchemaWithQuery = (schema) => (req, res, next) => {
  try {
    schema.parse(req.query)
    next()
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.errors.map((error) => error.message) })
  }
}
