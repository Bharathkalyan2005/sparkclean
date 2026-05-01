import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

passport.use(new GoogleStrategy({
    clientID    : process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL : process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email    = profile.emails?.[0]?.value
      const name     = profile.displayName
      const avatar   = profile.photos?.[0]?.value
      const googleId = profile.id

      if (!email) return done(new Error('No email from Google'))

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        // Create new user from Google profile
        user = await prisma.user.create({
          data: {
            email,
            fullName    : name,
            avatarUrl   : avatar,
            passwordHash: googleId, // placeholder for OAuth users
            role        : 'CUSTOMER',
            city        : 'India',
          }
        })
      } else {
        // Update avatar if changed
        await prisma.user.update({
          where: { id: user.id },
          data : { avatarUrl: avatar }
        })
      }

      return done(null, user)
    } catch (err) {
      console.error('Google Auth DB Error:', err)
      // Return false for user to trigger passport's failureRedirect instead of throwing a 500
      return done(null, false, { message: 'Database connection failed' } as any)
    }
  }
))

export default passport
