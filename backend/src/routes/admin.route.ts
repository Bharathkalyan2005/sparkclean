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
import { getPromos, createPromo, togglePromo, deletePromo } from '../controllers/promo.controller';
import { getAdminServices, createService, updateService, deleteService } from '../controllers/admin-services.controller';

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

// Promos
router.get('/promos', getPromos);
router.post('/promos', createPromo);
router.patch('/promos/:id/toggle', togglePromo);
router.delete('/promos/:id', deletePromo);

// Services
router.get('/services', getAdminServices);
router.post('/services', createService);
router.patch('/services/:id', updateService);
router.delete('/services/:id', deleteService);

export default router;
