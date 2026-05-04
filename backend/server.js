const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const logger = require('./lib/logger')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
})
app.use(limiter)

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later'
})

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip })
  next()
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Bridgeware', timestamp: new Date() })
})

const ticketsRouter = require('./routes/tickets')
const companiesRouter = require('./routes/companies')
const contactsRouter = require('./routes/contacts')
const opportunitiesRouter = require('./routes/opportunities')
const quotesRouter = require('./routes/quotes')
const invoicesRouter = require('./routes/invoices')
const projectsRouter = require('./routes/projects')
const tasksRouter = require('./routes/tasks')
const usersRouter = require('./routes/users')
const departmentsRouter = require('./routes/departments')
const teamsRouter = require('./routes/teams')

app.use('/api/tickets', ticketsRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/opportunities', opportunitiesRouter)
app.use('/api/quotes', quotesRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)
app.use('/api/departments', departmentsRouter)
app.use('/api/teams', teamsRouter)

app.use((err, req, res, next) => {
  logger.error({ error: err.message, stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  logger.info(`Bridgeware backend running on port ${PORT}`)
})