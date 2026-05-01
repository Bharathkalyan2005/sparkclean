import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const generateBookingNumber = async (): Promise<string> => {
  const date   = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')
  const random = Math
    .random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()
  const num = `SC-${date}-${random}`
  
  const exists = await prisma.booking.findUnique({
    where: { bookingNumber: num }
  })
  return exists ? generateBookingNumber() : num
};

router.post('/', authenticate, async (req, res) => {
  try {
    console.log('=== BOOKING REQUEST BODY ===');
    console.log(JSON.stringify(req.body, null, 2));

    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      area,
      city,
      services,
      subtotal,
      discount,
      totalAmount,
      paymentMethod,
      scheduledDate,
      scheduledTime,
      notes,
      promoCode,
    } = req.body;

    const customerId = (req as any).user.userId || (req as any).user.id;

    // Verify user exists
    const customer = await prisma.user.findUnique({
      where: { id: customerId }
    });
    if (!customer) {
      return res.status(404).json({ 
        error: 'Customer not found' 
      });
    }

    // Generate booking number
    const bookingNumber = await generateBookingNumber();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId,
        customerName    : String(customerName),
        customerPhone   : String(customerPhone),
        customerEmail   : customerEmail || customer.email,
        address         : String(address),
        area            : String(area),
        city            : city || 'Visakhapatnam',
        services        : services || [],
        subtotal        : parseFloat(subtotal) || 0,
        discount        : parseFloat(discount) || 0,
        totalAmount     : parseFloat(totalAmount),
        paymentMethod   : paymentMethod 
                          ? paymentMethod.toUpperCase() 
                          : null,
        paymentStatus   : 'PENDING',
        scheduledDate   : new Date(scheduledDate),
        scheduledTime   : String(scheduledTime),
        status          : 'PENDING',
        notes           : notes || null,
        promoCode       : promoCode || null,
      }
    });

    console.log('✅ Booking created:', booking.bookingNumber);

    res.status(201).json({
      success      : true,
      bookingId    : booking.id,
      bookingNumber: booking.bookingNumber,
    });

  } catch (error: any) {
    console.error('❌ Booking error:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);

    res.status(500).json({
      error  : 'Booking failed',
      message: error.message,
      code   : error.code,
    });
  }
});

// Simple in-memory rate limiter (max 10 per hour per IP)
const trackRateLimits = new Map<string, { count: number, resetAt: number }>();

const rateLimiter = (req: any, res: any, next: any) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!trackRateLimits.has(ip)) {
    trackRateLimits.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return next();
  }

  const record = trackRateLimits.get(ip)!;
  if (now > record.resetAt) {
    trackRateLimits.set(ip, { count: 1, resetAt: now + 3600000 });
    return next();
  }

  if (record.count >= 10) {
    return res.status(429).json({ error: 'Too many tracking requests. Please try again later.' });
  }

  record.count += 1;
  next();
};

// PUBLIC route — no auth needed
// GET /api/bookings/track/:bookingNumber
router.get('/track/:bookingNumber', rateLimiter, async (req, res) => {
  try {
    const { bookingNumber } = req.params;

    const booking = await prisma.booking.findUnique({
      where : { bookingNumber },
      select: {
        bookingNumber  : true,
        customerName   : true,
        customerPhone  : true,  // only last 4 digits in response
        area           : true,
        city           : true,
        services       : true,
        totalAmount    : true,
        paymentMethod  : true,
        paymentStatus  : true,
        scheduledDate  : true,
        scheduledTime  : true,
        status         : true,
        createdAt      : true,
        updatedAt      : true,
        // DO NOT expose: address, email, paymentId
      }
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found. Check your Booking ID.'
      });
    }

    // Mask phone number for security
    // Show only last 4 digits: XXXXXX4321
    const maskedPhone = 'XXXXXX' + booking.customerPhone.slice(-4);

    res.json({
      ...booking,
      customerPhone: maskedPhone,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Track by phone number
// POST /api/bookings/track-by-phone
router.post('/track-by-phone', rateLimiter, async (req, res) => {
  try {
    const { phone } = req.body;

    const bookings = await prisma.booking.findMany({
      where : { customerPhone: phone },
      select: {
        bookingNumber : true,
        services      : true,
        totalAmount   : true,
        scheduledDate : true,
        scheduledTime : true,
        status        : true,
        paymentStatus : true,
        area          : true,
        createdAt     : true,
      },
      orderBy: { createdAt: 'desc' },
      take   : 5,  // last 5 bookings
    });

    if (!bookings.length) {
      return res.status(404).json({
        error: 'No bookings found for this number.'
      });
    }

    res.json({ bookings });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
