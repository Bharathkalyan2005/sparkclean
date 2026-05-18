import { Request, Response } from 'express';
import { PrismaClient, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

export const getPromos = async (req: Request, res: Response) => {
    try {
        const promos = await prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(promos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createPromo = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, minOrder, maxUses, expiresAt } = req.body;
        const promo = await prisma.promoCode.create({
            data: {
                code: code.toUpperCase(),
                discountType: discountType as DiscountType,
                discountValue: Number(discountValue),
                minOrder: Number(minOrder || 0),
                maxUses: Number(maxUses || 100),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });
        res.status(201).json({ success: true, promo });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const togglePromo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const promo = await prisma.promoCode.update({
            where: { id: id as string },
            data: { isActive: Boolean(isActive) }
        });
        res.json({ success: true, promo });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePromo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.promoCode.delete({
            where: { id: id as string }
        });
        res.json({ success: true, message: 'Promo deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};