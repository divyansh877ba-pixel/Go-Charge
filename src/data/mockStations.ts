import { Station } from '../types';

export const USER_CURRENT_LOCATION = {
  lat: 28.6139,
  lng: 77.2090,
  name: 'Connaught Place, New Delhi (Default Location)'
};

export const INDIAN_CITIES_COORDINATES: { [cityName: string]: { lat: number; lng: number; zoom: number; state: string } } = {
  'delhi': { lat: 28.6139, lng: 77.2090, zoom: 11.5, state: 'Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.2090, zoom: 12, state: 'Delhi' },
  'noida': { lat: 28.5355, lng: 77.3910, zoom: 12, state: 'Uttar Pradesh' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, zoom: 12, state: 'Haryana' },
  'gurugram': { lat: 28.4595, lng: 77.0266, zoom: 12, state: 'Haryana' },
  'mumbai': { lat: 19.0760, lng: 72.8777, zoom: 11.5, state: 'Maharashtra' },
  'pune': { lat: 18.5204, lng: 73.8567, zoom: 12, state: 'Maharashtra' },
  'nagpur': { lat: 21.1458, lng: 79.0882, zoom: 12, state: 'Maharashtra' },
  'nashik': { lat: 19.9975, lng: 73.7898, zoom: 12, state: 'Maharashtra' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 11.5, state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lng: 77.5946, zoom: 11.5, state: 'Karnataka' },
  'mysuru': { lat: 12.2958, lng: 76.6394, zoom: 12, state: 'Karnataka' },
  'mangaluru': { lat: 12.9141, lng: 74.8560, zoom: 12, state: 'Karnataka' },
  'chennai': { lat: 13.0827, lng: 80.2707, zoom: 11.5, state: 'Tamil Nadu' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, zoom: 12, state: 'Tamil Nadu' },
  'madurai': { lat: 9.9252, lng: 78.1198, zoom: 12, state: 'Tamil Nadu' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 11.5, state: 'Telangana' },
  'warangal': { lat: 17.9689, lng: 79.5941, zoom: 12, state: 'Telangana' },
  'kolkata': { lat: 22.5726, lng: 88.3639, zoom: 11.5, state: 'West Bengal' },
  'siliguri': { lat: 26.7271, lng: 88.4312, zoom: 12, state: 'West Bengal' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, zoom: 11.5, state: 'Gujarat' },
  'surat': { lat: 21.1702, lng: 72.8311, zoom: 12, state: 'Gujarat' },
  'vadodara': { lat: 22.3072, lng: 73.1812, zoom: 12, state: 'Gujarat' },
  'jaipur': { lat: 26.9124, lng: 75.7873, zoom: 12, state: 'Rajasthan' },
  'udaipur': { lat: 24.5854, lng: 73.7125, zoom: 12, state: 'Rajasthan' },
  'jodhpur': { lat: 26.2389, lng: 73.0243, zoom: 12, state: 'Rajasthan' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, zoom: 12, state: 'Chandigarh' },
  'lucknow': { lat: 26.8467, lng: 80.9462, zoom: 12, state: 'Uttar Pradesh' },
  'kanpur': { lat: 26.4499, lng: 80.3319, zoom: 12, state: 'Uttar Pradesh' },
  'varanasi': { lat: 25.3176, lng: 82.9739, zoom: 12, state: 'Uttar Pradesh' },
  'agra': { lat: 27.1767, lng: 78.0081, zoom: 12, state: 'Uttar Pradesh' },
  'kochi': { lat: 9.9312, lng: 76.2673, zoom: 12, state: 'Kerala' },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, zoom: 12, state: 'Kerala' },
  'indore': { lat: 22.7196, lng: 75.8577, zoom: 12, state: 'Madhya Pradesh' },
  'bhopal': { lat: 23.2599, lng: 77.4126, zoom: 12, state: 'Madhya Pradesh' },
  'patna': { lat: 25.5941, lng: 85.1376, zoom: 12, state: 'Bihar' },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, zoom: 12, state: 'Odisha' },
  'raipur': { lat: 21.2514, lng: 81.6296, zoom: 12, state: 'Chhattisgarh' },
  'ranchi': { lat: 23.3441, lng: 85.3096, zoom: 12, state: 'Jharkhand' },
  'guwahati': { lat: 26.1445, lng: 91.7362, zoom: 12, state: 'Assam' },
  'shimla': { lat: 31.1048, lng: 77.1734, zoom: 12, state: 'Himachal Pradesh' },
  'manali': { lat: 32.2396, lng: 77.1887, zoom: 12, state: 'Himachal Pradesh' },
  'dehradun': { lat: 30.3165, lng: 78.0322, zoom: 12, state: 'Uttarakhand' },
  'rishikesh': { lat: 30.0869, lng: 78.2676, zoom: 12, state: 'Uttarakhand' },
  'panaji': { lat: 15.4909, lng: 73.8278, zoom: 12, state: 'Goa' },
  'goa': { lat: 15.2993, lng: 74.1240, zoom: 10.5, state: 'Goa' },
  'srinagar': { lat: 34.0837, lng: 74.7973, zoom: 12, state: 'Jammu and Kashmir' },
  'jammu': { lat: 32.7266, lng: 74.8570, zoom: 12, state: 'Jammu and Kashmir' },
  'leh': { lat: 34.1526, lng: 77.5771, zoom: 12, state: 'Ladakh' },
  'puducherry': { lat: 11.9416, lng: 79.8083, zoom: 12, state: 'Puducherry' },
  'amritsar': { lat: 31.6340, lng: 74.8723, zoom: 12, state: 'Punjab' },
  'ludhiana': { lat: 30.9010, lng: 75.8573, zoom: 12, state: 'Punjab' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, zoom: 12, state: 'Andhra Pradesh' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, zoom: 12, state: 'Andhra Pradesh' },
  'gangtok': { lat: 27.3389, lng: 88.6065, zoom: 12, state: 'Sikkim' },
  'shillong': { lat: 25.5788, lng: 91.8933, zoom: 12, state: 'Meghalaya' },
  'agartala': { lat: 23.8315, lng: 91.2868, zoom: 12, state: 'Tripura' },
  'imphal': { lat: 24.8170, lng: 93.9368, zoom: 12, state: 'Manipur' },
  'kohima': { lat: 25.6751, lng: 94.1086, zoom: 12, state: 'Nagaland' },
  'itanagar': { lat: 27.0844, lng: 93.6053, zoom: 12, state: 'Arunachal Pradesh' },
  'aizawl': { lat: 23.7271, lng: 92.7176, zoom: 12, state: 'Mizoram' },
  'port blair': { lat: 11.6234, lng: 92.7265, zoom: 12, state: 'Andaman and Nicobar Islands' },
  'daman': { lat: 20.3974, lng: 72.8328, zoom: 12, state: 'Dadra and Nagar Haveli and Daman and Diu' },
  'silvassa': { lat: 20.2763, lng: 73.0083, zoom: 12, state: 'Dadra and Nagar Haveli and Daman and Diu' },
  'kavaratti': { lat: 10.5667, lng: 72.6417, zoom: 12, state: 'Lakshadweep' }
};

