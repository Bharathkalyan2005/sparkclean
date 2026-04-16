import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

// Placeholders for forgot-password, reset-password, logout
router.post('/forgot-password', (req, res) => { res.send('Forgot password endpoint'); });
router.post('/reset-password', (req, res) => { res.send('Reset password endpoint'); });
router.post('/logout', (req, res) => { res.send('Logout endpoint'); });

export default router;
