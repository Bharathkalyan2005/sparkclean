import { Router } from 'express'

const router = Router()

router.get('/public', async (req, res) => {
  res.json({
    // Only PUBLIC keys safe for frontend
    googleMapsKey : process.env.GOOGLE_MAPS_PUBLIC_KEY || process.env.REACT_APP_GOOGLE_MAPS_KEY,
    razorpayKeyId : process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID,
    // NEVER send: secrets, passwords, private keys
  })
})

export default router;