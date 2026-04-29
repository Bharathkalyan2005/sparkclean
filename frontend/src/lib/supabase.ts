import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Booking {
  id?: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string;
  services: Service[];
  total_price: number;
  payment_method: 'razorpay' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  icon_name: string;
  is_active: boolean;
  quantity?: number;
  description?: string;
  features?: string[];
  highlight?: string;
  image_url?: string;
}

export interface Combo {
  id: string;
  name: string;
  price: number;
  includes: string[];
  badge_text: string;
  is_popular: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  area: string;
  rating: number;
  review_text: string;
  created_at: string;
}
