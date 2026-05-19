import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

// GET all active services (PUBLIC — no auth)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where  : { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    res.json({ services })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// GET individual services only
router.get('/individual', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where  : { isActive: true, category: 'INDIVIDUAL' },
      orderBy: { sortOrder: 'asc' },
    })
    res.json({ services })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// GET combo packages only
router.get('/combos', async (req, res) => {
  try {
    const combos = await prisma.service.findMany({
      where  : { isActive: true, category: 'COMBO' },
      orderBy: { sortOrder: 'asc' },
    })
    res.json({ combos })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// GET all services including inactive (ADMIN)
router.get('/all', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const services = await prisma.service.findMany({
        orderBy: [
          { category : 'asc' },
          { sortOrder: 'asc' },
        ]
      })
      res.json({ services })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// POST create new service (ADMIN)
router.post('/', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        originalPrice,
        unit,
        category,
        iconName,
        durationMinutes,
        sortOrder,
      } = req.body

      // Validate required fields
      if (!name || !price || !category) {
        return res.status(400).json({
          error: 'name, price, category are required'
        })
      }

      // Get max sortOrder + 1 if not provided
      const maxOrder = await prisma.service.findFirst({
        orderBy: { sortOrder: 'desc' },
        select : { sortOrder: true },
      })

      const service = await prisma.service.create({
        data: {
          name,
          description    : description    || null,
          price          : parseFloat(price),
          originalPrice  : originalPrice
                           ? parseFloat(originalPrice)
                           : null,
          unit           : unit           || 'per visit',
          category       : category.toUpperCase(),
          iconName       : iconName       || null,
          durationMinutes: durationMinutes
                           ? parseInt(durationMinutes)
                           : null,
          isActive       : true,
          sortOrder      : sortOrder
                           || (maxOrder?.sortOrder || 0) + 1,
        }
      })

      console.log('✅ New service created:', service.name)
      res.status(201).json({ service })

    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// PATCH update service (ADMIN)
router.patch('/:id', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params
      const {
        name,
        description,
        price,
        originalPrice,
        unit,
        category,
        iconName,
        durationMinutes,
        isActive,
        sortOrder,
      } = req.body

      const service = await prisma.service.update({
        where: { id: id as string },
        data : {
          ...(name            && { name }),
          ...(description !== undefined && { description }),
          ...(price           && { price: parseFloat(price) }),
          ...(originalPrice !== undefined && {
            originalPrice: originalPrice
              ? parseFloat(originalPrice) : null
          }),
          ...(unit            && { unit }),
          ...(category        && { category: category.toUpperCase() }),
          ...(iconName !== undefined && { iconName }),
          ...(durationMinutes !== undefined && {
            durationMinutes: durationMinutes
              ? parseInt(durationMinutes) : null
          }),
          ...(isActive !== undefined && { isActive }),
          ...(sortOrder !== undefined && { sortOrder }),
        }
      })

      console.log('✅ Service updated:', service.name)
      res.json({ service })

    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Service not found' })
      }
      res.status(500).json({ error: error.message })
    }
  }
)

// PATCH toggle active/inactive (ADMIN)
router.patch('/:id/toggle', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params

      const current = await prisma.service.findUnique({
        where : { id: id as string },
        select: { isActive: true, name: true }
      })
      if (!current) {
        return res.status(404).json({ error: 'Not found' })
      }

      const service = await prisma.service.update({
        where: { id: id as string },
        data : { isActive: !current.isActive }
      })

      res.json({
        service,
        message: `${service.name} is now ${
          service.isActive ? 'ACTIVE' : 'INACTIVE'
        }`
      })

    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// DELETE service (ADMIN - soft delete by deactivating)
router.delete('/:id', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params

      // Soft delete — just deactivate
      // Hard delete only if no bookings reference it
      const bookingsCount = await prisma.booking.count({
        where: {
          services: {
            path : ['$[*].id'],
            equals: id
          }
        }
      })

      if (bookingsCount > 0) {
        // Has bookings — soft delete only
        await prisma.service.update({
          where: { id: id as string },
          data : { isActive: false }
        })
        return res.json({
          success: true,
          message: 'Service deactivated (has existing bookings)'
        })
      }

      // No bookings — hard delete
      await prisma.service.delete({ where: { id: id as string } })
      res.json({ success: true, message: 'Service deleted' })

    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// PATCH reorder services (ADMIN)
router.patch('/reorder', authenticate, requireAdmin,
  async (req, res) => {
    try {
      const { order } = req.body
      // order = [{ id: 'xxx', sortOrder: 1 }, ...]

      await Promise.all(
        order.map(({ id, sortOrder }: any) =>
          prisma.service.update({
            where: { id },
            data : { sortOrder }
          })
        )
      )

      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default router
