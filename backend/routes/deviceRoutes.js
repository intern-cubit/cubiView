import { Router } from'express';
import { getDeviceDetails, uploadReport, verifyDevice, downloadReport } from '../controllers/deviceController.js';
import uploadZip from '../middleware/uploadZip.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/verify-device', verifyDevice);
router.get('/:macId', getDeviceDetails); // Assuming you want to fetch device details by MAC ID
router.post('/report', uploadZip, uploadReport);
router.post('/download-report', authMiddleware, downloadReport)

export default router;