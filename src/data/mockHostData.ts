import { HostCharger, HostBooking, HostTransaction, HostProfile, MonthlyEarningsPoint } from '../types/host';

export const INITIAL_HOST_PROFILE: HostProfile = {
  name: 'Vikramaditya Singhania',
  email: 'vikram.singhania@gocharge.in',
  phone: '+91 98201 44520',
  city: 'New Delhi, Delhi NCR',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
  payoutUpi: 'vikram.singhania@okhdfcbank',
  payoutBank: 'HDFC Bank · A/c ending 8842',
  notificationsEmail: true,
  notificationsSms: true,
  autoAcceptBookings: true,
  memberSince: 'March 2024'
};

export const INITIAL_HOST_CHARGERS: HostCharger[] = [
  {
    id: 'hc-1',
    name: 'GreenDrive Residential Fast Hub',
    category: 'Home',
    connectorType: 'CCS2',
    capacityKw: 22,
    description: 'Wall-mounted 22kW AC Fast smart charger installed in a secure, covered residential driveway. 24/7 CCTV surveillance, well-lit bay, and automated RFID unlocking.',
    address: 'B-4/12, Safdarjung Enclave, Near Deer Park',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    lat: 28.5615,
    lng: 77.1950,
    pricePerKwh: 16,
    minDurationMinutes: 30,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openingTime: '06:00',
    closingTime: '23:30',
    is24x7: false,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    createdAt: '2024-04-12',
    totalBookings: 64,
    totalEarnings: 31250,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'hc-2',
    name: 'Cyber Park Commercial DC Bay',
    category: 'Commercial',
    connectorType: 'CCS2',
    capacityKw: 60,
    description: 'High-speed 60kW DC dual-gun fast charger situated in Cyber City commercial visitors basement P1. Clean restrooms, Starbucks, and dedicated security guards.',
    address: 'DLF Cyber City, Tower C Visitor Bay, Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    lat: 28.4910,
    lng: 77.0860,
    pricePerKwh: 19,
    minDurationMinutes: 15,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openingTime: '00:00',
    closingTime: '23:59',
    is24x7: true,
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558441719-8b89814c454e?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'active',
    createdAt: '2024-06-01',
    totalBookings: 142,
    totalEarnings: 82400,
    rating: 4.8,
    reviewsCount: 89
  },
  {
    id: 'hc-3',
    name: 'EcoStay Boutique Hotel Point',
    category: 'Public',
    connectorType: 'Type-2',
    capacityKw: 11,
    description: 'Dual Type-2 11kW AC destination charger installed at boutique hotel courtyard. Free Wi-Fi, waiting lounge with artisanal coffee, and valet service.',
    address: 'Near Hauz Khas Village, Sri Aurobindo Marg',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    lat: 28.5494,
    lng: 77.2001,
    pricePerKwh: 17,
    minDurationMinutes: 45,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    openingTime: '07:00',
    closingTime: '23:00',
    is24x7: false,
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    createdAt: '2024-10-20',
    totalBookings: 12,
    totalEarnings: 5600,
    rating: 4.7,
    reviewsCount: 6
  }
];

