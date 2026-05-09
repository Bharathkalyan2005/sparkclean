import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { 
    getStats, 
    getBookings, 
    updateBookingStatus, 
    getCustomers, 
    getMessages, 
    readMessage, 
    getRevenue,
    updateUserRole
} from '../controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorizeAdmin);

// /api/admin endpoints

router.get('/stats', getStats);
router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/customers', getCustomers);
router.patch('/customers/:id/role', updateUserRole);
router.get('/revenue', getRevenue);
router.get('/messages', getMessages);
router.patch('/messages/:id/read', readMessage);

export default router;
