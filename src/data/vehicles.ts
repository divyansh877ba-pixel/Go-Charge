export type VehicleCategory = '2-Wheeler' | '4-Wheeler';
export type VehicleSubType = 'Electric Scooter' | 'Electric Motorcycle' | 'Electric Car' | 'Electric SUV';

export type IndianConnectorType = 
  | 'CCS2' 
  | 'Type-2' 
  | 'LECCS' 
  | 'Bharat AC-001' 
  | 'Bharat DC-001' 
  | 'Ola Hypercharger' 
  | '16A 3-Pin';

export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  category: VehicleCategory;
  subType: VehicleSubType;
  connectors: IndianConnectorType[];
  fastChargingSupport: boolean;
  maxAcKw: number;
  maxDcKw: number;
  batteryKwh: number;
  realRangeKm: number;
  connectorDescription: string;
  popular?: boolean;
}

export const CONNECTOR_SPECS: Record<IndianConnectorType, {
  name: string;
  fullName: string;
  category: 'DC Fast' | 'AC Normal' | 'Standard Plug';
  typicalPower: string;
  description: string;
  standardsBadge: string;
}> = {
  'CCS2': {
    name: 'CCS2',
    fullName: 'Combined Charging System Type 2 (DC)',
    category: 'DC Fast',
    typicalPower: '25 kW - 150 kW DC',
    description: 'National DC fast-charging standard for 4-wheelers in India. Compatible with Tata, Mahindra, Hyundai, BYD, MG, etc.',
    standardsBadge: 'IS 17017 / IEC 62196-3'
  },
  'Type-2': {
    name: 'Type 2 AC',
    fullName: 'Mennekes Type 2 AC',
    category: 'AC Normal',
    typicalPower: '3.3 kW - 22 kW AC',
    description: 'Universal AC standard in India for all electric cars and select performance 2-wheelers (TVS X, Ultraviolette).',
    standardsBadge: 'IS 17017 / IEC 62196-2'
  },
  'LECCS': {
    name: 'LECCS / Type 7',
    fullName: 'Light Electric Combined Charging Station (BIS Type 7)',
    category: 'DC Fast',
    typicalPower: '3.3 kW - 12 kW DC/AC',
    description: 'Bureau of Indian Standards national standard for two-wheelers. Used by Ather Energy, Hero Vida and interoperable network.',
    standardsBadge: 'IS 17017-2-7 (BIS Standard)'
  },
  'Bharat AC-001': {
    name: 'Bharat AC-001',
    fullName: 'Bharat EV Charger AC-001',
    category: 'AC Normal',
    typicalPower: '3.3 kW x 3 ports (10 kW total)',
    description: 'Government standard community AC charging unit with 3 industrial ports for 2W, 3W and light 4W vehicles.',
    standardsBadge: 'DHI / CEA Standard'
  },
  'Bharat DC-001': {
    name: 'Bharat DC-001',
    fullName: 'Bharat EV Charger DC-001',
    category: 'DC Fast',
    typicalPower: '15 kW DC (48V-72V GB/T)',
    description: 'Government DC fast charging standard for fleet vehicles, commercial e-autos and older Indian EV platforms.',
    standardsBadge: 'DHI Standard'
  },
  'Ola Hypercharger': {
    name: 'Ola Hypercharger',
    fullName: 'Ola Proprietary Fast DC Connector',
    category: 'DC Fast',
    typicalPower: '3.0 kW - 6 kW DC',
    description: 'Dedicated hypercharging network plug for Ola S1 Series electric scooters.',
    standardsBadge: 'Ola Proprietary'
  },
  '16A 3-Pin': {
    name: '16A 3-Pin Socket',
    fullName: 'Standard Indian 16A 3-Pin AC Socket',
    category: 'Standard Plug',
    typicalPower: '2.5 kW - 3.3 kW AC',
    description: 'Standard heavy-duty domestic/commercial 3-pin socket, supported universally via vehicle portable adapter.',
    standardsBadge: 'IS 1293'
  }
};

