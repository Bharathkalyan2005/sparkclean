import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching services.' });
  }
};

// @desc    Get combo packages only
// @route   GET /api/services/combos
// @access  Public
export const getComboServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const combos = await prisma.service.findMany({
      where: { 
        isActive: true,
        category: 'COMBO' 
      },
      orderBy: { price: 'asc' },
    });
    res.status(200).json(combos);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching combos.' });
  }
};
