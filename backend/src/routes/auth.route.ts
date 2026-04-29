import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Step 1: Redirect to Google login
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Step 2: Google redirects back here
router.get('/google/callback',
  passport.authenticate('google', {
    session     : false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google_failed`
  }),
  (req, res) => {
    const user = req.user as any;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email : user.email,
        role  : user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.fullName)}`
    );
  }
);

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

// Placeholders for forgot-password, reset-password, logout
router.post('/forgot-password', (req, res) => { res.send('Forgot password endpoint'); });
router.post('/reset-password', (req, res) => { res.send('Reset password endpoint'); });
router.post('/logout', (req, res) => { res.send('Logout endpoint'); });

export default router;