export const INDIAN_EV_DATABASE: VehicleModel[] = [
  // ==========================================
  // ELECTRIC 2-WHEELERS (SCOOTERS & MOTORCYCLES)
  // ==========================================
  {
    id: 'ather-450x',
    brand: 'Ather Energy',
    model: '450X (Gen 3 / HR)',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['LECCS', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 3.3,
    batteryKwh: 3.7,
    realRangeKm: 110,
    connectorDescription: 'LECCS / Type 7 (Ather Fast Grid) + Home AC Adapter',
    popular: true
  },
  {
    id: 'ather-rizta',
    brand: 'Ather Energy',
    model: 'Rizta',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['LECCS', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 3.3,
    batteryKwh: 3.7,
    realRangeKm: 125,
    connectorDescription: 'LECCS / Type 7 + Bharat AC Adapter',
    popular: true
  },
  {
    id: 'ather-450-apex',
    brand: 'Ather Energy',
    model: '450 Apex',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['LECCS', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 3.3,
    batteryKwh: 3.7,
    realRangeKm: 110,
    connectorDescription: 'LECCS / Type 7 fast charging',
  },
  {
    id: 'ola-s1-pro',
    brand: 'Ola Electric',
    model: 'S1 Pro (Gen 2)',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['Ola Hypercharger', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.0,
    maxDcKw: 3.0,
    batteryKwh: 4.0,
    realRangeKm: 140,
    connectorDescription: 'Ola Hypercharger + 16A 3-Pin Home Charger',
    popular: true
  },
  {
    id: 'ola-s1-air',
    brand: 'Ola Electric',
    model: 'S1 Air / S1 X',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['Ola Hypercharger', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.0,
    maxDcKw: 3.0,
    batteryKwh: 3.0,
    realRangeKm: 105,
    connectorDescription: 'Ola Hypercharger + 16A 3-Pin Portable',
  },
  {
    id: 'tvs-iqube',
    brand: 'TVS',
    model: 'iQube / iQube ST',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: false,
    maxAcKw: 3.3,
    maxDcKw: 0,
    batteryKwh: 3.4,
    realRangeKm: 100,
    connectorDescription: 'Bharat AC-001 / Standard 16A 3-Pin (650W/950W AC)',
    popular: true
  },
  {
    id: 'tvs-x',
    brand: 'TVS',
    model: 'TVS X',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['Type-2', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.0,
    maxDcKw: 0,
    batteryKwh: 4.4,
    realRangeKm: 115,
    connectorDescription: 'Type 2 AC fast charging + 16A 3-Pin SmartX',
  },
  {
    id: 'bajaj-chetak',
    brand: 'Bajaj',
    model: 'Chetak Premium / Urbane',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['Bharat AC-001', '16A 3-Pin', 'Type-2'],
    fastChargingSupport: false,
    maxAcKw: 3.3,
    maxDcKw: 0,
    batteryKwh: 3.2,
    realRangeKm: 115,
    connectorDescription: 'Bharat AC-001 / 16A 3-Pin Onboard AC Charger',
    popular: true
  },
  {
    id: 'hero-vida-v1',
    brand: 'Hero Vida',
    model: 'Vida V1 Pro / Plus',
    category: '2-Wheeler',
    subType: 'Electric Scooter',
    connectors: ['LECCS', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 3.3,
    batteryKwh: 3.94,
    realRangeKm: 110,
    connectorDescription: 'LECCS / Type 7 (Interoperable with Ather Grid)',
    popular: true
  },
  {
    id: 'ultraviolette-f77',
    brand: 'Ultraviolette',
    model: 'F77 Mach 2',
    category: '2-Wheeler',
    subType: 'Electric Motorcycle',
    connectors: ['Type-2', 'CCS2', 'Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 12.0,
    batteryKwh: 10.3,
    realRangeKm: 220,
    connectorDescription: 'Type 2 AC + Optional Boost CCS2 DC Charging',
    popular: true
  },
  {
    id: 'revolt-rv400',
    brand: 'Revolt',
    model: 'RV400 / RV1',
    category: '2-Wheeler',
    subType: 'Electric Motorcycle',
    connectors: ['Bharat AC-001', '16A 3-Pin'],
    fastChargingSupport: false,
    maxAcKw: 3.3,
    maxDcKw: 0,
    batteryKwh: 3.24,
    realRangeKm: 110,
    connectorDescription: '16A 3-Pin / Bharat AC-001 Removable Battery Charger',
  },

  // ==========================================
  // ELECTRIC 4-WHEELERS (CARS & SUVS)
  // ==========================================
  {
    id: 'tata-nexon-ev',
    brand: 'Tata',
    model: 'Nexon.ev (Long Range / Mid Range)',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 50,
    batteryKwh: 40.5,
    realRangeKm: 320,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.2kW)',
    popular: true
  },
  {
    id: 'tata-punch-ev',
    brand: 'Tata',
    model: 'Punch.ev',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 50,
    batteryKwh: 35.0,
    realRangeKm: 290,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.2kW)',
    popular: true
  },
  {
    id: 'tata-tiago-ev',
    brand: 'Tata',
    model: 'Tiago.ev / Tigor.ev',
    category: '4-Wheeler',
    subType: 'Electric Car',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 25,
    batteryKwh: 24.0,
    realRangeKm: 210,
    connectorDescription: 'CCS2 (DC Fast up to 25kW) & Type 2 (AC 3.3/7.2kW)',
    popular: true
  },
  {
    id: 'tata-curvv-ev',
    brand: 'Tata',
    model: 'Curvv.ev',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 70,
    batteryKwh: 55.0,
    realRangeKm: 420,
    connectorDescription: 'CCS2 (DC Fast up to 70kW) & Type 2 (AC 7.2kW)',
    popular: true
  },
  {
    id: 'mg-zs-ev',
    brand: 'MG',
    model: 'ZS EV',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.4,
    maxDcKw: 50,
    batteryKwh: 50.3,
    realRangeKm: 340,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.4kW)',
    popular: true
  },
  {
    id: 'mg-windsor-ev',
    brand: 'MG',
    model: 'Windsor EV',
    category: '4-Wheeler',
    subType: 'Electric Car',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.4,
    maxDcKw: 50,
    batteryKwh: 38.0,
    realRangeKm: 280,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.4kW)',
    popular: true
  },
  {
    id: 'mg-comet-ev',
    brand: 'MG',
    model: 'Comet EV (AC Only)',
    category: '4-Wheeler',
    subType: 'Electric Car',
    connectors: ['Type-2', '16A 3-Pin'],
    fastChargingSupport: false,
    maxAcKw: 7.4,
    maxDcKw: 0,
    batteryKwh: 17.3,
    realRangeKm: 180,
    connectorDescription: 'Type 2 AC (3.3kW / 7.4kW Fast AC). Note: No DC fast port.',
    popular: true
  },
  {
    id: 'mahindra-xuv400',
    brand: 'Mahindra',
    model: 'XUV400 EV (EL Pro)',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 50,
    batteryKwh: 39.4,
    realRangeKm: 310,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.2kW)',
    popular: true
  },
  {
    id: 'mahindra-be6e',
    brand: 'Mahindra',
    model: 'BE 6e / XEV 9e',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 11.0,
    maxDcKw: 175,
    batteryKwh: 79.0,
    realRangeKm: 500,
    connectorDescription: 'CCS2 (Ultra-Fast DC up to 175kW) & Type 2 (AC 11kW)',
    popular: true
  },
  {
    id: 'hyundai-ioniq-5',
    brand: 'Hyundai',
    model: 'Ioniq 5 (800V Ultra-Fast)',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 11.0,
    maxDcKw: 350,
    batteryKwh: 72.6,
    realRangeKm: 480,
    connectorDescription: 'CCS2 (Ultra-Fast 800V DC up to 350kW) & Type 2',
    popular: true
  },
  {
    id: 'hyundai-kona',
    brand: 'Hyundai',
    model: 'Kona Electric / Creta EV',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.2,
    maxDcKw: 50,
    batteryKwh: 39.2,
    realRangeKm: 310,
    connectorDescription: 'CCS2 (DC Fast up to 50kW) & Type 2 (AC 7.2kW)',
  },
  {
    id: 'kia-ev6',
    brand: 'Kia',
    model: 'EV6 / EV9',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 11.0,
    maxDcKw: 350,
    batteryKwh: 77.4,
    realRangeKm: 500,
    connectorDescription: 'CCS2 (Ultra-Fast 800V DC up to 350kW) & Type 2',
    popular: true
  },
  {
    id: 'byd-atto-3',
    brand: 'BYD',
    model: 'Atto 3 / Seal / eMAX 7',
    category: '4-Wheeler',
    subType: 'Electric SUV',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 7.0,
    maxDcKw: 80,
    batteryKwh: 60.5,
    realRangeKm: 420,
    connectorDescription: 'CCS2 (DC Fast up to 80-150kW) & Type 2 (AC 7kW)',
    popular: true
  },
  {
    id: 'citroen-ec3',
    brand: 'Citroen',
    model: 'eC3 / Basalt EV',
    category: '4-Wheeler',
    subType: 'Electric Car',
    connectors: ['CCS2', 'Type-2'],
    fastChargingSupport: true,
    maxAcKw: 3.3,
    maxDcKw: 30,
    batteryKwh: 29.2,
    realRangeKm: 220,
    connectorDescription: 'CCS2 (DC Fast up to 30kW) & Type 2 (AC 3.3kW)',
  }
];

export function getVehicleById(id: string): VehicleModel | undefined {
  return INDIAN_EV_DATABASE.find(v => v.id === id);
}

export function getBrandsByCategory(category: VehicleCategory): string[] {
  const brands = new Set<string>();
  INDIAN_EV_DATABASE.filter(v => v.category === category).forEach(v => brands.add(v.brand));
  return Array.from(brands);
}

export function getModelsByBrand(brand: string): VehicleModel[] {
  return INDIAN_EV_DATABASE.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
}

export function isStationCompatibleWithVehicle(stationConnectors: string[], vehicle: VehicleModel): boolean {
  if (!vehicle) return true;
  // Check if any of the station's connectors match the vehicle's supported connectors
  return vehicle.connectors.some(vc => {
    return stationConnectors.some(sc => {
      const s = sc.toLowerCase().trim();
      const v = vc.toLowerCase().trim();
      if (s === v) return true;
      if (v === 'ccs2' && (s.includes('ccs') || s.includes('ccs2'))) return true;
      if (v === 'type-2' && (s.includes('type 2') || s.includes('type-2') || s.includes('type2'))) return true;
      if (v === 'leccs' && (s.includes('leccs') || s.includes('type 7') || s.includes('ather'))) return true;
      if (v === 'bharat ac-001' && (s.includes('bharat ac') || s.includes('ac001') || s.includes('ac-001'))) return true;
      if (v === 'bharat dc-001' && (s.includes('bharat dc') || s.includes('dc001') || s.includes('dc-001'))) return true;
      if (v === 'ola hypercharger' && s.includes('ola')) return true;
      if (v === '16a 3-pin' && (s.includes('16a') || s.includes('3-pin') || s.includes('socket') || s.includes('bharat ac'))) return true;
      return false;
    });
  });
}
