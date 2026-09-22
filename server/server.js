import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ 后端已启动: http://localhost:${PORT}`)
})