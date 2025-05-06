import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/get-details', sadminMiddleware, getDetails);
router.post('/generate-coupons', sadminMiddleware, generateCoupons);

export default router