import express from 'express'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  useTool,
  getMyUsage
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/role.js'

const router = express.Router()

router.use(protect)

router.post('/use-tool', useTool)
router.get('/my-usage', getMyUsage)
router.get('/', authorize('SUPER_ADMIN', 'RESELLER'), getUsers)
router.get('/:id', authorize('SUPER_ADMIN', 'RESELLER'), getUser)
router.post('/', authorize('SUPER_ADMIN', 'RESELLER'), createUser)
router.put('/:id', authorize('SUPER_ADMIN', 'RESELLER'), updateUser)
router.delete('/:id', authorize('SUPER_ADMIN'), deleteUser)

export default router

