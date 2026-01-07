import express from 'express'
import { proxyRequest } from '../controllers/proxyController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)
router.get('*', proxyRequest)

export default router

