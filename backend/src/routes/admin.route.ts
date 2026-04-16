import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// /api/admin endpoints

router.get('/stats', authenticate, authorizeAdmin, (req, res) => { res.send('Dashboard KPI metrics'); });
router.get('/revenue', authenticate, authorizeAdmin, (req, res) => { res.send('Revenue by day/week/month'); });
router.get('/top-areas', authenticate, authorizeAdmin, (req, res) => { res.send('Bookings by area heatmap'); });
router.get('/top-services', authenticate, authorizeAdmin, (req, res) => { res.send('Most booked services'); });
router.get('/customers', authenticate, authorizeAdmin, (req, res) => { res.send('All customer list'); });
router.patch('/customers/:id/role', authenticate, authorizeAdmin, (req, res) => { res.send('Change user role'); });

export default router;
