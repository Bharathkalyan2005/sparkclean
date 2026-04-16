# SparkClean Platform Documentation

Welcome to the comprehensive documentation for the **SparkClean** service booking platform. SparkClean is a modern, 3D-animated, full-stack web application tailored for a home cleaning business based in Visakhapatnam (Vizag), India. This platform is designed to convert high-end residential clients with a premium look, transparent pricing, and instant booking capabilities.

## 🌟 Project Overview

### Business Objective
To provide a fast, reliable, and transparent digital avenue for homeowners in Vizag (specifically premium areas like MVP Colony, Madhurawada, and Seethammadhara) to book professional cleaning services. The platform solves the lack of reliable local cleaners by offering verified professionals, eco-friendly products, and a highly polished digital user experience.

### Key Features
*   **Immersive 3D Experience:** A hero section powered by Three.js rendering floating bubbles, a mop, spray bottle, and a robust particle system to communicate "cleaning" instantly.
*   **Intuitive Booking Flow:** A 3-step dynamic booking process (Selection → User Details → Payment) optimized for mobile devices.
*   **Payment Gateway Integration:** Integrated with Razorpay to support UPI, Cards, and Wallets, capturing the Indian payments ecosystem seamlessly. Includes a "Pay at Doorstep" fallback.
*   **Admin Dashboard:** A secured dashboard (`/sparkadmin`) for business owners to track bookings, view financial analytics (charts via Recharts), and export data via CSV.
*   **Realtime Backend:** Supabase handles PostgreSQL data storage and authentication.
*   **WhatsApp Automation:** Automatic redirection to WhatsApp with pre-filled booking details for manual confirmation and relationship building.

---

## 🛠 Tech Stack

The application uses an uncompromising modern stack for high performance and premium aesthetics.

*   **Frontend Framework:** React 18 with TypeScript.
*   **Styling:** Tailwind CSS v3 augmented with custom vanilla CSS for glassmorphism utilities (`glass`, `glass-dark`, `glass-teal`) and custom animations.
*   **3D & Animations:**
    *   **Three.js:** Dedicated WebGL scene for the Hero component (`HeroScene.tsx`).
    *   **GSAP:** Powerful scroll-triggered text animations (`Hero.tsx`).
    *   **Framer Motion:** Used for fluid route transitions, component entry animations, and the animated loading screen.
*   **Backend as a Service:** Supabase (Auth + PostgreSQL Database).
*   **Payments:** Razorpay.
*   **Routing:** React Router v6.
*   **Data Visualization:** Recharts (Admin Dashboard).

---

## 📁 Project Structure

```text
sparkclean/
├── public/                 # Static assets and index.html
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── LoadingScreen (App loader)
│   │   ├── Navbar & Footer
│   │   ├── CartSidebar (Global cart state UI)
│   │   ├── HeroScene (Three.js integration)
│   │   └── Specific landing page sections (Hero, Combos, WhySparkClean, etc.)
│   ├── context/
│   │   └── CartContext.tsx # Context Provider for cart state management structure
│   ├── data/
│   │   └── services.ts     # Centralized constants, services catalogue, and combos
│   ├── lib/
│   │   └── supabase.ts     # Supabase client initialization & Database logic
│   ├── pages/
│   │   ├── HomePage.tsx    # Assembles landing page sections
│   │   ├── BookingPage.tsx # The 3-step checkout wizard
│   │   ├── SuccessPage.tsx # Confetti validation screen
│   │   └── AdminPage.tsx   # Secured CRM/Stats page
│   ├── App.tsx             # Root component with routing
│   ├── index.css           # Global custom CSS, Variables, Glassmorphism, Animations
│   └── index.tsx           # Entry point
├── vercel.json             # Vercel deployment rewrite rules
└── package.json            # Project dependencies
```

---

## 🔧 Setup & Installation

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn
*   A Supabase Account
*   A Razorpay Account

### 1. Local Development Setup

Clone the repository and install dependencies:

```bash
git clone <repository_url>
cd sparkclean
npm install
```

### 2. Environment Variables

Create a `.env` file at the root of the project to match the `.env.example` structure. You will need the following keys:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_test_or_live_key
```

### 3. Database Schema setup (Supabase)

You need to run the following SQL inside the Supabase SQL editor to create the `bookings` table:

```sql
-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    area TEXT NOT NULL,
    services JSONB NOT NULL,
    total_price NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    payment_id TEXT,
    scheduled_date TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Ensure Row Level Security (RLS) is disabled for anon inserts OR
-- create appropriate policies so unauthenticated users can insert bookings.
```

### 4. Running the App

Start the development server:

```bash
npm start
```
The application will be accessible at `http://localhost:3000`.

---

## 🚀 Deployment (Vercel)

The application is fully optimized for deployment on Vercel. A `vercel.json` file is included in the project root to ensure React Router client-side routing works correctly by preventing 404 errors on direct navigation.

1.  Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Log in to [Vercel](https://vercel.com/) and create a "New Project".
3.  Import the SparkClean repository.
4.  **Crucial Step:** In the Vercel project configuration, expand "Environment Variables" and inject:
    *   `REACT_APP_SUPABASE_URL`
    *   `REACT_APP_SUPABASE_ANON_KEY`
    *   `REACT_APP_RAZORPAY_KEY_ID`
5.  Click **Deploy**.

Vercel will detect `Create React App`, build the optimized production bundle (`npm run build`), and host it automatically.

---

## 🎨 UI/UX Design System

The visual design is critical to the "premium" feel requested. It strictly avoids bootstrap/generic themes by utilizing custom CSS properties.

*   **Color Palette:**
    *   Deep Navy Background (`#0A1628` to `#07101E`) representing trust and depth.
    *   Vibrant Teal (`#0AFFE6` and `#00CDB7`) representing clean water, sparkling surfaces, and active calls-to-action.
*   **Typography:**
    *   _Syne_: Used for bold, distinctive stylized headers.
    *   _DM Sans_: Used for legible, clean body copy and UI elements.
*   **Glassmorphism:** Almost all cards (`.glass`, `.glass-dark`, `.glass-teal`) use translucent white/teal backgrounds coupled with CSS `backdrop-filter: blur()`. This creates a layered, modern OS-like interface.

---

## 🛡 Business Operations & Admin

*   **Access the Admin Panel:** Navigate to `/sparkadmin`.
*   **Credentials:** Ensure you create an initial user in Supabase Authentication, or use the exact placeholder values mentioned in `AdminPage.tsx` logic if hardcoding a bypass. The admin panel leverages real Supabase `signInWithPassword`.
*   **Dashboard Features:**
    *   KPI cards (Today's bookings, Total Revenue, Pending Jobs).
    *   Interactive charts (Revenue over 7 days).
    *   Status toggling (Pending -> Confirmed -> Completed).
    *   **CSV Export** for accounting and record keeping.

## 📞 Support & Maintenance

All business parameters (Prices, Service categories, Combos, Areas) are centralized in `src/data/services.ts`. To change prices, add a new service, or introduce a Diwali offer, modify `services.ts` — changes will instantly propagate across the UI, checkout flow, and backend payload logic.
