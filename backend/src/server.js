import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import connectDB from './config/db.js'
import app from './app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

const PORT = process.env.PORT || 5000

if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.error('Error: MONGO_URI is not defined in .env file')
  process.exit(1)
}

connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})