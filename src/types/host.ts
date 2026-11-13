export type ChargerCategory = 
  | 'Home' 
  | 'Private Parking' 
  | 'Office' 
  | 'Commercial' 
  | 'Society' 
  | 'Dedicated Plaza'
  | 'Public';

export type HostConnectorType = 
  | 'CCS2' 
  | 'Type-2' 
  | 'LECCS' 
  | 'Bharat AC-001' 
  | 'Bharat DC-001' 
  | '16A 3-Pin' 
  | 'GB/T' 
  | 'Other';

export type ListingStatus = 'active' | 'pending' | 'paused';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type DashboardTab = 
  | 'overview' 
  | 'chargers' 
  | 'add' 
  | 'bookings' 
  | 'earnings' 
  | 'analytics' 
  | 'reviews' 
  | 'profile' 
  | 'settings';

export interface MetricTrendPoint {
  day: number;
  label: string;
  sessions: number;
  energy: number;
  revenue: number;
  cost: number;
}

export interface HostNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'payout' | 'charger' | 'alert';
}

export interface HostReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  vehicle: string;
  comment: string;
  chargerName: string;
  reply?: string;
}

export interface LiveChargingSession {
  id: string;
  chargerName: string;
  chargerImage: string;
  connectorType: string;
  powerKw: number;
  vehicleModel: string;
  licensePlate: string;
  driverName: string;
  batteryPercentage: number;
  startedAt: string;
  durationMinutes: number;
  estRemainingMinutes: number;
  currentKwhDelivered: number;
  targetKwh: number;
  currentEarnings: number;
  tariffPerKwh: number;
  status: 'charging' | 'finishing';
}

export interface HostCharger {
  id: string;
  name: string;
  category: ChargerCategory;
  connectorType: HostConnectorType;
  capacityKw: number;
  supportedVehicles?: string[];
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  pricePerKwh: number;
  minDurationMinutes: number;
  availableDays: string[];
  openingTime: string;
  closingTime: string;
  is24x7: boolean;
  images: string[];
  status: ListingStatus;
  createdAt: string;
  totalBookings: number;
  totalEarnings: number;
  rating: number;
  reviewsCount: number;
  electricalSafetyVerified?: boolean;
}

export interface MonthlyEarningsPoint {
  month: string;
  earnings: number;
  bookings: number;
}

export interface HostBooking {
  id: string;
  chargerId: string;
  chargerName: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  dateTime: string;
  timeSlot?: string;
  durationMinutes: number;
  estimatedKwh?: number;
  totalAmount?: number;
  energyKwh?: number;
  amount?: number;
  status: BookingStatus;
  bayNumber?: number;
  createdAt?: string;
}

export interface HostTransaction {
  id: string;
  bookingId: string;
  chargerName: string;
  date: string;
  grossAmount?: number;
  platformFee?: number;
  netPayout?: number;
  status: 'settled' | 'pending' | 'completed' | 'pending_payout';
  utrNumber?: string;
  payoutMethod?: string;
  amount?: number;
}

export interface HostProfile {
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  panNumber?: string;
  gstNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
  verifiedKyc?: boolean;
  avatarUrl: string;
  joinedDate?: string;
  memberSince?: string;
  city?: string;
  payoutUpi?: string;
  payoutBank?: string;
  autoAcceptBookings?: boolean;
  notificationsEmail?: boolean;
  notificationsSms?: boolean;
}
