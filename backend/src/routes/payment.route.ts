import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// /api/payments endpoints

router.post('/create-order', async (req, res) => {
  const { order_id, order_amount, order_currency, customer_details, order_meta } = req.body;

  try {
    const baseUrl = process.env.CASHFREE_ENV === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
      },
      body: JSON.stringify({
        order_id,
        order_amount,
        order_currency,
        customer_details,
        order_meta,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

router.post('/webhook', (req, res) => { res.send('Cashfree payment webhook'); });
router.get('/:bookingId/status', authenticate, (req, res) => { res.send('Check payment status'); });
router.post('/refund', authenticate, authorizeAdmin, (req, res) => { res.send('Process refund (admin)'); });

export default router;
