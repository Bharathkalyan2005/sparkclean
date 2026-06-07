import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import passport from './config/passport';
import servicesRoutes from './routes/services.route';
import authRoutes from './routes/auth.route';
import bookingRoutes from './routes/booking.route';
import adminRoutes from './routes/admin.route';
import paymentRoutes from './routes/payment.route';
import feedbackRoutes from './routes/feedback.route';
import locationRoutes from './routes/location.route';
import configRoutes from './routes/config.route';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://sparkclean-orcin.vercel.app',
  'https://sucihome.vercel.app',
  'http://localhost:3000'
].filter(Boolean) as string[];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc : ["'self'"],
      scriptSrc  : ["'self'", 'https://checkout.razorpay.com'],
      styleSrc   : ["'self'", "'unsafe-inline'"],
      imgSrc     : ["'self'", 'data:', 'https:'],
      connectSrc : ["'self'", 'https://api.razorpay.com'],
      frameSrc   : ["'self'", 'https://api.razorpay.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

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

const globalLimiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 minutes
  max      : 100,
  message  : { error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders  : false,
})
app.use('/api/', globalLimiter)

const authLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 10,
  message  : { error: 'Too many login attempts. Try again in 15 minutes.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/signup', authLimiter)

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp());
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(passport.initialize());

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/config', configRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SuciHome API', version: '1.0.0' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  // Log error internally
  console.error('=== UNHANDLED ERROR ===');
  console.error('URL   :', req.url);
  console.error('Method:', req.method);
  console.error('Error :', err.message);
  console.error('Stack :', err.stack);
  
  // NEVER send stack trace to client in production
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error  : isProd
             ? 'Something went wrong'
             : err.message,
    code   : err.code || 'INTERNAL_ERROR',
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

import { createServer } from 'http';
import { Server } from 'socket.io';

// Start Server
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin     : [
      process.env.FRONTEND_URL,
      'https://sparkclean-orcin.vercel.app',
      'https://sucihome.vercel.app',
      'http://localhost:3000'
    ].filter(Boolean) as string[],
    credentials: true,
    methods    : ['GET','POST'],
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('cleaner:join', ({ bookingId }) => {
    socket.join(`booking:${bookingId}`);
    console.log(`Cleaner in room: ${bookingId}`);
  });

  socket.on('cleaner:location', async ({
    bookingId, lat, lng, heading, speed
  }) => {
    try {
      await prisma.cleanerLocation.upsert({
        where : { bookingId },
        update: { lat, lng, heading, speed },
        create: {
          bookingId,
          cleanerId: 'unassigned',
          lat, lng,
          heading: heading || 0,
          speed  : speed   || 0,
        }
      });
    } catch (err) {
      console.error('Location save error:', err);
    }

    io.to(`booking:${bookingId}`)
      .emit('location:update', {
        lat, lng, heading,
        timestamp: new Date().toISOString()
      });
  });

  socket.on('customer:watch', ({ bookingId }) => {
    socket.join(`booking:${bookingId}`);
    console.log(`Customer watching: ${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server + Socket.io is running on http://localhost:${PORT}`);
});
