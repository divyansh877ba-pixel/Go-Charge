# ⚡ Go Charge — Community EV Charging Platform & SaaS Dashboard

A modern, high-performance EV charging platform and dual-role SaaS application engineered with a clean, responsive design, real-time telemetry, dual-theme support (Light & Dark mode), two-way role-based authentication, interactive map discovery, and comprehensive dashboards for both **EV Drivers (Consumers)** and **Charger Owners (Hosts)**.

---

## 🚀 Key Features

### 1. Two-Way Role-Based Authentication
- **Dual-Option Login Interface**: Distinct cards for **Consumer** ("Find a Charger") and **Charger Owner** ("Manage Your Chargers").
- **1-Click Demo Profiles**:
  - `Rahul Sharma` (Consumer / Driver)
  - `Vikramaditya Singhania` (Host / Charger Owner)
- **Multi-Method Auth**: Email & Password, Phone OTP simulation, Google OAuth integration readiness.
- **Role Isolation & Protection**: Protected route guards prevent unauthorized access between driver and host portals.

### 2. Charger Owner SaaS Dashboard (`/owner-dashboard`)
- **Executive KPI Cards**: Total Sessions, Revenue in INR, Energy Delivered (kWh), Operating Cost.
- **Charger Status Breakdown**: Live tracking of Available, Charging, Standby, Offline, Faulted, and Out of Order ports.
- **Interactive Daily Revenue Charts**: Filterable by 7D, 30D, and 90D timeframes.
- **Live Charging Session Telemetry**: Real-time power draw (kW), vehicle SoC (%), remaining time, and session revenue.
- **Charger Management**: Add, pause/resume, edit, and monitor listed charging hardware.
- **Recent Bookings & Payouts**: Real-time driver reservations, monthly revenue targets, and auto-settlements.

### 3. Consumer Portal & EV Garage (`/consumer/dashboard`)
- **Charging Passes**: Upcoming session details with 4-digit unlock OTP and QR code pass.
- **My Bookings**: Filterable tabbed view (All, Upcoming, Completed, Cancelled) with navigation and receipts.
- **EV Garage**: Multi-vehicle registry supporting Indian EV cars and scooters (Tata, MG, Mahindra, Ather, Ola) with connector compatibility standards (CCS2, Type-2, LECCS, Bharat AC/DC).
- **Saved Chargers**: Bookmarked charging stations with live port availability and directions.
- **Quick Actions**: One-click shortcut to launch the interactive live charging map.

### 4. Interactive Live Map & Discovery (`/map`)
- **High-Performance Map**: MapLibre / Leaflet integration with custom pulse pins and real-time status.
- **Smart Vehicle Filtering**: Automatically filters charging stations compatible with the user's active EV.
- **Station Detail Pages**: Connectors, pricing per kWh, host info, reviews, and route navigation.

---

## 🎨 Theme Support
- **Light Theme**: Warm cream/off-white background (`#F8F7F2`) with deep forest green accents (`#073B35`) and vibrant teal highlights (`#18C5B7`).
- **Dark Theme**: Deep dark teal/slate background (`#071715`) with high-contrast emerald/teal glowing accents.
- Seamless, instant toggle across all pages via the top header theme button.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Maps**: Leaflet / MapLibre

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```