export const INITIAL_HOST_BOOKINGS: HostBooking[] = [
  {
    id: 'bk-9041',
    chargerId: 'hc-1',
    chargerName: 'GreenDrive Residential Fast Hub',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98112 55431',
    vehicleModel: 'Tata Nexon EV Max',
    dateTime: 'Today, 2:30 PM – 4:00 PM',
    durationMinutes: 90,
    energyKwh: 28.5,
    amount: 456,
    status: 'upcoming',
    createdAt: '2024-11-02T04:30:00Z'
  },
  {
    id: 'bk-9042',
    chargerId: 'hc-2',
    chargerName: 'Cyber Park Commercial DC Bay',
    customerName: 'Kavita Chawla',
    customerPhone: '+91 97184 22091',
    vehicleModel: 'MG ZS EV',
    dateTime: 'Today, 5:00 PM – 5:45 PM',
    durationMinutes: 45,
    energyKwh: 34.0,
    amount: 646,
    status: 'upcoming',
    createdAt: '2024-11-02T05:15:00Z'
  },
  {
    id: 'bk-9038',
    chargerId: 'hc-2',
    chargerName: 'Cyber Park Commercial DC Bay',
    customerName: 'Rohan Deshmukh',
    customerPhone: '+91 99203 11840',
    vehicleModel: 'Hyundai Ioniq 5',
    dateTime: 'Yesterday, 11:00 AM – 11:40 AM',
    durationMinutes: 40,
    energyKwh: 42.2,
    amount: 802,
    status: 'completed',
    createdAt: '2024-11-01T05:20:00Z'
  },
  {
    id: 'bk-9037',
    chargerId: 'hc-1',
    chargerName: 'GreenDrive Residential Fast Hub',
    customerName: 'Priya Iyer',
    customerPhone: '+91 98450 77123',
    vehicleModel: 'Tata Punch EV',
    dateTime: 'Yesterday, 3:00 PM – 4:30 PM',
    durationMinutes: 90,
    energyKwh: 22.0,
    amount: 352,
    status: 'completed',
    createdAt: '2024-11-01T09:00:00Z'
  },
  {
    id: 'bk-9035',
    chargerId: 'hc-2',
    chargerName: 'Cyber Park Commercial DC Bay',
    customerName: 'Harsh Vardhan',
    customerPhone: '+91 94120 33918',
    vehicleModel: 'BYD Seal Performance',
    dateTime: '30 Oct 2024, 7:15 PM – 8:00 PM',
    durationMinutes: 45,
    energyKwh: 48.6,
    amount: 923,
    status: 'completed',
    createdAt: '2024-10-30T13:40:00Z'
  },
  {
    id: 'bk-9033',
    chargerId: 'hc-1',
    chargerName: 'GreenDrive Residential Fast Hub',
    customerName: 'Anil Kapoor',
    customerPhone: '+91 98200 44102',
    vehicleModel: 'Mahindra XUV400',
    dateTime: '29 Oct 2024, 10:00 AM – 11:00 AM',
    durationMinutes: 60,
    energyKwh: 18.0,
    amount: 288,
    status: 'cancelled',
    createdAt: '2024-10-29T03:00:00Z'
  }
];

export const MONTHLY_EARNINGS_DATA: MonthlyEarningsPoint[] = [
  { month: 'Jun', earnings: 14200, bookings: 32 },
  { month: 'Jul', earnings: 18450, bookings: 44 },
  { month: 'Aug', earnings: 22800, bookings: 53 },
  { month: 'Sep', earnings: 26500, bookings: 61 },
  { month: 'Oct', earnings: 31200, bookings: 75 },
  { month: 'Nov (Est)', earnings: 36100, bookings: 84 }
];

export const INITIAL_TRANSACTIONS: HostTransaction[] = [
  { id: 'tx-801', bookingId: 'bk-9038', chargerName: 'Cyber Park Commercial DC Bay', date: '01 Nov 2024', amount: 802, status: 'pending_payout', payoutMethod: 'UPI' },
  { id: 'tx-800', bookingId: 'bk-9037', chargerName: 'GreenDrive Residential Fast Hub', date: '01 Nov 2024', amount: 352, status: 'pending_payout', payoutMethod: 'Bank Transfer' },
  { id: 'tx-798', bookingId: 'bk-9035', chargerName: 'Cyber Park Commercial DC Bay', date: '30 Oct 2024', amount: 923, status: 'completed', payoutMethod: 'UPI' },
  { id: 'tx-795', bookingId: 'bk-9029', chargerName: 'Cyber Park Commercial DC Bay', date: '28 Oct 2024', amount: 740, status: 'completed', payoutMethod: 'UPI' },
  { id: 'tx-792', bookingId: 'bk-9024', chargerName: 'GreenDrive Residential Fast Hub', date: '26 Oct 2024', amount: 512, status: 'completed', payoutMethod: 'Bank Transfer' }
];

