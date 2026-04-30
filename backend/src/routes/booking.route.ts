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

export default router;
