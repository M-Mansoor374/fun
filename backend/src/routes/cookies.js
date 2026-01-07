import express from 'express'
import {
  createCookie,
  getCookies,
  updateCookie,
  deleteCookie,
  assignCookie,
  getMyCookie
} from '../controllers/cookieController.js'
import { protect } from '../middleware/auth.js'
import { authorize } from '../middleware/role.js'

const router = express.Router()

router.use(protect)

router.get('/my-cookie', getMyCookie)
router.post('/', authorize('SUPER_ADMIN'), createCookie)
router.get('/', authorize('SUPER_ADMIN'), getCookies)
router.put('/:id', authorize('SUPER_ADMIN'), updateCookie)
router.put('/:id/assign', authorize('SUPER_ADMIN'), assignCookie)
router.delete('/:id', authorize('SUPER_ADMIN'), deleteCookie)

export default router