export const SAMPLE_CHARGER_PRESETS = [
  {
    name: 'Modern Wallbox AC 22kW',
    url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    tag: 'Residential Bay'
  },
  {
    name: 'Commercial Dual DC Fast 60kW',
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    tag: 'Commercial DC'
  },
  {
    name: 'Smart Compact Type-2 Pillar',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    tag: 'Pillar Mount'
  },
  {
    name: 'Solar Canopy High Power Bay',
    url: 'https://images.unsplash.com/photo-1558441719-8b89814c454e?auto=format&fit=crop&w=800&q=80',
    tag: 'Solar Canopy'
  }
];

// Reference Image Exact Breakdown:
// Available (15), Charging (21), Standby (2), Offline (4), Faulted (6), Out of Order (4)
export const MOCK_CHARGERS_STATUS_BREAKDOWN = [
  { label: 'Available', count: 15, color: '#18C5B7', secondaryColor: '#B6EDE8' },
  { label: 'Charging', count: 21, color: '#18C5B7', secondaryColor: '#B6EDE8' },
  { label: 'Standby', count: 2, color: '#88D8D0', secondaryColor: '#E2F7F5' },
  { label: 'Offline', count: 4, color: '#9CA3AF', secondaryColor: '#E5E7EB' },
  { label: 'Faulted', count: 6, color: '#94A3B8', secondaryColor: '#E2E8F0' },
  { label: 'Out of Order', count: 4, color: '#94A3B8', secondaryColor: '#E2E8F0' },
];

// 30 Days time-series data matching the reference image's tall pill bars
export const MOCK_METRIC_TREND_30D = [
  { day: 1, label: '1', sessions: 24, energy: 480, revenue: 8640, cost: 580 },
  { day: 2, label: '2', sessions: 28, energy: 530, revenue: 9540, cost: 640 },
  { day: 3, label: '3', sessions: 18, energy: 330, revenue: 5940, cost: 410 },
  { day: 4, label: '4', sessions: 22, energy: 410, revenue: 7380, cost: 500 },
  { day: 5, label: '5', sessions: 19, energy: 370, revenue: 6660, cost: 440 },
  { day: 6, label: '6', sessions: 31, energy: 600, revenue: 10800, cost: 720 },
  { day: 7, label: '7', sessions: 27, energy: 520, revenue: 9360, cost: 630 },
  { day: 8, label: '8', sessions: 25, energy: 480, revenue: 8640, cost: 580 },
  { day: 9, label: '9', sessions: 27, energy: 530, revenue: 9540, cost: 640 },
  { day: 10, label: '10', sessions: 17, energy: 330, revenue: 5940, cost: 400 },
  { day: 11, label: '11', sessions: 21, energy: 410, revenue: 7380, cost: 490 },
  { day: 12, label: '12', sessions: 19, energy: 370, revenue: 6660, cost: 450 },
  { day: 13, label: '13', sessions: 32, energy: 600, revenue: 11200, cost: 750 },
  { day: 14, label: '14', sessions: 28, energy: 530, revenue: 9540, cost: 640 },
  { day: 15, label: '15', sessions: 25, energy: 480, revenue: 8640, cost: 580 },
  { day: 16, label: '16', sessions: 27, energy: 530, revenue: 9540, cost: 640 },
  { day: 17, label: '17', sessions: 17, energy: 330, revenue: 5940, cost: 400 },
  { day: 18, label: '18', sessions: 21, energy: 410, revenue: 7380, cost: 490 },
  { day: 19, label: '19', sessions: 19, energy: 370, revenue: 6660, cost: 450 },
  { day: 20, label: '20', sessions: 32, energy: 600, revenue: 11200, cost: 750 },
  { day: 21, label: '21', sessions: 28, energy: 530, revenue: 9540, cost: 640 },
  { day: 22, label: '22', sessions: 25, energy: 480, revenue: 8640, cost: 580 },
  { day: 23, label: '23', sessions: 27, energy: 530, revenue: 9540, cost: 640 },
  { day: 24, label: '24', sessions: 16, energy: 310, revenue: 5580, cost: 380 },
  { day: 25, label: '25', sessions: 21, energy: 410, revenue: 7380, cost: 490 },
  { day: 26, label: '26', sessions: 19, energy: 370, revenue: 6660, cost: 450 },
  { day: 27, label: '27', sessions: 32, energy: 600, revenue: 11200, cost: 750 },
  { day: 28, label: '28', sessions: 28, energy: 530, revenue: 9540, cost: 640 },
  { day: 29, label: '29', sessions: 33, energy: 620, revenue: 11800, cost: 780 },
  { day: 30, label: '30', sessions: 29, energy: 540, revenue: 9800, cost: 660 },
];

