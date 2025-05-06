import { Router } from 'express'
// import sadminMiddlewareMiddleware from '../middleware/authMiddleware.js'
import { generateCoupons, getDetails } from '../controllers/SAdminController.js'

const router = Router()

router.get('/get-details', getDetails);
router.post('/generate-coupons', generateCoupons);

export default router