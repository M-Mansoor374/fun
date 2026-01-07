import express from 'express'
import {
  createSuperAdminUser,
  getSuperAdminUsers,
  updateSuperAdminUser,
  deleteSuperAdminUser
} from '../controllers/superAdminController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/role.js'

const router = express.Router()

router.use(protect)
router.use(authorize('SUPER_ADMIN'))

router.post('/users', createSuperAdminUser)
router.get('/users', getSuperAdminUsers)
router.put('/users/:id', updateSuperAdminUser)
router.delete('/users/:id', deleteSuperAdminUser)

export default router