export const MOCK_METRIC_TREND_7D = MOCK_METRIC_TREND_30D.slice(-7);

export const MOCK_METRIC_TREND_90D = [
  { day: 1, label: 'Sep 1-15', sessions: 360, energy: 6800, revenue: 122400, cost: 8200 },
  { day: 2, label: 'Sep 16-30', sessions: 385, energy: 7200, revenue: 129600, cost: 8700 },
  { day: 3, label: 'Oct 1-15', sessions: 420, energy: 7900, revenue: 142200, cost: 9500 },
  { day: 4, label: 'Oct 16-31', sessions: 460, energy: 8700, revenue: 156600, cost: 10400 },
  { day: 5, label: 'Nov 1-15', sessions: 495, energy: 9400, revenue: 169200, cost: 11300 },
  { day: 6, label: 'Nov 16-30', sessions: 520, energy: 9900, revenue: 178200, cost: 11900 },
];

// Live Charging Session Widget
export const MOCK_LIVE_SESSION = {
  id: 'ses-live-402',
  chargerName: 'Cyber Park DC Bay - Gun 01',
  chargerImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
  connectorType: 'CCS2 Fast DC',
  powerKw: 60,
  vehicleModel: 'Tata Nexon EV Max',
  licensePlate: 'DL 01 EV 8920',
  driverName: 'Siddharth Rao',
  batteryPercentage: 74,
  startedAt: '11:42 AM',
  durationMinutes: 28,
  estRemainingMinutes: 14,
  currentKwhDelivered: 24.8,
  targetKwh: 35.0,
  currentEarnings: 471.20,
  tariffPerKwh: 19.0,
  status: 'charging' as const,
};

export const INITIAL_HOST_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Booking Reserved',
    message: 'Aarav Mehta booked GreenDrive Residential Bay for 2:30 PM today.',
    time: '12m ago',
    read: false,
    type: 'booking' as const,
  },
  {
    id: 'notif-2',
    title: 'Weekly Payout Processed',
    message: '₹8,266 credited to UPI •••• 9821 via HDFC Bank auto-settlement.',
    time: '2h ago',
    read: false,
    type: 'payout' as const,
  },
  {
    id: 'notif-3',
    title: 'Charger Firmware Updated',
    message: 'Cyber Park Commercial DC Bay updated to OCPP 2.0.1 successfully.',
    time: '1d ago',
    read: true,
    type: 'charger' as const,
  },
  {
    id: 'notif-4',
    title: '5-Star Review Received',
    message: '"Very smooth access and super clean driveway" — Kavita C.',
    time: '2d ago',
    read: true,
    type: 'alert' as const,
  },
];

export const INITIAL_HOST_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Aarav Mehta',
    rating: 5,
    date: 'Yesterday, 4:15 PM',
    vehicle: 'Tata Nexon EV Max',
    comment: 'Top tier charging bay! Very clear directions, RFID auto-activated immediately, and the host was super welcoming.',
    chargerName: 'GreenDrive Residential Fast Hub',
    reply: 'Thank you Aarav! Happy to host you anytime you are around Safdarjung.',
  },
  {
    id: 'rev-2',
    author: 'Kavita Chawla',
    rating: 5,
    date: '31 Oct 2024',
    vehicle: 'MG ZS EV',
    comment: 'The 60kW DC gun charged my ZS EV from 20% to 80% in just 32 minutes while I grabbed a coffee at Starbucks.',
    chargerName: 'Cyber Park Commercial DC Bay',
    reply: 'Great to hear Kavita! The basement security makes it effortless.',
  },
  {
    id: 'rev-3',
    author: 'Rohan Deshmukh',
    rating: 4,
    date: '28 Oct 2024',
    vehicle: 'Hyundai Ioniq 5',
    comment: 'Fast charging speeds sustained throughout the session. App check-in was seamless.',
    chargerName: 'Cyber Park Commercial DC Bay',
  },
];
