import cors from 'cors'
import express from 'express'
import { initDbSchema } from './db/database'
import { deviceTokenMiddleware } from './middleware/deviceToken'
import contentRoutes from './routes/content'
import progressRoutes from './routes/progress'
import skillsRoutes from './routes/skills'

const app = express()
const port = 3001

initDbSchema()

app.use(cors())
app.use(deviceTokenMiddleware)
app.use('/api/content', contentRoutes)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'English Speak server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', progressRoutes)
app.use('/api', skillsRoutes)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

