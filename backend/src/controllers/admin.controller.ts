import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [
      bookingsToday,
      bookingsYesterday,
      revenueTodayRes,
      pendingJobs,
      customersTotal,
      customersLastWeek
    ] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: today } } }),
      prisma.booking.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: today }, paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      }),
      prisma.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } } })
    ]);

    const revenueToday = revenueTodayRes._sum.totalAmount || 0;
    
    // Revenue chart data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const chartBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo }, paymentStatus: 'PAID' },
      select: { createdAt: true, totalAmount: true }
    });

    const chartDataMap: Record<string, { revenue: number; bookings: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      chartDataMap[dateStr] = { revenue: 0, bookings: 0 };
    }

    chartBookings.forEach(b => {
      const dateStr = b.createdAt.toISOString().split('T')[0];
      if (chartDataMap[dateStr]) {
        chartDataMap[dateStr].revenue += Number(b.totalAmount);
        chartDataMap[dateStr].bookings++;
      }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({
      date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: chartDataMap[date].revenue,
      bookings: chartDataMap[date].bookings
    }));

    // Top services
    const bookings = await prisma.booking.findMany({
        where: { createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } },
        select: { services: true }
    });
    
    const serviceCounts: Record<string, number> = {};
    bookings.forEach(b => {
        try {
            const services = typeof b.services === 'string' ? JSON.parse(b.services) : b.services as any[];
            if (Array.isArray(services)) {
                services.forEach(s => {
                    serviceCounts[s.name] = (serviceCounts[s.name] || 0) + 1;
                });
            }
        } catch (e) {
            // Ignore parsing errors for individual bookings
        }
    });
    const topServices = Object.entries(serviceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Global Stats
    const globalStats = await Promise.all([
        prisma.booking.count(),
        prisma.booking.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { totalAmount: true } }),
        prisma.booking.count({ where: { status: 'COMPLETED' } }),
        prisma.booking.count({ where: { status: 'CANCELLED' } })
    ]);

    res.json({
      cards: {
        todayBookings: { value: bookingsToday, diff: bookingsToday - bookingsYesterday },
        todayRevenue: { value: revenueToday },
        pendingJobs: { value: pendingJobs },
        totalCustomers: { value: customersTotal, newThisWeek: customersLastWeek }
      },
      chartData,
      topServices,
      global: {
          totalBookings: globalStats[0],
          totalRevenue: globalStats[1]._sum.totalAmount || 0,
          completedJobs: globalStats[2],
          cancelledJobs: globalStats[3]
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            take: Number(req.query.limit) || 100
        });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const booking = await prisma.booking.update({
            where: { id: req.params.id as string },
            data: { status }
        });
        res.json(booking);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json(customers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const readMessage = async (req: Request, res: Response) => {
    try {
        const message = await prisma.contactMessage.update({
            where: { id: req.params.id as string },
            data: { isRead: true }
        });
        res.json(message);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getRevenue = async (req: Request, res: Response) => {
    try {
        const revenue = await prisma.booking.aggregate({
            where: { paymentStatus: 'PAID' },
            _sum: { totalAmount: true }
        });
        res.json({ totalRevenue: revenue._sum.totalAmount || 0 });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserRole = async (req: Request | any, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['CUSTOMER', 'ADMIN', 'CLEANER'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Prevent admin removing own admin role
        if (id === req.user?.id && role !== 'ADMIN') {
            return res.status(400).json({ error: 'Cannot change your own role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            }
        });

        console.log(`Role changed: ${user.email} → ${role} by admin: ${req.user?.email}`);

        res.json({ 
            success: true, 
            user,
            message: `${user.fullName} is now ${role}`
        });

    } catch (error: any) {
        console.error('Role change error:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
};
