import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import passport from './config/passport';
import servicesRoutes from './routes/services.route';
import authRoutes from './routes/auth.route';
import bookingRoutes from './routes/booking.route';
import adminRoutes from './routes/admin.route';
import paymentRoutes from './routes/payment.route';
import feedbackRoutes from './routes/feedback.route';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://sparkclean-orcin.vercel.app',
  'http://localhost:3000'
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status : 'ok',
    service: 'SparkClean API',
    time   : new Date().toISOString()
  });
});

// Global error handler
import { Request, Response, NextFunction } from 'express';
app.use((
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  console.error('=== GLOBAL ERROR ===');
  console.error('URL   :', req.url);
  console.error('Method:', req.method);
  console.error('Error :', err.message);
  console.error('Stack :', err.stack);

  res.status(500).json({
    error  : 'Internal server error',
    message: err.message,
    path   : req.url
  });
});

// Graceful shutdown for Prisma connection
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
