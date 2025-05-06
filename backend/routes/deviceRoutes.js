import { Router } from'express';
import { getDeviceDetails, verifyDevice } from '../controllers/deviceController.js';

const router = Router();

router.post('/verify-device', verifyDevice);
router.get('/:macId', getDeviceDetails); // Assuming you want to fetch device details by MAC ID

export default router;