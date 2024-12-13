import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import usuarioRoutes from './routes/usuario.routes.js'
import respobnsableRoutes from './routes/responsalbe.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors())

app.use('/usuario', usuarioRoutes)
app.use('/responsable', respobnsableRoutes)

export default app
