import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import superAdminRoutes from './routes/superAdmin.js'
import resellerRoutes from './routes/reseller.js'
import cookieRoutes from './routes/cookies.js'
import brandingRoutes from './routes/branding.js'
import settingsRoutes from './routes/settings.js'
import proxyRoutes from './routes/proxy.js'
import { notFound, errorHandler } from './middleware/error.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/superadmin', superAdminRoutes)
app.use('/api/reseller', resellerRoutes)
app.use('/api/cookies', cookieRoutes)
app.use('/api/branding', brandingRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/proxy', proxyRoutes)

app.use(notFound)
app.use(errorHandler)

export default app