export const MOCK_STATIONS: Station[] = [
  // ==========================================
  // 1. NATIONAL CAPITAL REGION (DELHI NCR) - DEFAULT
  // ==========================================
  {
    id: 'st-delhi-1',
    name: 'Tata Power EZ Charge - Connaught Place',
    area: 'Connaught Place, New Delhi',
    fullAddress: 'Inner Circle, Near Block B & Palika Bazar, Connaught Place, New Delhi, DL 110001',
    lat: 28.6315,
    lng: 77.2167,
    status: 'available',
    availablePorts: 4,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 214,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    chargerCategory: 'Dedicated Plaza',
    verifiedCompatibility: true,
    hostInfo: {
      name: 'Tata Power Mobility',
      type: 'Commercial Operator',
      phone: '+91 1800 209 5161',
      rating: 4.9,
      memberSince: '2021',
      responseRate: '99%',
      verifiedElectrical: true
    },
    amenities: ['Café', 'Restrooms', 'Free Wi-Fi', 'Illuminated Bay', 'Security'],
    connectors: [
      { id: 'c-del-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 4 },
    ],
    reviews: [
      { id: 'r-del-1', author: 'Rohan Mehra', rating: 5, date: 'Yesterday', vehicle: 'Tata Nexon EV Max', comment: 'Super convenient location right in CP. 60kW steady output without any throttling.' },
      { id: 'r-del-2', author: 'Simran Chadha', rating: 5, date: '3 days ago', vehicle: 'MG ZS EV', comment: 'Security guards are helpful in keeping non-EVs out of the bays.' },
    ]
  },
  {
    id: 'st-delhi-ather-1',
    name: 'Ather Grid & LECCS Fast Hub - Green Park',
    area: 'Green Park Market, South Delhi',
    fullAddress: 'Main Market Near Metro Gate 2, Green Park, New Delhi, DL 110016',
    lat: 28.5589,
    lng: 77.2062,
    status: 'available',
    availablePorts: 3,
    totalPorts: 3,
    pricePerKwh: 15,
    minSessionFee: 25,
    rating: 4.8,
    reviewsCount: 176,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['2-Wheeler'],
    powerSpeed: 'LECCS DC Fast · 3.3 kW',
    primaryConnectors: ['LECCS', 'Bharat AC-001'],
    estimatedFullChargeCost: 45,
    operator: 'Ather Energy & Go Charge Partner',
    chargerCategory: 'Commercial',
    verifiedCompatibility: true,
    hostInfo: {
      name: 'Green Park EV Co-Op',
      type: 'Verified Private Host',
      phone: '+91 98112 45890',
      rating: 4.8,
      memberSince: '2023',
      responseRate: '98%',
      verifiedElectrical: true
    },
    amenities: ['2-Wheeler Dedicated Bay', 'Café', 'Air Pump', 'Illuminated'],
    connectors: [
      { id: 'c-ath-1', type: 'LECCS', powerKw: 3.3, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ath-2', type: 'LECCS', powerKw: 3.3, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ath-3', type: 'Bharat AC-001', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 3 },
    ],
    reviews: [
      { id: 'r-ath-1', author: 'Kunal Verma', rating: 5, date: 'Yesterday', vehicle: 'Ather 450X', comment: 'Charges 80% in 45 mins on LECCS. Interoperable with Vida as well.' },
      { id: 'r-ath-2', author: 'Priya Narang', rating: 5, date: '4 days ago', vehicle: 'Hero Vida V1', comment: 'Connected immediately with my Vida V1. Great community location.' }
    ]
  },
  {
    id: 'st-delhi-ola-1',
    name: 'Ola Hypercharger Hub - Lajpat Nagar',
    area: 'Lajpat Nagar Central Market, South Delhi',
    fullAddress: 'Ring Road Service Lane, Block C, Lajpat Nagar II, New Delhi, DL 110024',
    lat: 28.5700,
    lng: 77.2435,
    status: 'available',
    availablePorts: 4,
    totalPorts: 4,
    pricePerKwh: 16,
    minSessionFee: 30,
    rating: 4.7,
    reviewsCount: 132,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['2-Wheeler'],
    powerSpeed: 'Ola Fast DC · 6 kW',
    primaryConnectors: ['Ola Hypercharger', 'Bharat AC-001', '16A 3-Pin'],
    estimatedFullChargeCost: 55,
    operator: 'Ola Electric Network',
    chargerCategory: 'Commercial',
    verifiedCompatibility: true,
    hostInfo: {
      name: 'Lajpat Mobility Plaza',
      type: 'Commercial Operator',
      phone: '+91 1800 120 555',
      rating: 4.7,
      memberSince: '2022',
      responseRate: '95%',
      verifiedElectrical: true
    },
    amenities: ['Market Access', '24/7 CCTV', 'Covered Shed', 'Air Station'],
    connectors: [
      { id: 'c-ola-1', type: 'Ola Hypercharger', powerKw: 6.0, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ola-2', type: 'Ola Hypercharger', powerKw: 6.0, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ola-3', type: 'Bharat AC-001', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 3 },
      { id: 'c-ola-4', type: '16A 3-Pin', powerKw: 2.5, speedType: 'AC Normal', status: 'free', portNumber: 4 },
    ],
    reviews: [
      { id: 'r-ola-1', author: 'Sameer Sheikh', rating: 5, date: '2 days ago', vehicle: 'Ola S1 Pro', comment: 'Added 50km range in under 18 minutes while grabbing tea.' }
    ]
  },
  {
    id: 'st-delhi-home-1',
    name: 'Sharma’s Community EV Haven - Hauz Khas',
    area: 'Hauz Khas Enclave, South Delhi',
    fullAddress: 'B-4/22 Hauz Khas Enclave, Near Aurobindo Place, New Delhi, DL 110016',
    lat: 28.5494,
    lng: 77.2001,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 14,
    minSessionFee: 20,
    rating: 5.0,
    reviewsCount: 64,
    hours: '6 AM – 11 PM',
    is24x7: false,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'AC Fast · 7.4 kW + 16A',
    primaryConnectors: ['Type-2', '16A 3-Pin', 'Bharat AC-001'],
    estimatedFullChargeCost: 260,
    operator: 'Private Host (Go Charge Community)',
    chargerCategory: 'Home',
    verifiedCompatibility: true,
    hostInfo: {
      name: 'Anand Sharma',
      type: 'Verified Private Host',
      phone: '+91 98101 87654',
      rating: 5.0,
      memberSince: '2023',
      responseRate: '100% within 5 min',
      verifiedElectrical: true
    },
    amenities: ['Private Driveway Parking', 'CCTV Guarded', 'Clean Drinking Water', 'CEA Safety Certified'],
    connectors: [
      { id: 'c-home-1', type: 'Type-2', powerKw: 7.4, speedType: 'AC Fast', status: 'free', portNumber: 1 },
      { id: 'c-home-2', type: '16A 3-Pin', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-home-1', author: 'Aditya Roy', rating: 5, date: '3 days ago', vehicle: 'MG Comet EV', comment: 'The host Mr. Sharma was super welcoming. Perfect 7.4kW AC charging for my Comet.' },
      { id: 'r-home-2', author: 'Pooja Iyer', rating: 5, date: '1 week ago', vehicle: 'TVS iQube', comment: 'Clean 16A socket, very safe residential environment.' }
    ]
  },
  {
    id: 'st-delhi-society-1',
    name: 'Gulmohar Park Society EV Station',
    area: 'Gulmohar Park, South Delhi',
    fullAddress: 'RWA Central Community Gate 3, Gulmohar Park, New Delhi, DL 110049',
    lat: 28.5630,
    lng: 77.2140,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 15,
    minSessionFee: 30,
    rating: 4.8,
    reviewsCount: 92,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'Bharat AC-001 · 10 kW (3x 3.3kW)',
    primaryConnectors: ['Bharat AC-001', 'Type-2', '16A 3-Pin'],
    estimatedFullChargeCost: 190,
    operator: 'Gulmohar Park RWA & Go Charge',
    chargerCategory: 'Society',
    verifiedCompatibility: true,
    hostInfo: {
      name: 'Gulmohar Park RWA',
      type: 'Community Co-Op',
      phone: '+91 11 2656 7890',
      rating: 4.8,
      memberSince: '2023',
      responseRate: '97%',
      verifiedElectrical: true
    },
    amenities: ['Gated Society Entry', '24/7 Security Guard', 'Illuminated', 'App Payment'],
    connectors: [
      { id: 'c-soc-1', type: 'Bharat AC-001', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 1 },
      { id: 'c-soc-2', type: 'Bharat AC-001', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 2 },
      { id: 'c-soc-3', type: 'Type-2', powerKw: 7.4, speedType: 'AC Fast', status: 'free', portNumber: 3 },
      { id: 'c-soc-4', type: '16A 3-Pin', powerKw: 2.5, speedType: 'AC Normal', status: 'in-use', portNumber: 4, estimatedFreeInMin: 45 },
    ],
    reviews: [
      { id: 'r-soc-1', author: 'Tarun Joshi', rating: 5, date: '5 days ago', vehicle: 'Bajaj Chetak', comment: 'Society guard was briefed on Go Charge bookings. Hassle-free entry.' }
    ]
  },
  {
    id: 'st-delhi-2',
    name: 'Statiq EV Charging Hub - Aerocity',
    area: 'Aerocity, New Delhi',
    fullAddress: 'Worldmark 1 Underground Parking P2, Asset Area 8, Hospitality District, Aerocity, New Delhi, DL 110037',
    lat: 28.5524,
    lng: 77.1215,
    status: 'available',
    availablePorts: 5,
    totalPorts: 6,
    pricePerKwh: 19,
    minSessionFee: 60,
    rating: 4.8,
    reviewsCount: 189,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Statiq',
    amenities: ['Airport Linked', 'Food Court', 'Restrooms', 'Valet Assisted'],
    connectors: [
      { id: 'c-del-5', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-6', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-8', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 4 },
      { id: 'c-del-9', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 5 },
      { id: 'c-del-10', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 6, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-del-3', author: 'Vikram Batra', rating: 5, date: '2 days ago', vehicle: 'BYD Seal', comment: 'Peak 118kW reached on my Seal. Best airport transit charging station.' }
    ]
  },
  {
    id: 'st-delhi-3',
    name: 'Jio-bp pulse - Select Citywalk Mall',
    area: 'Saket, South Delhi',
    fullAddress: 'Select Citywalk Underground P1, District Centre, Saket, New Delhi, DL 110017',
    lat: 28.5283,
    lng: 77.2195,
    status: 'partial',
    availablePorts: 2,
    totalPorts: 4,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.7,
    reviewsCount: 156,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Jio-bp pulse',
    amenities: ['Mall Access', 'Cafés', 'Covered Parking', 'Restrooms'],
    connectors: [
      { id: 'c-del-11', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-12', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-13', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 15 },
      { id: 'c-del-14', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 35 },
    ],
    reviews: [
      { id: 'r-del-4', author: 'Ananya Sharma', rating: 5, date: '4 days ago', vehicle: 'Hyundai Ioniq 5', comment: 'Plugged in while shopping, got 75% charged by the time I was back.' }
    ]
  },
  {
    id: 'st-delhi-4',
    name: 'Ather Grid & Multi-EV Point - Pacific Mall',
    area: 'Subhash Nagar, West Delhi',
    fullAddress: 'Najafgarh Road, Tagore Garden, Near Subhash Nagar Metro, New Delhi, DL 110027',
    lat: 28.6418,
    lng: 77.1065,
    status: 'available',
    availablePorts: 3,
    totalPorts: 3,
    pricePerKwh: 16,
    minSessionFee: 30,
    rating: 4.6,
    reviewsCount: 88,
    hours: '7AM – 11PM',
    is24x7: false,
    vehicleTypes: ['2-Wheeler', '4-Wheeler'],
    powerSpeed: 'LECCS Fast + AC · 22 kW',
    primaryConnectors: ['LECCS', 'Type-2', 'Bharat AC-001'],
    estimatedFullChargeCost: 160,
    operator: 'Ather Energy & Pacific Mall',
    chargerCategory: 'Commercial',
    verifiedCompatibility: true,
    amenities: ['Mall Dining', 'Metro Linked', 'CCTV Security'],
    connectors: [
      { id: 'c-del-15', type: 'LECCS', powerKw: 3.3, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-16', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-17', type: 'Bharat AC-001', powerKw: 3.3, speedType: 'AC Normal', status: 'free', portNumber: 3 },
    ],
    reviews: [
      { id: 'r-del-5', author: 'Gaurav Gill', rating: 5, date: '1 week ago', vehicle: 'Ather 450 Apex', comment: 'Quick top-up, smooth app handshake.' }
    ]
  },
  {
    id: 'st-delhi-5',
    name: 'ChargeZone Fast Bay - DLF Promenade',
    area: 'Vasant Kunj, South Delhi',
    fullAddress: 'Nelson Mandela Marg, Vasant Kunj II, New Delhi, DL 110070',
    lat: 28.5402,
    lng: 77.1558,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 21,
    minSessionFee: 60,
    rating: 4.9,
    reviewsCount: 142,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 150 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 420,
    operator: 'ChargeZone',
    amenities: ['Valet Service', 'Luxury Lounges', 'Starbucks', '24/7 Security'],
    connectors: [
      { id: 'c-del-18', type: 'CCS2', powerKw: 150, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-19', type: 'CCS2', powerKw: 150, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-20', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-21', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 12 },
    ],
    reviews: [
      { id: 'r-del-6', author: 'Kabir Thapar', rating: 5, date: '3 days ago', vehicle: 'Kia EV6', comment: '150kW ultra-fast charging is flawless here.' }
    ]
  },
  {
    id: 'st-delhi-6',
    name: 'Kazam EV Hub - Civil Lines',
    area: 'Civil Lines, North Delhi',
    fullAddress: 'Sham Nath Marg, Near Civil Lines Metro, North Delhi, DL 110054',
    lat: 28.6814,
    lng: 77.2228,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 16,
    minSessionFee: 30,
    rating: 4.5,
    reviewsCount: 65,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 30 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 320,
    operator: 'Kazam',
    amenities: ['Illuminated Bay', 'Nearby Metro', 'Drinking Water'],
    connectors: [
      { id: 'c-del-22', type: 'CCS2', powerKw: 30, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-23', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-del-7', author: 'Deepak Tyagi', rating: 4, date: '1 week ago', vehicle: 'Tata Tiago EV', comment: 'Decent 30kW speed and rarely crowded.' }
    ]
  },
  {
    id: 'st-delhi-7',
    name: 'Tata Power DC Fast - Dwarka Sector 14',
    area: 'Dwarka, South West Delhi',
    fullAddress: 'Metro Station Multilevel Parking, Sector 14, Dwarka, New Delhi, DL 110078',
    lat: 28.5993,
    lng: 77.0315,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 112,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Covered Parking', 'Metro Transfer Hub', 'CCTV Security'],
    connectors: [
      { id: 'c-del-24', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-25', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-26', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-27', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 25 },
    ],
    reviews: [
      { id: 'r-del-8', author: 'Nitin Oberoi', rating: 5, date: 'Yesterday', vehicle: 'Mahindra XUV400', comment: 'Smooth charge while commuting.' }
    ]
  },
  {
    id: 'st-delhi-8',
    name: 'Statiq Ultra Fast - Cyber Hub',
    area: 'DLF Cyber City, Gurugram (Delhi NCR)',
    fullAddress: 'Building 10 Parking Level 1, DLF Cyber City, Phase 2, Gurugram, HR 122002',
    lat: 28.4950,
    lng: 77.0895,
    status: 'available',
    availablePorts: 4,
    totalPorts: 6,
    pricePerKwh: 19,
    minSessionFee: 60,
    rating: 4.9,
    reviewsCount: 230,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Statiq',
    amenities: ['Cyber Hub Restaurants', 'Corporate Valet', 'Wi-Fi', '24/7 Guards'],
    connectors: [
      { id: 'c-del-28', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-29', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-30', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-31', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 4 },
      { id: 'c-del-32', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 5, estimatedFreeInMin: 18 },
      { id: 'c-del-33', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 6, estimatedFreeInMin: 40 },
    ],
    reviews: [
      { id: 'r-del-9', author: 'Arjun Singhania', rating: 5, date: '3 days ago', vehicle: 'BMW i4', comment: 'Consistently 100kW+ delivery. Premium spot.' }
    ]
  },
  {
    id: 'st-delhi-9',
    name: 'Jio-bp pulse - Mall of India',
    area: 'Sector 18, Noida (Delhi NCR)',
    fullAddress: 'DLF Mall of India Basement Parking B2, Sector 18, Noida, UP 201301',
    lat: 28.5672,
    lng: 77.3210,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 167,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Jio-bp pulse',
    amenities: ['Mall Shopping', 'Food Court', 'Clean Restrooms', 'Security'],
    connectors: [
      { id: 'c-del-34', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-del-35', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-del-36', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-del-37', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 22 },
    ],
    reviews: [
      { id: 'r-del-10', author: 'Prateek Yadav', rating: 5, date: 'Yesterday', vehicle: 'Tata Punch EV', comment: 'Charged from 30% to 90% while watching a movie.' }
    ]
  },

  // ==========================================
  // 2. MAHARASHTRA (MUMBAI, PUNE, NAGPUR, NASHIK)
  // ==========================================
  {
    id: 'st-mh-1',
    name: 'Tata Power EV Hub - Andheri West',
    area: 'Andheri West, Mumbai, Maharashtra',
    fullAddress: 'Plot 45, Veera Desai Industrial Estate, Off New Link Rd, Andheri West, Mumbai, MH 400053',
    lat: 19.1362,
    lng: 72.8296,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 128,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Café', 'Restrooms', 'Free Wi-Fi', '24/7 Security'],
    connectors: [
      { id: 'c-mh-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-2', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mh-3', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-mh-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-mh-1', author: 'Aarav Mehta', rating: 5, date: 'Yesterday', vehicle: 'Tata Nexon EV', comment: 'Steady 50kW charging rate.' }
    ]
  },
  {
    id: 'st-mh-2',
    name: 'Ather Grid Station - Bandra Kurla Complex',
    area: 'BKC, Mumbai, Maharashtra',
    fullAddress: 'One BKC, G Block, Bandra Kurla Complex, Bandra East, Mumbai, MH 400051',
    lat: 19.0683,
    lng: 72.8693,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 16,
    minSessionFee: 30,
    rating: 4.6,
    reviewsCount: 94,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['2-Wheeler', '4-Wheeler'],
    powerSpeed: 'AC Fast · 22 kW',
    primaryConnectors: ['Type-2'],
    estimatedFullChargeCost: 160,
    operator: 'Ather Energy',
    amenities: ['Corporate District', 'Security', 'Food Court'],
    connectors: [
      { id: 'c-mh-5', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-6', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mh-7', type: 'Type-2', powerKw: 7.4, speedType: 'AC Normal', status: 'in-use', portNumber: 3, estimatedFreeInMin: 25 },
    ],
    reviews: [
      { id: 'r-mh-2', author: 'Rahul Verma', rating: 5, date: '3 days ago', vehicle: 'Ather 450X', comment: 'Great for BKC commuters.' }
    ]
  },
  {
    id: 'st-mh-3',
    name: 'ChargeZone Ultra Fast - Powai',
    area: 'Powai, Mumbai, Maharashtra',
    fullAddress: 'Hiranandani Business Park, Central Ave, Hiranandani Gardens, Powai, Mumbai, MH 400076',
    lat: 19.1176,
    lng: 72.9060,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 22,
    minSessionFee: 60,
    rating: 4.9,
    reviewsCount: 85,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 150 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 440,
    operator: 'ChargeZone',
    amenities: ['Starbucks', 'Valet', 'Tyre Pressure Check'],
    connectors: [
      { id: 'c-mh-8', type: 'CCS2', powerKw: 150, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-9', type: 'CCS2', powerKw: 150, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-mh-10', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 14 },
    ],
    reviews: [
      { id: 'r-mh-3', author: 'Vikram S', rating: 5, date: '4 days ago', vehicle: 'Kia EV6', comment: 'Ultra-fast 150kW port is awesome.' }
    ]
  },
  {
    id: 'st-mh-4',
    name: 'Tata Power Fast Charger - Koregaon Park',
    area: 'Koregaon Park, Pune, Maharashtra',
    fullAddress: 'North Main Road, Near Lane 7, Koregaon Park, Pune, MH 411001',
    lat: 18.5362,
    lng: 73.8940,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 110,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Cafés', 'Wi-Fi', 'Covered Bay'],
    connectors: [
      { id: 'c-mh-11', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-12', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mh-13', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 30 },
    ],
    reviews: [
      { id: 'r-mh-4', author: 'Mandar Joshi', rating: 5, date: '2 days ago', vehicle: 'Tata Curvv EV', comment: 'Clean station, excellent neighborhood.' }
    ]
  },
  {
    id: 'st-mh-5',
    name: 'ChargeZone - Hinjewadi IT Park Phase 1',
    area: 'Hinjewadi, Pune, Maharashtra',
    fullAddress: 'Rajiv Gandhi Infotech Park Phase 1, Hinjewadi, Pune, MH 411057',
    lat: 18.5913,
    lng: 73.7389,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 95,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'ChargeZone',
    amenities: ['Tech Park Amenities', '24/7 Access', 'Security'],
    connectors: [
      { id: 'c-mh-14', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-15', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mh-16', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-mh-17', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-mh-5', author: 'Shreya Kulkarni', rating: 5, date: 'Yesterday', vehicle: 'MG Windsor EV', comment: 'Reliable charging right next to office.' }
    ]
  },
  {
    id: 'st-mh-6',
    name: 'Kazam EV Hub - Civil Lines Nagpur',
    area: 'Civil Lines, Nagpur, Maharashtra',
    fullAddress: 'Temple Road, Near Collectorate, Civil Lines, Nagpur, MH 440001',
    lat: 21.1524,
    lng: 79.0725,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.6,
    reviewsCount: 52,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Kazam',
    amenities: ['Illuminated Bay', 'Nearby Metro', 'Water'],
    connectors: [
      { id: 'c-mh-18', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mh-19', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-mh-6', author: 'Nitin Deshmukh', rating: 5, date: '1 week ago', vehicle: 'Tata Tigor EV', comment: 'Central Nagpur charging is very dependable.' }
    ]
  },

  // ==========================================
  // 3. KARNATAKA (BENGALURU, MYSURU, MANGALURU)
  // ==========================================
  {
    id: 'st-ka-1',
    name: 'BESCOM Fast Charging Plaza - Vidhana Soudha',
    area: 'Central Business District, Bengaluru, Karnataka',
    fullAddress: 'Dr. Ambedkar Veedhi, Near Vidhana Soudha Metro, Bengaluru, KA 560001',
    lat: 12.9796,
    lng: 77.5907,
    status: 'available',
    availablePorts: 4,
    totalPorts: 4,
    pricePerKwh: 15,
    minSessionFee: 40,
    rating: 4.8,
    reviewsCount: 220,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2', 'Bharat AC'],
    estimatedFullChargeCost: 300,
    operator: 'BESCOM',
    amenities: ['Govt Plaza', 'Metro Link', 'CCTV Surveillance', 'Solar Canopy'],
    connectors: [
      { id: 'c-ka-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ka-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ka-3', type: 'CCS2', powerKw: 30, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ka-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 4 },
    ],
    reviews: [
      { id: 'r-ka-1', author: 'Karthik Rao', rating: 5, date: 'Yesterday', vehicle: 'Mahindra BE 6e', comment: 'Subsidized rates and high uptime.' }
    ]
  },
  {
    id: 'st-ka-2',
    name: 'Ather Grid HQ Hub - Indiranagar',
    area: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
    fullAddress: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038',
    lat: 12.9784,
    lng: 77.6408,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 16,
    minSessionFee: 30,
    rating: 4.9,
    reviewsCount: 175,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['2-Wheeler', '4-Wheeler'],
    powerSpeed: 'AC Fast · 22 kW',
    primaryConnectors: ['Type-2'],
    estimatedFullChargeCost: 160,
    operator: 'Ather Energy',
    amenities: ['Coffee Shops', 'Boutique Stores', 'Wi-Fi'],
    connectors: [
      { id: 'c-ka-5', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ka-6', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ka-7', type: 'Type-2', powerKw: 7.4, speedType: 'AC Normal', status: 'free', portNumber: 3 },
      { id: 'c-ka-8', type: 'Type-2', powerKw: 7.4, speedType: 'AC Normal', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-ka-2', author: 'Divya Nambiar', rating: 5, date: '3 days ago', vehicle: 'Ola S1 Gen 2', comment: 'Iconic spot, always clean.' }
    ]
  },
  {
    id: 'st-ka-3',
    name: 'Zeon Charging - Phoenix Marketcity Whitefield',
    area: 'Whitefield, Bengaluru, Karnataka',
    fullAddress: 'Mahadevapura, Whitefield Main Road, Bengaluru, KA 560048',
    lat: 12.9960,
    lng: 77.6966,
    status: 'available',
    availablePorts: 4,
    totalPorts: 5,
    pricePerKwh: 20,
    minSessionFee: 60,
    rating: 4.8,
    reviewsCount: 140,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 400,
    operator: 'Zeon Charging',
    amenities: ['Mall Access', 'Food Court', 'Cinema', 'Restrooms'],
    connectors: [
      { id: 'c-ka-9', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-ka-10', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-ka-11', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ka-12', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 4 },
      { id: 'c-ka-13', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 5, estimatedFreeInMin: 12 },
    ],
    reviews: [
      { id: 'r-ka-3', author: 'Siddharth Hegde', rating: 5, date: '2 days ago', vehicle: 'Kia EV6', comment: 'Fast 120kW charging while grocery shopping.' }
    ]
  },
  {
    id: 'st-ka-4',
    name: 'Tata Power EZ Charge - Mysuru Palace Road',
    area: 'Nazarbad, Mysuru, Karnataka',
    fullAddress: 'Near Exhibition Grounds, Indira Gandhi Circle, Mysuru, KA 570010',
    lat: 12.3052,
    lng: 76.6552,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 78,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Tourist Hub', 'Restrooms', 'Security'],
    connectors: [
      { id: 'c-ka-14', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ka-15', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-ka-4', author: 'Ramesh Gowda', rating: 5, date: '5 days ago', vehicle: 'Tata Nexon EV', comment: 'Crucial stop on Bengaluru-Mysuru expressway.' }
    ]
  },

  // ==========================================
  // 4. TAMIL NADU (CHENNAI, COIMBATORE, MADURAI)
  // ==========================================
  {
    id: 'st-tn-1',
    name: 'Tata Power EZ Charge - Anna Nagar',
    area: 'Anna Nagar, Chennai, Tamil Nadu',
    fullAddress: '2nd Avenue, Near Anna Nagar Tower Park, Chennai, TN 600040',
    lat: 13.0850,
    lng: 80.2101,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 154,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Park View', 'Cafés', '24/7 Guarded'],
    connectors: [
      { id: 'c-tn-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-tn-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-tn-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-tn-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-tn-1', author: 'Senthil Kumar', rating: 5, date: 'Yesterday', vehicle: 'Tata Punch EV', comment: 'Flawless 60kW charging.' }
    ]
  },
  {
    id: 'st-tn-2',
    name: 'Zeon Fast Charger - Express Avenue Mall',
    area: 'Royapettah, Chennai, Tamil Nadu',
    fullAddress: 'Club House Road, Express Avenue Basement P1, Royapettah, Chennai, TN 600002',
    lat: 13.0587,
    lng: 80.2642,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 165,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 380,
    operator: 'Zeon Charging',
    amenities: ['Mall Dining', 'Cinema', 'Air-conditioned Lounge'],
    connectors: [
      { id: 'c-tn-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-tn-6', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-tn-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-tn-8', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 10 },
    ],
    reviews: [
      { id: 'r-tn-2', author: 'Praveen Raj', rating: 5, date: '3 days ago', vehicle: 'Hyundai Kona', comment: 'Always reliable.' }
    ]
  },
  {
    id: 'st-tn-3',
    name: 'Zeon Charging Hub - Avinashi Road',
    area: 'Peelamedu, Coimbatore, Tamil Nadu',
    fullAddress: 'Avinashi Road, Near Coimbatore International Airport Junction, Coimbatore, TN 641014',
    lat: 11.0168,
    lng: 76.9558,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 92,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Zeon Charging',
    amenities: ['Highway Diner', 'Restrooms', 'Free Air & Water'],
    connectors: [
      { id: 'c-tn-9', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-tn-10', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-tn-11', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-tn-12', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-tn-3', author: 'Manojkumar', rating: 5, date: '4 days ago', vehicle: 'BYD Atto 3', comment: '120kW gun charged me up in 25 mins.' }
    ]
  },

  // ==========================================
  // 5. TELANGANA (HYDERABAD, WARANGAL)
  // ==========================================
  {
    id: 'st-ts-1',
    name: 'Statiq Ultra Fast Hub - Financial District',
    area: 'Gachibowli, Hyderabad, Telangana',
    fullAddress: 'WaveRock SEZ, Nanakramguda, Financial District, Gachibowli, Hyderabad, TS 500032',
    lat: 17.4401,
    lng: 78.3489,
    status: 'available',
    availablePorts: 4,
    totalPorts: 5,
    pricePerKwh: 19,
    minSessionFee: 60,
    rating: 4.9,
    reviewsCount: 198,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Statiq',
    amenities: ['IT Campus Access', 'Cafés', '24/7 Security'],
    connectors: [
      { id: 'c-ts-1', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-ts-2', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-ts-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ts-4', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 4 },
      { id: 'c-ts-5', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 5, estimatedFreeInMin: 24 },
    ],
    reviews: [
      { id: 'r-ts-1', author: 'Varun Reddy', rating: 5, date: 'Yesterday', vehicle: 'MG ZS EV', comment: 'Premier charging in Cyberabad.' }
    ]
  },
  {
    id: 'st-ts-2',
    name: 'Tata Power EZ Charge - Inorbit Mall HITEC City',
    area: 'HITEC City, Madhapur, Hyderabad, Telangana',
    fullAddress: 'Inorbit Mall Basement Level 1, Mindspace IT Park, Madhapur, Hyderabad, TS 500081',
    lat: 17.4344,
    lng: 78.3867,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 145,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Entrance', 'Food Court', 'Cinema'],
    connectors: [
      { id: 'c-ts-6', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ts-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ts-8', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ts-9', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 16 },
    ],
    reviews: [
      { id: 'r-ts-2', author: 'Sai Teja', rating: 5, date: '3 days ago', vehicle: 'Tata Nexon EV Max', comment: 'Always has active guns.' }
    ]
  },

  // ==========================================
  // 6. GUJARAT (AHMEDABAD, SURAT, VADODARA)
  // ==========================================
  {
    id: 'st-gj-1',
    name: 'Tata Power EZ Charge - Sindhu Bhavan Road',
    area: 'Bodakdev, Ahmedabad, Gujarat',
    fullAddress: 'Sindhu Bhavan Marg, Near Taj Skyline, Bodakdev, Ahmedabad, GJ 380054',
    lat: 23.0448,
    lng: 72.5085,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 134,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Cafés', 'Wi-Fi', '24/7 Security'],
    connectors: [
      { id: 'c-gj-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-gj-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-gj-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-gj-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-gj-1', author: 'Jayesh Patel', rating: 5, date: 'Yesterday', vehicle: 'MG ZS EV', comment: 'Posh area, quick charging rate.' }
    ]
  },
  {
    id: 'st-gj-2',
    name: 'ChargeZone HQ Hub - Sabarmati Riverfront',
    area: 'Riverfront West, Ahmedabad, Gujarat',
    fullAddress: 'Sabarmati Riverfront Promenade, Ashram Road, Ahmedabad, GJ 380009',
    lat: 23.0338,
    lng: 72.5714,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 110,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 360,
    operator: 'ChargeZone',
    amenities: ['Scenic Promenade', 'Restrooms', 'Illuminated Parking'],
    connectors: [
      { id: 'c-gj-5', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-gj-6', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-gj-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-gj-8', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-gj-2', author: 'Hardik Shah', rating: 5, date: '3 days ago', vehicle: 'Tata Curvv EV', comment: 'Riverfront walk while charging is a treat.' }
    ]
  },

  // ==========================================
  // 7. RAJASTHAN (JAIPUR, UDAIPUR, JODHPUR)
  // ==========================================
  {
    id: 'st-rj-1',
    name: 'Tata Power EZ Charge - C-Scheme Jaipur',
    area: 'C-Scheme, Ashok Nagar, Jaipur, Rajasthan',
    fullAddress: 'Subhash Marg, Near Ahinsa Circle, C-Scheme, Jaipur, RJ 302001',
    lat: 26.9124,
    lng: 75.7873,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 118,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Cafés', 'Heritage District', 'Guarded Bay'],
    connectors: [
      { id: 'c-rj-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-rj-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-rj-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-rj-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-rj-1', author: 'Manish Shekhawat', rating: 5, date: 'Yesterday', vehicle: 'Tata Nexon EV', comment: 'Central Jaipur location, flawless charging.' }
    ]
  },
  {
    id: 'st-rj-2',
    name: 'Statiq Fast Charger - World Trade Park (WTP)',
    area: 'Malviya Nagar, Jaipur, Rajasthan',
    fullAddress: 'Jawahar Lal Nehru Marg, D-Block, Malviya Nagar, Jaipur, RJ 302017',
    lat: 26.8532,
    lng: 75.8052,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 145,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 380,
    operator: 'Statiq',
    amenities: ['Mall Access', 'Food Court', 'Cinema'],
    connectors: [
      { id: 'c-rj-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-rj-6', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-rj-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-rj-8', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 10 },
    ],
    reviews: [
      { id: 'r-rj-2', author: 'Pooja Choudhary', rating: 5, date: '3 days ago', vehicle: 'Mahindra XUV400', comment: 'Fast charging while mall hopping.' }
    ]
  },

  // ==========================================
  // 8. WEST BENGAL (KOLKATA, SILIGURI)
  // ==========================================
  {
    id: 'st-wb-1',
    name: 'CESC EV Hub - Park Street',
    area: 'Park Street, Kolkata, West Bengal',
    fullAddress: 'Park Street, Near Allen Park, Kolkata, WB 700016',
    lat: 22.5512,
    lng: 88.3524,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 132,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'CESC',
    amenities: ['Iconic Street Dining', 'Metro Linked', '24/7 Security'],
    connectors: [
      { id: 'c-wb-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-wb-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-wb-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-wb-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 22 },
    ],
    reviews: [
      { id: 'r-wb-1', author: 'Subhashish Sen', rating: 5, date: 'Yesterday', vehicle: 'Tata Tiago EV', comment: 'Park Street charging is super fast and clean.' }
    ]
  },
  {
    id: 'st-wb-2',
    name: 'Jio-bp pulse - Salt Lake Sector V',
    area: 'Sector V, Salt Lake, Kolkata, West Bengal',
    fullAddress: 'RDB Boulevard, Block EP & GP, Sector V, Bidhannagar, Kolkata, WB 700091',
    lat: 22.5802,
    lng: 88.4342,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 114,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Jio-bp pulse',
    amenities: ['Tech Hub', 'Cafés', 'Restrooms'],
    connectors: [
      { id: 'c-wb-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-wb-6', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-wb-7', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-wb-8', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-wb-2', author: 'Debolina Bose', rating: 5, date: '3 days ago', vehicle: 'MG Windsor EV', comment: 'Great for IT office workers.' }
    ]
  },

  // ==========================================
  // 9. UTTAR PRADESH (LUCKNOW, KANPUR, VARANASI, AGRA)
  // ==========================================
  {
    id: 'st-up-1',
    name: 'Tata Power EZ Charge - Hazratganj',
    area: 'Hazratganj, Lucknow, Uttar Pradesh',
    fullAddress: 'Mahatma Gandhi Marg, Near Mayfair Cinema, Hazratganj, Lucknow, UP 226001',
    lat: 26.8467,
    lng: 80.9462,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.7,
    reviewsCount: 98,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['City Center', 'Shopping Area', 'Security'],
    connectors: [
      { id: 'c-up-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-up-2', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-up-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-up-1', author: 'Akshat Srivastava', rating: 5, date: '2 days ago', vehicle: 'Tata Nexon EV', comment: 'Hazratganj location is top-notch.' }
    ]
  },
  {
    id: 'st-up-2',
    name: 'Statiq Fast Charger - Fatehabad Road',
    area: 'Tajganj, Agra, Uttar Pradesh',
    fullAddress: 'Fatehabad Road, Near Taj Mahal East Gate, Agra, UP 282001',
    lat: 27.1610,
    lng: 78.0410,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 76,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 360,
    operator: 'Statiq',
    amenities: ['Tourist Hub', 'Taj Mahal Express Access', 'Dining'],
    connectors: [
      { id: 'c-up-4', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-up-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-up-2', author: 'Sameer Khan', rating: 5, date: 'Yesterday', vehicle: 'Hyundai Ioniq 5', comment: 'Essential stop for Yamuna Expressway road trippers.' }
    ]
  },

  // ==========================================
  // 10. KERALA (KOCHI, THIRUVANANTHAPURAM, KOZHIKODE)
  // ==========================================
  {
    id: 'st-kl-1',
    name: 'Zeon Charging Hub - Lulu International Mall',
    area: 'Edappally, Kochi, Kerala',
    fullAddress: 'Lulu International Mall Multilevel Parking P2, Edappally, Kochi, KL 682024',
    lat: 10.0271,
    lng: 76.3080,
    status: 'available',
    availablePorts: 4,
    totalPorts: 5,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 184,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Ultra Fast · 120 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Zeon Charging',
    amenities: ['Mall Food Court', 'Cinema', 'Metro Station Direct Link'],
    connectors: [
      { id: 'c-kl-1', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 1 },
      { id: 'c-kl-2', type: 'CCS2', powerKw: 120, speedType: 'DC Ultra Fast', status: 'free', portNumber: 2 },
      { id: 'c-kl-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-kl-4', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 4 },
      { id: 'c-kl-5', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 5, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-kl-1', author: 'Mathew Thomas', rating: 5, date: 'Yesterday', vehicle: 'BYD Atto 3', comment: 'Fastest charger in Kochi.' }
    ]
  },
  {
    id: 'st-kl-2',
    name: 'KSEB Fast Charger - Kowdiar',
    area: 'Kowdiar, Thiruvananthapuram, Kerala',
    fullAddress: 'Near Kowdiar Palace Square, Kowdiar, Thiruvananthapuram, KL 695003',
    lat: 8.5241,
    lng: 76.9620,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 15,
    minSessionFee: 35,
    rating: 4.7,
    reviewsCount: 76,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 300,
    operator: 'KSEB',
    amenities: ['Govt Backed', 'Illuminated Bay', 'Security'],
    connectors: [
      { id: 'c-kl-6', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-kl-7', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-kl-8', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 30 },
    ],
    reviews: [
      { id: 'r-kl-2', author: 'Anoop Nair', rating: 5, date: '3 days ago', vehicle: 'Tata Punch EV', comment: 'Economical rates and high reliability.' }
    ]
  },

  // ==========================================
  // 11. MADHYA PRADESH (INDORE, BHOPAL, GWALIOR)
  // ==========================================
  {
    id: 'st-mp-1',
    name: 'Tata Power EZ Charge - AB Road Indore',
    area: 'Vijay Nagar, Indore, Madhya Pradesh',
    fullAddress: 'AB Road, Near Brilliant Convention Centre, Vijay Nagar, Indore, MP 452010',
    lat: 22.7533,
    lng: 75.8937,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.8,
    reviewsCount: 104,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Food Hub Nearby', 'Clean Washrooms', '24/7 Access'],
    connectors: [
      { id: 'c-mp-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mp-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mp-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-mp-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-mp-1', author: 'Vikas Malviya', rating: 5, date: 'Yesterday', vehicle: 'MG ZS EV', comment: 'Indore cleanest city with cleanest charging bays.' }
    ]
  },
  {
    id: 'st-mp-2',
    name: 'Tata Power DC Fast - DB City Mall',
    area: 'Arera Hills, Bhopal, Madhya Pradesh',
    fullAddress: 'DB City Mall Basement Parking, Hoshangabad Rd, Arera Hills, Bhopal, MP 462011',
    lat: 23.2360,
    lng: 77.4280,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 88,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Cinema', 'Security'],
    connectors: [
      { id: 'c-mp-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mp-6', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-mp-7', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-mp-2', author: 'Pranay Jain', rating: 5, date: '4 days ago', vehicle: 'Tata Nexon EV', comment: 'Always dependable in Bhopal.' }
    ]
  },

  // ==========================================
  // 12. PUNJAB (AMRITSAR, LUDHIANA, JALANDHAR)
  // ==========================================
  {
    id: 'st-pb-1',
    name: 'Tata Power EZ Charge - Mall of Amritsar',
    area: 'GT Road, Amritsar, Punjab',
    fullAddress: 'GT Road, Near Alpha City, Amritsar, PB 143001',
    lat: 31.6280,
    lng: 74.8980,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 79,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Food Court', 'Washrooms'],
    connectors: [
      { id: 'c-pb-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-pb-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-pb-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-pb-1', author: 'Harpreet Singh', rating: 5, date: 'Yesterday', vehicle: 'Mahindra XUV400', comment: 'Great stop before Golden Temple visit.' }
    ]
  },

  // ==========================================
  // 13. ANDHRA PRADESH (VISAKHAPATNAM, VIJAYAWADA, TIRUPATI)
  // ==========================================
  {
    id: 'st-ap-1',
    name: 'Tata Power EZ Charge - RK Beach Road',
    area: 'RK Beach, Visakhapatnam, Andhra Pradesh',
    fullAddress: 'Beach Road, Near Submarine Museum, Visakhapatnam, AP 530003',
    lat: 17.7140,
    lng: 83.3235,
    status: 'available',
    availablePorts: 3,
    totalPorts: 3,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 96,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Beachside Walk', 'Cafés', 'Security'],
    connectors: [
      { id: 'c-ap-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ap-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ap-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 3 },
    ],
    reviews: [
      { id: 'r-ap-1', author: 'Suresh Varma', rating: 5, date: '2 days ago', vehicle: 'Tata Nexon EV Max', comment: 'Best scenic charging spot on the coastline.' }
    ]
  },

  // ==========================================
  // 14. BIHAR (PATNA, GAYA)
  // ==========================================
  {
    id: 'st-br-1',
    name: 'Tata Power EZ Charge - Bailey Road Patna',
    area: 'Bailey Road, Patna, Bihar',
    fullAddress: 'Jawaharlal Nehru Marg, Near Patna Zoo Gate, Patna, BR 800001',
    lat: 25.6110,
    lng: 85.1150,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 18,
    minSessionFee: 40,
    rating: 4.6,
    reviewsCount: 68,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Illuminated Bay', 'Nearby Refreshments', 'Guarded'],
    connectors: [
      { id: 'c-br-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-br-2', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-br-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 25 },
    ],
    reviews: [
      { id: 'r-br-1', author: 'Abhishek Kumar', rating: 5, date: '3 days ago', vehicle: 'Tata Tigor EV', comment: 'Crucial fast charging hub in central Patna.' }
    ]
  },

  // ==========================================
  // 15. ODISHA (BHUBANESWAR, CUTTACK, PURI)
  // ==========================================
  {
    id: 'st-od-1',
    name: 'Tata Power EZ Charge - Janpath Saheed Nagar',
    area: 'Saheed Nagar, Bhubaneswar, Odisha',
    fullAddress: 'Janpath Road, Near BMC Bhawani Mall, Saheed Nagar, Bhubaneswar, OD 751007',
    lat: 20.2920,
    lng: 85.8450,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 112,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Restrooms', 'Security'],
    connectors: [
      { id: 'c-od-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-od-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-od-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-od-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-od-1', author: 'Debabrata Mohanty', rating: 5, date: 'Yesterday', vehicle: 'MG ZS EV', comment: 'High uptime and quick charging.' }
    ]
  },

  // ==========================================
  // 16. CHHATTISGARH (RAIPUR)
  // ==========================================
  {
    id: 'st-cg-1',
    name: 'Tata Power EZ Charge - VIP Road Raipur',
    area: 'Telibandha, Raipur, Chhattisgarh',
    fullAddress: 'VIP Road, Near Magneto Mall, Telibandha, Raipur, CG 492006',
    lat: 21.2380,
    lng: 81.6740,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.7,
    reviewsCount: 71,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Dining Nearby', 'Clean Bay', 'Security'],
    connectors: [
      { id: 'c-cg-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-cg-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-cg-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-cg-1', author: 'Alok Chandrakar', rating: 5, date: '3 days ago', vehicle: 'Tata Nexon EV', comment: 'Quick and hassle free.' }
    ]
  },

  // ==========================================
  // 17. JHARKHAND (RANCHI, JAMSHEDPUR)
  // ==========================================
  {
    id: 'st-jh-1',
    name: 'Tata Power EZ Charge - Main Road Ranchi',
    area: 'Hindpiri, Ranchi, Jharkhand',
    fullAddress: 'Main Road, Near Overbridge, Hindpiri, Ranchi, JH 834001',
    lat: 23.3590,
    lng: 85.3260,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.6,
    reviewsCount: 58,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['City Center', 'Illuminated Parking', 'Guard'],
    connectors: [
      { id: 'c-jh-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-jh-2', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-jh-1', author: 'Prakash Oraon', rating: 5, date: '5 days ago', vehicle: 'Tata Tiago EV', comment: 'Always operational.' }
    ]
  },

  // ==========================================
  // 18. ASSAM (GUWAHATI, DIBRUGARH)
  // ==========================================
  {
    id: 'st-as-1',
    name: 'Tata Power EZ Charge - GS Road Guwahati',
    area: 'Christian Basti, Guwahati, Assam',
    fullAddress: 'GS Road, Near Central Mall, Christian Basti, Guwahati, AS 781005',
    lat: 26.1550,
    lng: 91.7760,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 89,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Cafés', '24/7 Guarded'],
    connectors: [
      { id: 'c-as-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-as-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-as-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-as-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-as-1', author: 'Partha Sarma', rating: 5, date: 'Yesterday', vehicle: 'Tata Nexon EV Max', comment: 'Gateway to Northeast EV charging.' }
    ]
  },

  // ==========================================
  // 19. HIMACHAL PRADESH (SHIMLA, MANALI, DHARAMSHALA)
  // ==========================================
  {
    id: 'st-hp-1',
    name: 'Tata Power EZ Charge - The Mall Road Shimla',
    area: 'The Mall Road, Shimla, Himachal Pradesh',
    fullAddress: 'Lift Multilevel Parking, Near Cart Road, Shimla, HP 171001',
    lat: 31.1048,
    lng: 77.1734,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 124,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Tata Power EZ Charge',
    amenities: ['Lift to Mall Road', 'Restrooms', 'Hillside View'],
    connectors: [
      { id: 'c-hp-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-hp-2', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-hp-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 15 },
    ],
    reviews: [
      { id: 'r-hp-1', author: 'Ankush Sharma', rating: 5, date: 'Yesterday', vehicle: 'Mahindra XUV400', comment: 'Life saver after climbing the hills from Chandigarh.' }
    ]
  },
  {
    id: 'st-hp-2',
    name: 'Statiq Mountain Bay - Mall Road Manali',
    area: 'Mall Road, Manali, Himachal Pradesh',
    fullAddress: 'Government Multi-Storey Parking, Near Model Town, Manali, HP 175131',
    lat: 32.2396,
    lng: 77.1887,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 20,
    minSessionFee: 60,
    rating: 4.9,
    reviewsCount: 140,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2'],
    estimatedFullChargeCost: 400,
    operator: 'Statiq',
    amenities: ['Atal Tunnel Access Point', 'Cafés', '24/7 Guarded'],
    connectors: [
      { id: 'c-hp-4', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-hp-5', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-hp-2', author: 'Sahil Kapoor', rating: 5, date: '3 days ago', vehicle: 'Tata Nexon EV', comment: 'Crucial charger before heading through Atal Tunnel towards Ladakh.' }
    ]
  },

  // ==========================================
  // 20. UTTARAKHAND (DEHRADUN, HARIDWAR, RISHIKESH)
  // ==========================================
  {
    id: 'st-uk-1',
    name: 'Tata Power EZ Charge - Rajpur Road Dehradun',
    area: 'Rajpur Road, Dehradun, Uttarakhand',
    fullAddress: 'Rajpur Road, Near Pacific Mall, Jakhan, Dehradun, UK 248001',
    lat: 30.3450,
    lng: 78.0620,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 115,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Cafés', 'Security'],
    connectors: [
      { id: 'c-uk-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-uk-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-uk-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-uk-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 25 },
    ],
    reviews: [
      { id: 'r-uk-1', author: 'Raghav Rawat', rating: 5, date: '2 days ago', vehicle: 'Tata Punch EV', comment: 'Quick top-up before Mussoorie.' }
    ]
  },

  // ==========================================
  // 21. GOA (PANAJI, MARGAO, NORTH GOA)
  // ==========================================
  {
    id: 'st-ga-1',
    name: 'Tata Power EZ Charge - DB Marg Panaji',
    area: 'Panaji, North Goa, Goa',
    fullAddress: 'Dayanand Bandodkar Marg, Near Mandovi Riverfront, Panaji, GA 403001',
    lat: 15.4989,
    lng: 73.8278,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 156,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mandovi Cruise Terminal', 'Cafés', 'Scenic Riverfront'],
    connectors: [
      { id: 'c-ga-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ga-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ga-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ga-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-ga-1', author: 'Clinton D\'Souza', rating: 5, date: 'Yesterday', vehicle: 'MG ZS EV', comment: 'Clean bay and pleasant sea breeze while charging.' }
    ]
  },

  // ==========================================
  // 22. JAMMU & KASHMIR (UT - SRINAGAR, JAMMU)
  // ==========================================
  {
    id: 'st-jk-1',
    name: 'Tata Power EZ Charge - Dal Lake Boulevard',
    area: 'Dal Lake, Srinagar, Jammu and Kashmir',
    fullAddress: 'Boulevard Road, Near Ghat No. 7, Dal Lake, Srinagar, JK 190001',
    lat: 34.0837,
    lng: 74.8385,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 110,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Tata Power EZ Charge',
    amenities: ['Dal Lake View', 'Shikara Ghat', 'Heated Lounge'],
    connectors: [
      { id: 'c-jk-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-jk-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-jk-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 20 },
    ],
    reviews: [
      { id: 'r-jk-1', author: 'Tariq Mir', rating: 5, date: 'Yesterday', vehicle: 'Tata Nexon EV Max', comment: 'Charged smoothly in sub-zero winter weather without a hitch.' }
    ]
  },

  // ==========================================
  // 23. LADAKH (UT - LEH)
  // ==========================================
  {
    id: 'st-la-1',
    name: 'Kazam High Altitude Solar EV Hub',
    area: 'Fort Road, Leh, Ladakh',
    fullAddress: 'Fort Road, Near Leh Palace Junction, Leh, LA 194101',
    lat: 34.1642,
    lng: 77.5848,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 22,
    minSessionFee: 60,
    rating: 5.0,
    reviewsCount: 82,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 440,
    operator: 'Kazam',
    amenities: ['11,500 ft High Altitude Tested', 'Solar Backup Battery', 'Warm Lounge'],
    connectors: [
      { id: 'c-la-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-la-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-la-1', author: 'Stanzin Dorje', rating: 5, date: '3 days ago', vehicle: 'BYD Atto 3', comment: 'Highest reliable public EV fast charger in the world.' }
    ]
  },

  // ==========================================
  // 24. CHANDIGARH (UT)
  // ==========================================
  {
    id: 'st-ch-1',
    name: 'Tata Power EZ Charge - Elante Mall',
    area: 'Industrial Area Phase 1, Chandigarh',
    fullAddress: 'Elante Mall Basement B1, 178-178A, Industrial Area Phase 1, Chandigarh, CH 160002',
    lat: 30.7055,
    lng: 76.8013,
    status: 'available',
    availablePorts: 3,
    totalPorts: 4,
    pricePerKwh: 18,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 162,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 60 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['Mall Access', 'Food Court', 'Restrooms', 'Security'],
    connectors: [
      { id: 'c-ch-1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ch-2', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-ch-3', type: 'CCS2', powerKw: 60, speedType: 'DC Fast', status: 'free', portNumber: 3 },
      { id: 'c-ch-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 4, estimatedFreeInMin: 18 },
    ],
    reviews: [
      { id: 'r-ch-1', author: 'Gurinder Dhillon', rating: 5, date: 'Yesterday', vehicle: 'Tata Curvv EV', comment: 'Elante charging is super fast and convenient.' }
    ]
  },

  // ==========================================
  // 25. PUDUCHERRY (UT)
  // ==========================================
  {
    id: 'st-py-1',
    name: 'Tata Power EZ Charge - White Town',
    area: 'White Town, Promenade, Puducherry',
    fullAddress: 'Goubert Avenue, Near Rock Beach, White Town, Puducherry, PY 605001',
    lat: 11.9338,
    lng: 79.8358,
    status: 'available',
    availablePorts: 2,
    totalPorts: 3,
    pricePerKwh: 18,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 94,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Tata Power EZ Charge',
    amenities: ['French Colony Heritage', 'Rock Beach Walk', 'French Cafés'],
    connectors: [
      { id: 'c-py-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-py-2', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 2 },
      { id: 'c-py-3', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'in-use', portNumber: 3, estimatedFreeInMin: 22 },
    ],
    reviews: [
      { id: 'r-py-1', author: 'Jean-Luc Pillai', rating: 5, date: '3 days ago', vehicle: 'MG ZS EV', comment: 'Stroll along the Promenade while charging.' }
    ]
  },

  // ==========================================
  // 26. SIKKIM (GANGTOK)
  // ==========================================
  {
    id: 'st-sk-1',
    name: 'Tata Power Eco EV Hub - MG Marg',
    area: 'MG Marg, Gangtok, Sikkim',
    fullAddress: 'MG Marg Multi-Level Car Parking, Gangtok, SK 737101',
    lat: 27.3314,
    lng: 88.6138,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.8,
    reviewsCount: 65,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Tata Power EZ Charge',
    amenities: ['Pedestrian Plaza', 'Himalayan Views', 'Clean Energy Certified'],
    connectors: [
      { id: 'c-sk-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-sk-2', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-sk-1', author: 'Tenzing Bhutia', rating: 5, date: '2 days ago', vehicle: 'Tata Nexon EV', comment: 'First fast DC charger in Gangtok, wonderful initiative.' }
    ]
  },

  // ==========================================
  // 27. MEGHALAYA (SHILLONG)
  // ==========================================
  {
    id: 'st-ml-1',
    name: 'Kazam Hill EV Station - Police Bazar',
    area: 'Police Bazar, Shillong, Meghalaya',
    fullAddress: 'GS Road, Near PB Point, Police Bazar, Shillong, ML 793001',
    lat: 25.5788,
    lng: 91.8831,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 18,
    minSessionFee: 45,
    rating: 4.7,
    reviewsCount: 52,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Kazam',
    amenities: ['Shopping Center', 'Coffee Shops', 'Security'],
    connectors: [
      { id: 'c-ml-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ml-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-ml-1', author: 'Daphisabet Khongwir', rating: 5, date: '4 days ago', vehicle: 'Tata Punch EV', comment: 'Great charging spot in central Shillong.' }
    ]
  },

  // ==========================================
  // 28. TRIPURA (AGARTALA)
  // ==========================================
  {
    id: 'st-tr-1',
    name: 'Tata Power EV Station - Banamalipur',
    area: 'Banamalipur, Agartala, Tripura',
    fullAddress: 'AK Road, Near Post Office, Banamalipur, Agartala, TR 799001',
    lat: 23.8315,
    lng: 91.2868,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.6,
    reviewsCount: 42,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Town Center', 'Illuminated Parking', 'Guard'],
    connectors: [
      { id: 'c-tr-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-tr-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-tr-1', author: 'Bikram Debbarma', rating: 5, date: '5 days ago', vehicle: 'Tata Tigor EV', comment: 'Very proud to see fast EV charging in Agartala.' }
    ]
  },

  // ==========================================
  // 29. MANIPUR (IMPHAL)
  // ==========================================
  {
    id: 'st-mn-1',
    name: 'Kazam EV Station - Kangla Fort Road',
    area: 'Kangla, Imphal, Manipur',
    fullAddress: 'Kangla Western Gate Rd, Near Ima Keithel, Imphal, MN 795001',
    lat: 24.8170,
    lng: 93.9368,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 18,
    minSessionFee: 45,
    rating: 4.6,
    reviewsCount: 38,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Kazam',
    amenities: ['Historic Kangla Gate', 'Ima Market Linked', 'Guarded'],
    connectors: [
      { id: 'c-mn-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mn-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-mn-1', author: 'Tomba Singh', rating: 5, date: '1 week ago', vehicle: 'Tata Tiago EV', comment: 'Smooth fast charging in Imphal city.' }
    ]
  },

  // ==========================================
  // 30. NAGALAND (KOHIMA, DIMAPUR)
  // ==========================================
  {
    id: 'st-nl-1',
    name: 'Statiq Mountain EV Hub - PR Hill',
    area: 'PR Hill, Kohima, Nagaland',
    fullAddress: 'National Highway 29, PR Hill Junction, Kohima, NL 797001',
    lat: 25.6660,
    lng: 94.1080,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.7,
    reviewsCount: 46,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Statiq',
    amenities: ['Highway Diner', 'Restrooms', 'Hillside Overlook'],
    connectors: [
      { id: 'c-nl-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-nl-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-nl-1', author: 'Keviletuo Angami', rating: 5, date: '3 days ago', vehicle: 'Tata Nexon EV', comment: 'Superb reliability on the Kohima-Dimapur highway.' }
    ]
  },

  // ==========================================
  // 31. ARUNACHAL PRADESH (ITANAGAR)
  // ==========================================
  {
    id: 'st-ar-1',
    name: 'Kazam EV Point - Bank Tinali',
    area: 'Bank Tinali, Itanagar, Arunachal Pradesh',
    fullAddress: 'NH 415, Near Ganga Market, Bank Tinali, Itanagar, AR 791111',
    lat: 27.0980,
    lng: 93.6160,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 18,
    minSessionFee: 45,
    rating: 4.7,
    reviewsCount: 35,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Kazam',
    amenities: ['Capital Center', 'Covered Parking', 'Security'],
    connectors: [
      { id: 'c-ar-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ar-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-ar-1', author: 'Taba Tadar', rating: 5, date: '4 days ago', vehicle: 'Mahindra XUV400', comment: 'Reliable charging in Arunachal Pradesh.' }
    ]
  },

  // ==========================================
  // 32. MIZORAM (AIZAWL)
  // ==========================================
  {
    id: 'st-mz-1',
    name: 'Kazam EV Station - Zarkawt Aizawl',
    area: 'Zarkawt, Aizawl, Mizoram',
    fullAddress: 'Zarkawt Main Street, Near Presbyterian Church, Aizawl, MZ 796001',
    lat: 23.7307,
    lng: 92.7173,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 18,
    minSessionFee: 45,
    rating: 4.8,
    reviewsCount: 39,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 360,
    operator: 'Kazam',
    amenities: ['City Center', 'Scenic Mountain View', 'Guarded Bay'],
    connectors: [
      { id: 'c-mz-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-mz-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-mz-1', author: 'Lalmuanpuia', rating: 5, date: '5 days ago', vehicle: 'Tata Tiago EV', comment: 'Steep hill climbs handled smoothly with this charging stop.' }
    ]
  },

  // ==========================================
  // 33. ANDAMAN & NICOBAR ISLANDS (UT - PORT BLAIR)
  // ==========================================
  {
    id: 'st-an-1',
    name: 'Tata Power Eco EV Bay - Marina Park',
    area: 'Marina Park, Port Blair, Andaman and Nicobar Islands',
    fullAddress: 'Rajiv Gandhi Water Sports Complex, Marina Park, Port Blair, AN 744101',
    lat: 11.6660,
    lng: 92.7480,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 19,
    minSessionFee: 50,
    rating: 4.9,
    reviewsCount: 56,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 380,
    operator: 'Tata Power EZ Charge',
    amenities: ['Harbor View', 'Water Sports Complex', 'Solar Powered'],
    connectors: [
      { id: 'c-an-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-an-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-an-1', author: 'Naveen Kumar', rating: 5, date: '2 days ago', vehicle: 'Tata Nexon EV', comment: 'Clean energy on the islands.' }
    ]
  },

  // ==========================================
  // 34. LAKSHADWEEP (UT - KAVARATTI)
  // ==========================================
  {
    id: 'st-ld-1',
    name: 'Kazam Island Solar EV Station',
    area: 'Helipad Road, Kavaratti Island, Lakshadweep',
    fullAddress: 'Administration Secretariat Complex, Kavaratti Island, LD 682555',
    lat: 10.5667,
    lng: 72.6417,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 20,
    minSessionFee: 50,
    rating: 5.0,
    reviewsCount: 28,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'AC Fast · 22 kW',
    primaryConnectors: ['Type-2'],
    estimatedFullChargeCost: 200,
    operator: 'Kazam',
    amenities: ['100% Solar Powered', 'Lagoon View', 'Govt Backed'],
    connectors: [
      { id: 'c-ld-1', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 1 },
      { id: 'c-ld-2', type: 'Type-2', powerKw: 11, speedType: 'AC Normal', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-ld-1', author: 'Mohammed Koya', rating: 5, date: '1 week ago', vehicle: 'Ather 450X', comment: 'Pure zero emissions island mobility.' }
    ]
  },

  // ==========================================
  // 35. DAMAN & DIU AND DADRA NAGAR HAVELI (UT)
  // ==========================================
  {
    id: 'st-dd-1',
    name: 'Kazam EV Hub - Nani Daman Coast',
    area: 'Nani Daman, Daman, Dadra and Nagar Haveli and Daman and Diu',
    fullAddress: 'Seaface Road, Near Devka Beach, Nani Daman, DD 396210',
    lat: 20.4180,
    lng: 72.8330,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 40,
    rating: 4.7,
    reviewsCount: 54,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Kazam',
    amenities: ['Beachside', 'Resort Access', 'Illuminated Parking'],
    connectors: [
      { id: 'c-dd-1', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-dd-2', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-dd-1', author: 'Pritesh Tandel', rating: 5, date: '3 days ago', vehicle: 'Tata Tiago EV', comment: 'Crucial charger for weekend beach visitors.' }
    ]
  },
  {
    id: 'st-dd-2',
    name: 'Tata Power EV Hub - Silvassa',
    area: 'Silvassa, Dadra and Nagar Haveli',
    fullAddress: 'Vapi-Silvassa Main Road, Near Collector Office, Silvassa, DN 396230',
    lat: 20.2740,
    lng: 73.0080,
    status: 'available',
    availablePorts: 2,
    totalPorts: 2,
    pricePerKwh: 17,
    minSessionFee: 45,
    rating: 4.7,
    reviewsCount: 48,
    hours: '24/7',
    is24x7: true,
    vehicleTypes: ['4-Wheeler', '2-Wheeler'],
    powerSpeed: 'DC Fast · 50 kW',
    primaryConnectors: ['CCS2', 'Type-2'],
    estimatedFullChargeCost: 340,
    operator: 'Tata Power EZ Charge',
    amenities: ['Industrial Hub', '24/7 Guarded', 'Restrooms'],
    connectors: [
      { id: 'c-dd-3', type: 'CCS2', powerKw: 50, speedType: 'DC Fast', status: 'free', portNumber: 1 },
      { id: 'c-dd-4', type: 'Type-2', powerKw: 22, speedType: 'AC Fast', status: 'free', portNumber: 2 },
    ],
    reviews: [
      { id: 'r-dd-2', author: 'Mahesh Solanki', rating: 5, date: '4 days ago', vehicle: 'Tata Nexon EV', comment: 'Smooth charging near industrial zone.' }
    ]
  }
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}
