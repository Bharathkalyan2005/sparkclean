import axios from 'axios';
import crypto from 'crypto';

const CASHFREE_BASE = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';
const APP_ID        = process.env.CASHFREE_APP_ID;
const SECRET_KEY    = process.env.CASHFREE_SECRET_KEY;

const cashfreeHeaders = {
  'x-api-version'  : '2023-08-01',
  'x-client-id'    : APP_ID,
  'x-client-secret': SECRET_KEY,
  'Content-Type'   : 'application/json',
};

// Create Cashfree Order
export async function createCashfreeOrder(booking: {
  bookingNumber : string;
  totalAmount   : number;
  customerName  : string;
  customerPhone : string;
  customerEmail : string;
}) {
  const response = await axios.post(
    `${CASHFREE_BASE}/orders`,
    {
      order_id       : booking.bookingNumber,
      order_amount   : booking.totalAmount,
      order_currency : 'INR',
      customer_details: {
        customer_id   : booking.bookingNumber,
        customer_name : booking.customerName,
        customer_phone: booking.customerPhone,
        customer_email: booking.customerEmail,
      },
      order_meta: {
        return_url:
          `${process.env.FRONTEND_URL}/success?order_id={order_id}`,
        notify_url:
          `${process.env.BACKEND_URL}/api/payments/webhook`,
      },
    },
    { headers: cashfreeHeaders }
  );
  return response.data; // contains payment_session_id
}

// Verify Webhook Signature
export function verifyCashfreeWebhook(
  rawBody   : string,
  timestamp : string,
  signature : string
): boolean {
  if (!SECRET_KEY) return false;
  const signedPayload = timestamp + rawBody;
  const expectedSig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(signedPayload)
    .digest('base64');
  return expectedSig === signature;
}
