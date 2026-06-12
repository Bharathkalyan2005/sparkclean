import { z } from 'zod'

export const createBookingSchema = z.object({
  customerName  : z.string().min(2).max(100).trim(),
  customerPhone : z.string()
                   .regex(/^[6-9]\d{9}$/, 
                     'Invalid Indian phone number'),
  customerEmail : z.string().email().optional().or(z.literal('')),
  address       : z.string().min(3).max(500).trim(),
  area          : z.string().min(2).max(100),
  city          : z.string().min(2).max(100).default('India'),
  services      : z.array(z.object({
    id      : z.string().or(z.number()),
    name    : z.string(),
    price   : z.number().positive().or(z.string()),
    quantity: z.number().int().positive().max(50).optional(),
    unit    : z.string().optional(),
    category: z.string().optional(),
    icon_name: z.string().optional(),
    is_active: z.boolean().optional(),
  })).min(1, 'At least one service required'),
  totalAmount   : z.number().positive().max(500000).or(z.string()),
  paymentMethod : z.enum(['RAZORPAY', 'COD', 'UPI']).optional(),
  scheduledDate : z.string()
                   .refine(d => {
                     const date = new Date(d)
                     const today = new Date()
                     today.setHours(0,0,0,0)
                     return date >= today
                   }, 'Date must be today or future'),
  scheduledTime : z.string(),
  notes         : z.string().max(500).optional().or(z.literal('')),
  promoCode     : z.string().max(20).optional().or(z.literal('')),
  subtotal      : z.number().optional().or(z.string()),
  discount      : z.number().optional().or(z.string()),
})
