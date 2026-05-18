import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPublicFeedback = async (req: Request, res: Response) => {
    try {
        const { limit = '6' } = req.query;
        const feedback = await prisma.feedback.findMany({
            where: { isApproved: true },
            orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
            take: Number(limit)
        });
        res.json(feedback);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllFeedback = async (req: Request, res: Response) => {
    try {
        const feedback = await prisma.feedback.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(feedback);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const submitFeedback = async (req: Request | any, res: Response) => {
    try {
        const { customerName, customerEmail, phone, area, serviceName, rating, comment, bookingId } = req.body;
        
        const feedback = await prisma.feedback.create({
            data: {
                customerName,
                customerEmail: customerEmail || req.user?.email,
                phone,
                area,
                serviceName,
                rating: Number(rating),
                comment,
                bookingId,
                userId: req.user?.id
            }
        });
        
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback });
    } catch (error: any) {
        console.error('Feedback submit error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const approveFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedback.update({
            where: { id: id as string },
            data: { isApproved: true }
        });
        res.json({ success: true, feedback });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedback.update({
            where: { id: id as string },
            data: { isApproved: false, isFeatured: false }
        });
        res.json({ success: true, feedback });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const featureFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { featured } = req.body;
        const feedback = await prisma.feedback.update({
            where: { id: id as string },
            data: { isFeatured: featured }
        });
        res.json({ success: true, feedback });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.feedback.delete({
            where: { id: id as string }
        });
        res.json({ success: true, message: 'Feedback deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
