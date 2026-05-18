import { Request, Response } from 'express';
import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminServices = async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, description, price, unit, category, durationMinutes } = req.body;
        const service = await prisma.service.create({
            data: {
                name,
                description,
                price: Number(price),
                unit,
                category: category as Category,
                durationMinutes: durationMinutes ? Number(durationMinutes) : null
            }
        });
        res.status(201).json({ success: true, service });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, unit, category, isActive } = req.body;
        
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (unit !== undefined) updateData.unit = unit;
        if (category !== undefined) updateData.category = category as Category;
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        const service = await prisma.service.update({
            where: { id: id as string },
            data: updateData
        });
        res.json({ success: true, service });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.service.delete({
            where: { id: id as string }
        });
        res.json({ success: true, message: 'Service deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};