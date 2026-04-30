import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const generateBookingNumber = async () => {
  const count = await prisma.booking.count();
  const index = (count + 1).toString().padStart(4, '0');
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(2);
  return `SC${dateStr}${index}`;
};

router.post('/', authenticate, async (req, res) => {
  try {
    console.log('=== CREATE BOOKING REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', (req as any).user);

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

    // Validate required fields
    if (!customerName)   throw new Error('customerName is required');
    if (!customerPhone)  throw new Error('customerPhone is required');
    if (!address)        throw new Error('address is required');
    if (!area)           throw new Error('area is required');
    if (!services)       throw new Error('services is required');
    if (totalAmount === undefined || totalAmount === null) throw new Error('totalAmount is required');
    if (!scheduledDate)  throw new Error('scheduledDate is required');
    if (!scheduledTime)  throw new Error('scheduledTime is required');

    // Generate booking number
    const bookingNumber = await generateBookingNumber();
    console.log('Generated booking number:', bookingNumber);

    // Get customer ID from JWT token
    const customerId = (req as any).user.userId || (req as any).user.id;
    console.log('Customer ID:', customerId);

    if (!customerId) {
        throw new Error('User missing from request context. Are you authenticated?');
    }

    // Verify customer exists in database
    const customer = await prisma.user.findUnique({
      where: { id: customerId }
    });
    if (!customer) throw new Error(`User not found: ${customerId}`);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId,
        customerName,
        customerPhone,
        customerEmail : customerEmail || customer.email,
        address,
        area,
        city          : city || 'Visakhapatnam', // Matches the DB schema default
        services      : services,
        subtotal      : parseFloat(subtotal) || 0,
        discount      : parseFloat(discount) || 0,
        totalAmount   : parseFloat(totalAmount),
        paymentMethod : paymentMethod || null,
        paymentStatus : 'PENDING',
        scheduledDate : new Date(scheduledDate),
        scheduledTime,
        status        : 'PENDING',
        notes         : notes || null,
        promoCode     : promoCode || null,
      }
    });

    console.log('=== BOOKING CREATED ===', booking.id);

    // Update customer total bookings count
    await prisma.user.update({
      where: { id: customerId },
      data : { totalBookings: { increment: 1 } }
    });

    res.status(201).json({
      success      : true,
      bookingId    : booking.id,
      bookingNumber: booking.bookingNumber,
      message      : 'Booking created successfully'
    });

  } catch (error: any) {
    console.error('=== BOOKING CREATE ERROR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    // Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Duplicate booking number. Please try again.' 
      });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Invalid customer ID. Please login again.' 
      });
    }
    if (error.code === 'P2025') {
      return res.status(400).json({ 
        error: 'Record not found.' 
      });
    }

    res.status(500).json({
      error  : 'Failed to create booking',
      message: error.message,
      code   : error.code || 'UNKNOWN'
    });
  }
});

export default router;
