import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'
import User from '../models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../../.env') })

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables')
    }
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

const seedSuperAdmin = async () => {
  try {
    await connectDB()

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'SUPER_ADMIN' })
    if (existingAdmin) {
      console.log('Super Admin already exists:')
      console.log(`Email: ${existingAdmin.email}`)
      console.log('To create a new admin, delete the existing one first.')
      process.exit(0)
    }

    // Get credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ahrf-saas.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Ahrf@2024!Secure'
    const adminName = process.env.ADMIN_NAME || 'Super Administrator'

    // Create super admin
    const superAdmin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      limits: {
        keywordLimit: 999999,
        keywordUsed: 0
      }
    })

    console.log('\n✅ Super Admin created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', superAdmin.email)
    console.log('🔑 Password:', adminPassword)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  IMPORTANT: Change the password immediately after first login!')
    console.log('⚠️  For production, set ADMIN_EMAIL and ADMIN_PASSWORD in .env file\n')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding super admin:', error.message)
    process.exit(1)
  }
}

seedSuperAdmin()

