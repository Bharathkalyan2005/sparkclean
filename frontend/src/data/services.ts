

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
