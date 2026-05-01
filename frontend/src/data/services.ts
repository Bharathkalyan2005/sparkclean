// Static services data (also seeded to Supabase)
export const SERVICES = [
  { 
    id: 'svc-1', 
    name: 'Bathroom Cleaning', 
    price: 149,
    originalPrice: 249,
    unit: 'per bathroom', 
    category: 'Cleaning', 
    icon_name: 'bath', 
    is_active: true,
    description: 'Experience a hygienic and sparkling bathroom with our professional deep cleaning service. We eliminate stains, bacteria, and hard water marks to restore freshness and shine.',
    features: [
      'Tile and wall scrubbing',
      'Sink and faucet descaling',
      'Toilet deep sanitization',
      'Mirror and glass cleaning',
      'Floor scrubbing and mopping',
      'Removal of hard water stains'
    ],
    highlight: '100% Germ-Free & Fresh Fragrance Guaranteed',
    image_url: '/images/bathroom.png'
  },
  { 
    id: 'svc-2', 
    name: 'Fridge Cleaning', 
    price: 299,
    originalPrice: 399,
    unit: 'per fridge', 
    category: 'Appliances', 
    icon_name: 'fridge', 
    is_active: true,
    description: 'Ensure your refrigerator stays hygienic and odor-free with our deep cleaning service.',
    features: [
      'Shelf removal and cleaning',
      'Interior sanitization',
      'Odor removal',
      'Door and gasket cleaning',
      'Exterior polishing'
    ],
    highlight: 'Odor-Free & Food-Safe Cleaning',
    image_url: '/images/fridge.png'
  },
  { 
    id: 'svc-3', 
    name: 'Utensils Cleaning', 
    price: 149,
    originalPrice: 249,
    unit: 'per session', 
    category: 'Kitchen', 
    icon_name: 'utensils', 
    is_active: true,
    description: 'Get sparkling clean utensils with our efficient and hygienic washing service.',
    features: [
      'Dishwashing with eco-friendly liquids',
      'Oil and stain removal',
      'Stainless steel polishing',
      'Hygienic drying'
    ],
    highlight: 'Shiny & Germ-Free Utensils',
    image_url: '/images/utensils.png'
  },
  { 
    id: 'svc-4', 
    name: 'Kitchen Prep Help', 
    price: 199,
    originalPrice: 299,
    unit: 'per session', 
    category: 'Kitchen', 
    icon_name: 'kitchen', 
    is_active: true,
    description: 'Get assistance with daily kitchen preparation tasks. Our professionals help you with cutting, organizing, and maintaining a clean cooking space.',
    features: [
      'Vegetable cutting and prep',
      'Ingredient organization',
      'Basic kitchen cleanup',
      'Utensil arrangement',
      'Hygienic handling'
    ],
    highlight: 'Quick & Hassle-Free Cooking Support',
    image_url: '/images/kitchen_prep.jpeg'
  },
  { 
    id: 'svc-5', 
    name: 'Dusting & Wiping', 
    price: 299,
    originalPrice: 399,
    unit: 'per session', 
    category: 'Cleaning', 
    icon_name: 'dust', 
    is_active: true,
    description: 'Remove dust and allergens from every corner of your home. Perfect for maintaining a clean and healthy living environment.',
    features: [
      'Furniture dusting',
      'Shelf and decor cleaning',
      'Electronics surface wipe',
      'Switchboards and handles cleaning',
      'Cobweb removal'
    ],
    highlight: 'Allergy-Free & Fresh Living Space',
    image_url: '/images/dusting.png'
  },
  { 
    id: 'svc-6', 
    name: 'Kitchen Cleaning', 
    price: 499,
    originalPrice: 599,
    unit: 'per session', 
    category: 'Kitchen', 
    icon_name: 'kitchen', 
    is_active: true,
    description: 'Keep your kitchen spotless and hygienic with our expert cleaning. We remove grease, oil stains, and bacteria to ensure a safe cooking space.',
    features: [
      'Stove and countertop degreasing',
      'Sink and tap cleaning',
      'Cabinet exterior cleaning',
      'Chimney exterior wipe',
      'Tile and backsplash cleaning',
      'Floor mopping'
    ],
    highlight: 'Grease-Free, Fresh & Safe Cooking Environment',
    image_url: '/images/kitchen.png'
  },
  { 
    id: 'svc-7', 
    name: 'Pre-Party Express Clean', 
    price: 799,
    originalPrice: 899,
    unit: 'per session', 
    category: 'Special', 
    icon_name: 'party', 
    is_active: true,
    description: 'Get your home party-ready with quick and efficient cleaning before guests arrive.',
    features: [
      'Quick dusting and wiping',
      'Floor cleaning',
      'Furniture arrangement',
      'Trash removal',
      'Surface polishing'
    ],
    highlight: 'Party-Ready Home in Minutes',
    image_url: '/images/pre_party.jpeg'
  },
  { 
    id: 'svc-8', 
    name: 'After-Party Cleaning', 
    price: 999,
    originalPrice: 1099,
    unit: 'per session', 
    category: 'Special', 
    icon_name: 'aftersparty', 
    is_active: true,
    description: 'Relax after your event while we take care of the mess and restore your home to its original clean state.',
    features: [
      'Trash and waste removal',
      'Floor cleaning and mopping',
      'Surface wiping',
      'Kitchen and utensil cleanup',
      'Room reset'
    ],
    highlight: 'From Mess to Fresh in No Time',
    image_url: '/images/after_party.jpeg'
  },
  { 
    id: 'svc-9', 
    name: 'Ironing & Folding', 
    price: 10, 
    originalPrice: 15,
    unit: 'per cloth', 
    category: 'Laundry', 
    icon_name: 'iron', 
    is_active: true,
    description: 'Keep your clothes neat and wrinkle-free with our professional ironing and folding service.',
    features: [
      'Clothes ironing',
      'Neat folding',
      'Fabric care handling',
      'Organized stacking',
      'Quick turnaround'
    ],
    highlight: 'Perfectly Pressed & Ready to Wear',
    image_url: '/images/ironing.jpeg'
  },
];

