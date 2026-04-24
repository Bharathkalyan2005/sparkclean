import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Auto-generate booking number
    const bookingNumber = 'BK' + Date.now().toString();

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: bookingNumber,
        customerId: bookingData.customerId || (await prisma.user.findFirst({ where: { phone: bookingData.customerPhone } }))?.id || (await prisma.user.create({
          data: {
            email: bookingData.customerEmail || 'guest_'+Date.now()+'@example.com',
            phone: bookingData.customerPhone,
            fullName: bookingData.customerName,
            passwordHash: 'placeholder',
            city: 'Visakhapatnam'
          }
        })).id,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerEmail: bookingData.customerEmail || '',
        address: bookingData.address,
        area: bookingData.area || '',
        city: 'Visakhapatnam',
        services: JSON.stringify(bookingData.services || []),
        subtotal: Number(bookingData.totalAmount),
        totalAmount: Number(bookingData.totalAmount),
        paymentMethod: 'CASHFREE',
        scheduledDate: new Date(bookingData.scheduledDate || Date.now()),
        scheduledTime: bookingData.scheduledTime || '10:00 AM'
      }
    });

    return res.json({ bookingId: booking.id, bookingNumber: booking.bookingNumber });
  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
