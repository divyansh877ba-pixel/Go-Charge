import { VehicleModel } from '../data/vehicles';

export type StationStatus = 'available' | 'busy' | 'partial';

export interface Connector {
  id: string;
  type: 'CCS2' | 'Type-2' | 'Bharat AC' | 'Bharat AC-001' | 'Bharat DC-001' | 'LECCS' | '16A 3-Pin' | 'Ola Hypercharger' | 'CHAdeMO' | string;
  powerKw: number;
  speedType: 'DC Ultra Fast' | 'DC Fast' | 'AC Normal' | 'AC Fast' | string;
  status: 'free' | 'in-use';
  portNumber: number;
  estimatedFreeInMin?: number;
}

export interface StationReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  vehicle: string;
  comment: string;
}

export type ChargerCategory = 
  | 'Home' 
  | 'Private Parking' 
  | 'Office' 
  | 'Commercial' 
  | 'Society' 
  | 'Dedicated Plaza';

export interface HostInfo {
  name: string;
  type: 'Verified Private Host' | 'Commercial Operator' | 'Community Co-Op' | 'Residential Host';
  phone?: string;
  rating: number;
  memberSince: string;
  responseRate: string;
  verifiedElectrical: boolean;
}

export interface Station {
  id: string;
  name: string;
  area: string;
  fullAddress: string;
  lat: number;
  lng: number;
  status: StationStatus;
  availablePorts: number;
  totalPorts: number;
  connectors: Connector[];
  pricePerKwh: number;
  minSessionFee: number;
  rating: number;
  reviewsCount: number;
  hours: string;
  is24x7: boolean;
  vehicleTypes: ('4-Wheeler' | '2-Wheeler')[];
  powerSpeed: string; // e.g. "50 kW DC Fast"
  primaryConnectors: string[]; // e.g. ["CCS2", "Type-2"]
  estimatedFullChargeCost: number; // e.g. ₹360
  reviews: StationReview[];
  amenities: string[];
  operator: string;
  
  // Go Charge India & Community enhancements
  chargerCategory?: ChargerCategory;
  hostInfo?: HostInfo;
  verifiedCompatibility?: boolean;
  supportedModels?: string[];
  city?: string;
  state?: string;
  pincode?: string;
  photos?: string[];
  isMock?: boolean;
  source?: 'database' | 'mock';
}

export type FilterCategory = 
  | 'All'
  | 'Compatible with my vehicle'
  | '4-Wheeler'
  | '2-Wheeler'
  | 'AC'
  | 'DC'
  | 'Type-2'
  | 'CCS2'
  | 'Bharat AC'
  | 'LECCS'
  | 'Fast Charge 50kW+'
  | 'Available Now';

export type SortOption = 'distance' | 'rating' | 'price' | 'speed';

export interface FilterState {
  activeCategory: FilterCategory;
  selectedVehicle: VehicleModel | null;
  onlyCompatible: boolean;
  connectors: string[];
  speedType: 'all' | 'ac' | 'dc' | 'fast';
  onlyAvailable: boolean;
  only24x7: boolean;
  maxPrice: number;
  maxDistanceKm: number;
}
