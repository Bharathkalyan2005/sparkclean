import { Router } from 'express';
import { register, login, getMe, updateMe, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Step 1: Redirect to Google login
router.get('/google',
  (req, res, next) => {
    console.log('=== GOOGLE AUTH STARTED ===');
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Step 2: Google redirects back here
router.get('/google/callback',
  (req, res, next) => {
    console.log('=== GOOGLE CALLBACK RECEIVED ===');
    next();
  },
  passport.authenticate('google', {
    session     : false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google_failed`
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      console.log('=== USER FROM GOOGLE ===', user);

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=no_user`);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email : user.email,
          role  : user.role,
          name  : user.fullName,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.fullName)}&email=${encodeURIComponent(user.email)}`
      );
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=token_failed`);
    }
  }
);

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

// Placeholders for forgot-password, reset-password, logout
router.post('/forgot-password', (req, res) => { res.send('Forgot password endpoint'); });
router.post('/reset-password', resetPassword);
router.post('/logout', (req, res) => { res.send('Logout endpoint'); });

export default router;