export const COMBOS = [
  {
    id: 'combo-1',
    name: '1 BHK Combo',
    price: 699,
    originalPrice: 899,
    includes: ['Sweeping & Mopping', 'Dusting & Wiping', '1 Bathroom Cleaning', 'Kitchen Basic Cleaning', '2 Fans Cleaning FREE'],
    badge_text: 'Best Value',
    is_popular: false,
    bhk: 1,
  },
  {
    id: 'combo-2',
    name: '2 BHK Combo',
    price: 999,
    originalPrice: 1299,
    includes: ['Full House Cleaning', '2 Bathrooms Cleaning', 'Kitchen Cleaning', 'Dusting & Wiping', '4 Fans Cleaning FREE'],
    badge_text: 'Most Popular',
    is_popular: true,
    bhk: 2,
  },
  {
    id: 'combo-3',
    name: '3 BHK Combo',
    price: 1499,
    originalPrice: 1899,
    includes: ['Full House Cleaning', '3 Bathrooms Cleaning', 'Kitchen Deep Cleaning', 'Dusting & Wiping', '6 Fans Cleaning FREE', 'Balcony Wash'],
    badge_text: 'Premium',
    is_popular: false,
    bhk: 3,
  },
];

export const SERVICE_AREAS = [
  { name: 'MVP Colony', premium: true },
  { name: 'Madhurawada', premium: true },
  { name: 'Seethammadhara', premium: false },
  { name: 'Gajuwaka', premium: false },
  { name: 'Dwaraka Nagar', premium: false },
  { name: 'Rushikonda', premium: false },
  { name: 'Gopalapatnam', premium: false },
  { name: 'Kommadi', premium: false },
  { name: 'NAD Junction', premium: false },
  { name: 'Bheemunipatnam', premium: false },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    customer_name: 'Priya Lakshmi',
    area: 'MVP Colony',
    rating: 5,
    review_text: 'SparkClean transformed my home! The team was professional and thorough. My kitchen has never been this clean. Highly recommend!',
  },
  {
    id: 't2',
    customer_name: 'Rajesh Kumar',
    area: 'Madhurawada',
    rating: 5,
    review_text: 'Booked the 2 BHK combo and was amazed. They cleaned everything including the fans for free! Will definitely book again.',
  },
  {
    id: 't3',
    customer_name: 'Sunitha Rao',
    area: 'Dwaraka Nagar',
    rating: 5,
    review_text: 'Used their after-party cleaning service and it was fantastic. The team arrived on time and left the place spotless.',
  },
  {
    id: 't4',
    customer_name: 'Venkata Subbarao',
    area: 'Seethammadhara',
    rating: 4,
    review_text: 'Very professional and eco-friendly products. My kids are safe and the house smells fresh. Great value for money.',
  },
  {
    id: 't5',
    customer_name: 'Kavitha Devi',
    area: 'Rushikonda',
    rating: 5,
    review_text: 'Outstanding service! The WhatsApp communication is so convenient. Booking was instant and they confirmed within minutes.',
  },
];

export const TIME_SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getNextNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
