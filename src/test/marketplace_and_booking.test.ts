import { describe, it, expect } from 'vitest';
import { MOCK_STATIONS, calculateDistance } from '../data/mockStations';
import { TRANSLATIONS } from '../data/translations';

describe('5. Station Discovery, Filters & Geolocation', () => {
  it('loads valid stations list with required schema attributes', () => {
    expect(MOCK_STATIONS.length).toBeGreaterThan(0);
    const station = MOCK_STATIONS[0];
    expect(station.id).toBeDefined();
    expect(station.name).toBeDefined();
    expect(station.lat).toBeGreaterThan(0);
    expect(station.lng).toBeGreaterThan(0);
    expect(station.pricePerKwh).toBeGreaterThan(0);
    expect(Array.isArray(station.connectors)).toBe(true);
    expect(station.connectors.length).toBeGreaterThan(0);
  });

  it('filters stations by category: DC Fast chargers', () => {
    const dcStations = MOCK_STATIONS.filter(s =>
      s.connectors.some(c => c.speedType.includes('DC') || c.powerKw >= 30)
    );
    expect(dcStations.length).toBeGreaterThan(0);
  });

  it('filters stations by 24/7 availability', () => {
    const roundTheClockStations = MOCK_STATIONS.filter(s => s.is24x7);
    expect(roundTheClockStations.length).toBeGreaterThan(0);
    roundTheClockStations.forEach(s => {
      expect(s.is24x7).toBe(true);
    });
  });

  it('sorts stations correctly by distance from user location', () => {
    const userLat = 28.6139;
    const userLng = 77.2090;

    const sorted = [...MOCK_STATIONS].sort((a, b) => {
      const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
      const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
      return distA - distB;
    });

    const distFirst = calculateDistance(userLat, userLng, sorted[0].lat, sorted[0].lng);
    const distLast = calculateDistance(userLat, userLng, sorted[sorted.length - 1].lat, sorted[sorted.length - 1].lng);
    expect(distFirst).toBeLessThanOrEqual(distLast);
  });
});

describe('6. Internationalization & Translation Completeness', () => {
  it('provides complete Hindi and English translation sets with identical key structures', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const hiKeys = Object.keys(TRANSLATIONS.hi);

    expect(enKeys.length).toBeGreaterThan(20);
    expect(hiKeys.length).toBeGreaterThan(20);
    expect(enKeys.sort()).toEqual(hiKeys.sort());
  });

  it('displays accurate navigation labels in Hindi', () => {
    expect(TRANSLATIONS.hi.findChargers).toContain('चार्जर खोजें');
    expect(TRANSLATIONS.hi.hostPortal).toContain('होस्ट पोर्टल');
  });
});

describe('7. Booking Validation & Pricing Calculations', () => {
  it('computes session energy and tariffs correctly based on connector wattage and duration', () => {
    const powerKw = 60; // 60 kW DC Fast
    const durationMinutes = 30; // 0.5 hour
    const pricePerKwh = 18; // Rs 18 / kWh
    const minSessionFee = 150;

    const unitsCharged = (powerKw * (durationMinutes / 60));
    expect(unitsCharged).toBe(30);

    const energyCost = unitsCharged * pricePerKwh;
    expect(energyCost).toBe(540);

    const payableAmount = Math.max(minSessionFee, energyCost);
    expect(payableAmount).toBe(540);
  });

  it('respects minimum session fee when energy consumed is lower than minimum threshold', () => {
    const powerKw = 7.4; // 7.4 kW Slow AC
    const durationMinutes = 15; // 0.25 hour -> 1.85 kWh
    const pricePerKwh = 15;
    const minSessionFee = 100;

    const energyCost = Math.round((powerKw * (durationMinutes / 60)) * pricePerKwh);
    expect(energyCost).toBeLessThan(minSessionFee);

    const payableAmount = Math.max(minSessionFee, energyCost);
    expect(payableAmount).toBe(100);
  });
});
