import { Router } from 'express';
import { verifyPayment, addDevice, getDevices, add_device, deleteDevice } from '../controllers/adminController.js';  
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/get-devices', authMiddleware, getDevices);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.post('/add-device', authMiddleware, add_device);
router.delete('/delete-device/:macId', authMiddleware, deleteDevice);

export default router;