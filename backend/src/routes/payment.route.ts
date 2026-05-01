import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

const sendBookingConfirmation = async (orderId: string) => {
  console.log('Sending booking confirmation for order:', orderId);
};

// POST /api/payments/create-order
router.post('/create-order', authenticate, async (req: any, res: any) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) return res.status(404).json({ error: 'Not found' });

    const order = await createRazorpayOrder({
      bookingNumber : booking.bookingNumber,
      totalAmount   : Number(booking.totalAmount),
      customerName  : booking.customerName,
      customerPhone : booking.customerPhone,
      customerEmail : booking.customerEmail || '',
    });

    // Save razorpay order id to booking
    await prisma.booking.update({
      where: { id: bookingId },
      data : { cashfreeOrderId: order.id } // reuse field
    });

    res.json({
      orderId      : order.id,
      amount       : order.amount,
      currency     : order.currency,
      keyId        : process.env.RAZORPAY_KEY_ID,
      customerName : booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error?.response?.data || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/verify
router.post('/verify', authenticate, async (req: any, res: any) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update booking as paid
    await prisma.booking.update({
      where: { id: bookingId },
      data : {
        paymentStatus: 'PAID',
        paymentId    : razorpay_payment_id,
        status       : 'CONFIRMED',
      }
    });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (booking) {
      // Format WhatsApp message
      const services = (booking.services as any[])
        .map((s: any) => `${s.name} x${s.quantity || 1}`)
        .join(', ');

      const waMessage = encodeURIComponent(
`Hi ${booking.customerName}! ✦

Your SparkClean booking is CONFIRMED!

Booking ID : ${booking.bookingNumber}
Services   : ${services}
Date       : ${new Date(booking.scheduledDate).toLocaleDateString('en-IN')}
Time       : ${booking.scheduledTime}
Address    : ${booking.address}, ${booking.area}
Total Paid : ₹${booking.totalAmount}

Our team will arrive on time.
Questions? Call: 9392420643

Thank you for choosing SparkClean! ✦`);

      // Log WhatsApp link (send via Twilio in production)
      console.log(
        `WhatsApp confirmation for ${booking.customerPhone}:`,
        `https://wa.me/91${booking.customerPhone}?text=${waMessage}`
      );
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/webhook
router.post('/webhook', 
  express.raw({ type: 'application/json' }), 
  async (req: any, res: any) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const body = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);

      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (expectedSig !== signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const event = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(body);

      if (event.event === 'payment.captured') {
        const orderId   = event.payload.payment.entity.order_id;
        const paymentId = event.payload.payment.entity.id;

        await prisma.booking.updateMany({
          where: { cashfreeOrderId: orderId },
          data : {
            paymentStatus: 'PAID',
            paymentId    : paymentId,
            status       : 'CONFIRMED',
          }
        });
      }

      if (event.event === 'payment.failed') {
        const orderId = event.payload.payment.entity.order_id;
        await prisma.booking.updateMany({
          where: { cashfreeOrderId: orderId },
          data : { paymentStatus: 'FAILED' }
        });
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).send('Webhook handling error');
    }
  }
);

export default router;
