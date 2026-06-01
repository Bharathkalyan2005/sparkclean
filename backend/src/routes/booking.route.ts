import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { customAlphabet } from 'nanoid';
import { createBookingSchema } from '../validators/booking.validator';

const router = Router();
const prisma = new PrismaClient();

// Only uppercase letters + numbers (no confusing chars)
// Removed: 0, O, I, 1 to avoid confusion
const nanoid = customAlphabet(
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 
  6
);

async function generateBookingNumber(): Promise<string> {
  const maxRetries = 10;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Get today's date in IST (India timezone)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
    const istDate = new Date(now.getTime() + istOffset);
    
    const year  = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day   = String(istDate.getUTCDate()).padStart(2, '0');
    
    const dateStr  = `${year}${month}${day}`;  // 20260518
    const randomId = nanoid();                 // A3K9P2
    
    const bookingNumber = `SH-${dateStr}-${randomId}`;
    
    // Check uniqueness in database
    const existing = await prisma.booking.findUnique({
      where : { bookingNumber },
      select: { bookingNumber: true }
    });
    
    if (!existing) {
      console.log(`✅ Generated booking ID: ${bookingNumber}`);
      return bookingNumber;
    }
    
    console.warn(`⚠️ Collision on attempt ${attempt + 1}: ${bookingNumber}`);
  }
  
  // Fallback
  const timestamp = Date.now().toString(36).toUpperCase();
  const fallback  = `SH-FB-${timestamp}`;
  console.warn(`⚠️ Using fallback ID: ${fallback}`);
  return fallback;
}

router.post('/', authenticate, async (req, res) => {
  try {
    const validation = createBookingSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error : 'Validation failed',
        issues: validation.error.issues.map(i => ({
          field  : i.path.join('.'),
          message: i.message,
        }))
      })
    }

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

    // Generate FRESH unique ID for every booking
    const bookingNumber = await generateBookingNumber();

    console.log('=== NEW BOOKING ===');
    console.log('Customer  :', customerId);
    console.log('Booking ID:', bookingNumber);
    console.log('Timestamp :', new Date().toISOString());

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
      message      : 'Booking created successfully',
    });

  } catch (error: any) {
    // Handle duplicate key error (extra safety)
    if (error.code === 'P2002' && 
        error.meta?.target?.includes('bookingNumber')) {
      
      // Retry once more if DB constraint catches duplicate
      try {
        const retryNumber = await generateBookingNumber();
        const booking = await prisma.booking.create({
          data: {
            bookingNumber: retryNumber,
            // Re-using same required fields from the above scope
            customerId: (req as any).user.userId || (req as any).user.id,
            customerName: String(req.body.customerName),
            customerPhone: String(req.body.customerPhone),
            customerEmail: req.body.customerEmail || '',
            address: String(req.body.address),
            area: String(req.body.area),
            services: req.body.services || [],
            subtotal: parseFloat(req.body.subtotal) || 0,
            totalAmount: parseFloat(req.body.totalAmount),
            scheduledDate: new Date(req.body.scheduledDate),
            scheduledTime: String(req.body.scheduledTime)
          }
        });
        return res.status(201).json({
          success      : true,
          bookingId    : booking.id,
          bookingNumber: retryNumber,
        });
      } catch (retryErr: any) {
        return res.status(500).json({
          error: 'Booking ID generation failed. Try again.'
        });
      }
    }

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
    console.log('=== TRACKING REQUEST ===');
    console.log('Booking Number:', bookingNumber);

    const booking = await prisma.booking.findUnique({
      where : { bookingNumber: bookingNumber.trim().toUpperCase() },
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

    console.log('Booking found:', !!booking);

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

// GET single booking by ID (optional auth, since SuccessPage might just ping it after payment)
router.get('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId
      },
      select: {
        id           : true,
        bookingNumber: true,
        customerName : true,
        services     : true,
        totalAmount  : true,
        scheduledDate: true,
        scheduledTime: true,
        area         : true,
        city         : true,
        status       : true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt    : true,
      }
    })

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      })
    }

    res.json(booking)

  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router;
