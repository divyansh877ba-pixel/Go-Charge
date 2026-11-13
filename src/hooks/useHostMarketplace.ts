import { useState, useEffect, useCallback, useMemo } from 'react';
import { HostCharger, HostBooking, HostTransaction, HostProfile, BookingStatus } from '../types/host';
import { 
  INITIAL_HOST_CHARGERS, 
  INITIAL_HOST_BOOKINGS, 
  INITIAL_HOST_PROFILE, 
  INITIAL_TRANSACTIONS, 
  MONTHLY_EARNINGS_DATA 
} from '../data/mockHostData';
import { Station } from '../types';

const CHARGERS_KEY = 'gocharge_host_chargers_v1';
const BOOKINGS_KEY = 'gocharge_host_bookings_v1';
const PROFILE_KEY = 'gocharge_host_profile_v1';
const TRANSACTIONS_KEY = 'gocharge_host_transactions_v1';

export function useHostMarketplace() {
  // 1. Host Chargers State with localStorage Persistence
  const [chargers, setChargers] = useState<HostCharger[]>(() => {
    try {
      const stored = localStorage.getItem(CHARGERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_HOST_CHARGERS;
    } catch {
      return INITIAL_HOST_CHARGERS;
    }
  });

  // 2. Bookings State with localStorage Persistence
  const [bookings, setBookings] = useState<HostBooking[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_HOST_BOOKINGS;
    } catch {
      return INITIAL_HOST_BOOKINGS;
    }
  });

  // 3. Transactions State
  const [transactions, setTransactions] = useState<HostTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // 4. Host Profile State
  const [profile, setProfile] = useState<HostProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_HOST_PROFILE;
    } catch {
      return INITIAL_HOST_PROFILE;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHARGERS_KEY, JSON.stringify(chargers));
    } catch (e) {
      console.warn('Failed saving chargers to localStorage:', e);
    }
  }, [chargers]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed saving bookings to localStorage:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed saving profile to localStorage:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed saving transactions to localStorage:', e);
    }
  }, [transactions]);

  // Action: Add New Charger from 5-step registration wizard
  const addCharger = useCallback((newChargerData: Omit<HostCharger, 'id' | 'createdAt' | 'totalBookings' | 'totalEarnings' | 'rating' | 'reviewsCount'>): HostCharger => {
    const id = `hc-${Date.now()}`;
    const newCharger: HostCharger = {
      ...newChargerData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      totalEarnings: 0,
      rating: 5.0,
      reviewsCount: 1,
      status: 'pending' // Initial status is pending review
    };

    setChargers((prev) => [newCharger, ...prev]);
    return newCharger;
  }, []);

  // Action: Update Charger
  const updateCharger = useCallback((id: string, updates: Partial<HostCharger>) => {
    setChargers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  // Action: Toggle Pause / Active
  const toggleChargerPause = useCallback((id: string) => {
    setChargers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'paused' ? 'active' : 'paused';
        return { ...c, status: nextStatus };
      })
    );
  }, []);

  // Action: Delete Charger
  const deleteCharger = useCallback((id: string) => {
    setChargers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Action: Update Profile
  const updateProfile = useCallback((updates: Partial<HostProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  // Action: Update Booking Status
  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  // Convert HostCharger to Station format for customer discovery map
  const convertToStation = useCallback((charger: HostCharger): Station => {
    return {
      id: charger.id,
      name: charger.name,
      area: `${charger.city}, ${charger.state}`,
      fullAddress: `${charger.address}, ${charger.city}, ${charger.state} ${charger.pincode}`,
      lat: charger.lat,
      lng: charger.lng,
      status: charger.status === 'active' ? 'available' : charger.status === 'paused' ? 'busy' : 'partial',
      availablePorts: charger.status === 'active' ? 2 : 0,
      totalPorts: 2,
      pricePerKwh: charger.pricePerKwh,
      minSessionFee: Math.round(charger.pricePerKwh * (charger.minDurationMinutes / 60) * 10),
      rating: charger.rating,
      reviewsCount: charger.reviewsCount,
      hours: charger.is24x7 ? '24/7' : `${charger.openingTime} – ${charger.closingTime}`,
      is24x7: charger.is24x7,
      vehicleTypes: ['4-Wheeler', '2-Wheeler'],
      powerSpeed: `${charger.capacityKw >= 50 ? 'DC Fast' : 'AC Fast'} · ${charger.capacityKw} kW`,
      primaryConnectors: [charger.connectorType],
      estimatedFullChargeCost: Math.round(charger.pricePerKwh * 20),
      operator: 'Community Host Partner',
      amenities: ['Verified Host Bay', 'Covered Parking', 'Illuminated Bay', 'Security'],
      connectors: [
        {
          id: `${charger.id}-c1`,
          type: (charger.connectorType === 'GB/T' ? 'CCS2' : charger.connectorType) as any,
          powerKw: charger.capacityKw,
          speedType: charger.capacityKw >= 50 ? 'DC Fast' : 'AC Fast',
          status: 'free',
          portNumber: 1
        },
        {
          id: `${charger.id}-c2`,
          type: (charger.connectorType === 'GB/T' ? 'CCS2' : charger.connectorType) as any,
          powerKw: charger.capacityKw,
          speedType: charger.capacityKw >= 50 ? 'DC Fast' : 'AC Fast',
          status: 'free',
          portNumber: 2
        }
      ],
      reviews: [
        {
          id: `${charger.id}-r1`,
          author: 'Go Charge Verified Driver',
          rating: 5,
          date: 'Recently',
          vehicle: 'Tata Nexon EV Max',
          comment: 'Very convenient host charger, smooth access and clean driveway.'
        }
      ]
    };
  }, []);

  // Computed summary metrics
  const summaryMetrics = useMemo(() => {
    const totalChargers = chargers.length;
    const activeListings = chargers.filter((c) => c.status === 'active').length;
    const pendingApproval = chargers.filter((c) => c.status === 'pending').length;
    const pausedListings = chargers.filter((c) => c.status === 'paused').length;
    const totalBookings = bookings.length;
    const totalEarnings = chargers.reduce((sum, c) => sum + (c.totalEarnings || 0), 0);
    const pendingPayouts = transactions
      .filter((t) => t.status === 'pending_payout' || t.status === 'pending')
      .reduce((sum, t) => sum + (t.amount || t.netPayout || 0), 0);

    return {
      totalChargers,
      activeListings,
      pendingApproval,
      pausedListings,
      totalBookings,
      totalEarnings,
      monthlyEarnings: 31200, // Current month illustrative mock
      pendingPayouts
    };
  }, [chargers, bookings, transactions]);

  return {
    chargers,
    bookings,
    transactions,
    profile,
    monthlyEarningsData: MONTHLY_EARNINGS_DATA,
    summaryMetrics,
    addCharger,
    updateCharger,
    toggleChargerPause,
    deleteCharger,
    updateProfile,
    updateBookingStatus,
    convertToStation
  };
}
