import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Placeholders for /api/bookings endpoints mapped from PRD

router.get('/', authenticate, (req, res) => { res.send('Get my bookings'); });
router.post('/', authenticate, (req, res) => { res.send('Create new booking'); });
router.get('/:id', authenticate, (req, res) => { res.send('Get single booking details'); });
router.patch('/:id/cancel', authenticate, (req, res) => { res.send('Cancel a booking'); });
router.post('/:id/review', authenticate, (req, res) => { res.send('Submit rating + review'); });

// Admin-level endpoints mapped under booking routes (since /admin/:id/status exist in PRD)
router.get('/admin/all', authenticate, (req, res) => { res.send('Get all bookings (admin)'); });
router.patch('/admin/:id/status', authenticate, (req, res) => { res.send('Update booking status (admin)'); });
router.patch('/admin/:id/assign', authenticate, (req, res) => { res.send('Assign cleaner (admin)'); });

export default router;
