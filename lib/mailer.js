import nodemailer from 'nodemailer'
import { appConfig } from '../config/config.js'
import { text } from 'express'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: appConfig.email,
    pass: appConfig.emailPass
  }
})

const mailOptions = {
  from: appConfig.email,
  to: '',
  subject: 'Confirmación de prestamo',
  html: ''
}

export const senConfirmationEmail = (to, prestamoInfo, nombre) => {
  mailOptions.to = to
  const keys = Object.keys(prestamoInfo)
  mailOptions.html = `
    <p>Hola <strong>${nombre}</strong>,</p>
    <p>Tu prestamo se ha mandado con éxito, solo falta que lo aprueben. Detalles:</p>
    <ul>
  `
  keys.forEach((key) => {
    mailOptions.html += `<li><strong>${key}:</strong> ${prestamoInfo[key]}</li>`
  })
  mailOptions.html += `
    </ul>
    <p>Gracias,</p>
    <p>El equipo de prestamos</p>
  `
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email error', error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
