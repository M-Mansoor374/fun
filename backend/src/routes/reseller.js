import express from 'express'
import { createResellerUser, getResellerUsers, updateResellerUser, deleteResellerUser } from '../controllers/resellerController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/role.js'

const router = express.Router()

router.use(protect)
router.use(authorize('RESELLER'))

router.post('/users', createResellerUser)
router.get('/users', getResellerUsers)
router.put('/users/:id', updateResellerUser)
router.delete('/users/:id', deleteResellerUser)

export default router

