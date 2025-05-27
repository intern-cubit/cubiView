import { Router } from 'express'
// import sadminMiddlewareMiddleware from '../middleware/authMiddleware.js'
import { checkActivation, generateCoupons, getDetails } from '../controllers/SAdminController.js'

const router = Router()

router.get('/get-details', getDetails);
router.post('/generate-coupons', generateCoupons);
router.post('/check-activation', checkActivation);

export default router