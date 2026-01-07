import express from 'express'
import { getBranding, updateBranding } from '../controllers/brandingController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/role.js'

const router = express.Router()

router.use(protect)

router.get('/', getBranding)
router.put('/', authorize('SUPER_ADMIN'), updateBranding)

export default router

