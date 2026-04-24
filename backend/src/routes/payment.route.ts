import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { createCashfreeOrder, verifyCashfreeWebhook } from '../services/paymentService';

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
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const order = await createCashfreeOrder({
      bookingNumber : booking.bookingNumber,
      totalAmount   : Number(booking.totalAmount),
      customerName  : booking.customerName,
      customerPhone : booking.customerPhone,
      customerEmail : booking.customerEmail || '',
    });

    // Save cashfree order id
    await prisma.booking.update({
      where: { id: bookingId },
      data : { cashfreeOrderId: order.order_id }
    });

    res.json({ 
      paymentSessionId: order.payment_session_id,
      orderId         : order.order_id 
    });
  } catch (error: any) {
    console.error('Payment creation error:', error?.response?.data || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/webhook  (Cashfree calls this)
router.post('/webhook', express.raw({ type: '*/*' }), async (req: any, res: any) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    
    // Incase body is already parsed by express.json in server.ts
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);

    // Verify it is really from Cashfree
    const isValid = verifyCashfreeWebhook(rawBody, timestamp, signature);
    if (!isValid) return res.status(400).json({ error: 'Invalid signature' });

    const event = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(rawBody);

    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = event.data.order.order_id;

      await prisma.booking.updateMany({
        where: { cashfreeOrderId: orderId },
        data : {
          paymentStatus: 'PAID',
          status       : 'CONFIRMED',
        }
      });
      await sendBookingConfirmation(orderId);
    }

    if (event.type === 'PAYMENT_FAILED_WEBHOOK') {
      const orderId = event.data.order.order_id;
      await prisma.booking.updateMany({
        where: { cashfreeOrderId: orderId },
        data : { paymentStatus: 'FAILED' }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook handling error');
  }
});

export default router;
