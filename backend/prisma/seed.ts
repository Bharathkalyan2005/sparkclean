import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      // ── INDIVIDUAL SERVICES ──
      {
        name           : 'Bathroom Cleaning',
        description    : 'Professional deep cleaning. Tile scrubbing, toilet sanitization, mirror cleaning.',
        price          : 149,
        originalPrice  : 249,
        unit           : 'per bathroom',
        category       : 'INDIVIDUAL',
        iconName       : 'bath',
        durationMinutes: 60,
        isActive       : true,
        sortOrder      : 1,
      },
      {
        name           : 'Fridge Cleaning',
        description    : 'Deep clean inside and outside. Remove odors, clean shelves and drawers.',
        price          : 299,
        originalPrice  : 399,
        unit           : 'per fridge',
        category       : 'INDIVIDUAL',
        iconName       : 'fridge',
        durationMinutes: 45,
        isActive       : true,
        sortOrder      : 2,
      },
      {
        name           : 'Utensils Cleaning',
        description    : 'Clean all utensils, vessels, and kitchen tools thoroughly.',
        price          : 149,
        originalPrice  : 249,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'utensils',
        durationMinutes: 60,
        isActive       : true,
        sortOrder      : 3,
      },
      {
        name           : 'Kitchen Prep Help',
        description    : 'Chopping, peeling, and meal prep assistance.',
        price          : 199,
        originalPrice  : 299,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'kitchen',
        durationMinutes: 60,
        isActive       : true,
        sortOrder      : 4,
      },
      {
        name           : 'Dusting & Wiping',
        description    : 'Full home dusting, surface wiping, furniture cleaning.',
        price          : 299,
        originalPrice  : 399,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'dust',
        durationMinutes: 90,
        isActive       : true,
        sortOrder      : 5,
      },
      {
        name           : 'Kitchen Cleaning',
        description    : 'Deep kitchen clean. Cabinets, countertops, sink, appliances.',
        price          : 499,
        originalPrice  : 599,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'kitchen',
        durationMinutes: 90,
        isActive       : true,
        sortOrder      : 6,
      },
      {
        name           : 'Pre-Party Express Clean',
        description    : 'Quick full home cleaning before your event.',
        price          : 799,
        originalPrice  : 899,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'party',
        durationMinutes: 120,
        isActive       : true,
        sortOrder      : 7,
      },
      {
        name           : 'After-Party Cleaning',
        description    : 'Complete post-event cleanup. Floors, surfaces, waste disposal.',
        price          : 999,
        originalPrice  : 1099,
        unit           : 'per session',
        category       : 'INDIVIDUAL',
        iconName       : 'clean',
        durationMinutes: 180,
        isActive       : true,
        sortOrder      : 8,
      },
      {
        name           : 'Ironing & Folding',
        description    : 'Professional ironing and neatly folded clothes.',
        price          : 10,
        originalPrice  : 15,
        unit           : 'per cloth',
        category       : 'INDIVIDUAL',
        iconName       : 'iron',
        durationMinutes: null,
        isActive       : true,
        sortOrder      : 9,
      },
  
      // ── COMBO PACKAGES ──
      {
        name           : '1 BHK Combo',
        description    : 'Sweeping & mopping, Dusting & wiping, 1 Bathroom cleaning, Kitchen basic cleaning. 2 Fans FREE!',
        price          : 699,
        originalPrice  : 899,
        unit           : 'full package',
        category       : 'COMBO',
        iconName       : '1bhk',
        durationMinutes: 180,
        isActive       : true,
        sortOrder      : 10,
      },
      {
        name           : '2 BHK Combo',
        description    : 'Full house cleaning, 2 Bathrooms cleaning, Kitchen cleaning, Dusting & wiping. 4 Fans FREE!',
        price          : 999,
        originalPrice  : 1299,
        unit           : 'full package',
        category       : 'COMBO',
        iconName       : '2bhk',
        durationMinutes: 240,
        isActive       : true,
        sortOrder      : 11,
      },
      {
        name           : '3 BHK Combo',
        description    : 'Full home cleaning, 2-3 Bathrooms cleaning, Kitchen deep cleaning, Balcony basic cleaning. 6 Fans FREE!',
        price          : 1499,
        originalPrice  : 1899,
        unit           : 'full package',
        category       : 'COMBO',
        iconName       : '3bhk',
        durationMinutes: 360,
        isActive       : true,
        sortOrder      : 12,
      },
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
