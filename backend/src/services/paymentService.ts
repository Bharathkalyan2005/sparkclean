import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id    : process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Create Razorpay Order
export async function createRazorpayOrder(booking: {
  bookingNumber : string
  totalAmount   : number
  customerName  : string
  customerPhone : string
  customerEmail : string
}) {
  const order = await razorpay.orders.create({
    amount  : booking.totalAmount * 100, // paise
    currency: 'INR',
    receipt : booking.bookingNumber,
    notes   : {
      customerName : booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
    }
  })
  return order // contains order.id
}

// Verify Razorpay Payment Signature
export function verifyRazorpaySignature(
  razorpay_order_id  : string,
  razorpay_payment_id: string,
  razorpay_signature : string
): boolean {
  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expectedSignature === razorpay_signature
}
