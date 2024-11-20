import express from 'express'
import morgan from 'morgan'
import usuarioRoutes from './routes/usuario.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/glem/usuario', usuarioRoutes)

export default app
