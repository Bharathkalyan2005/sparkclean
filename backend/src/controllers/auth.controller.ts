import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullName, phone } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
      },
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error("Register Error: ", error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.passwordHash) {
      res.status(400).json({ error: 'Please sign in with Google' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-2026';
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, { expiresIn: '1d' });

    res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    // Remove passwordHash before returning
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

export const updateMe = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { fullName, phone, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        fullName,
        phone,
        address
      }
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
