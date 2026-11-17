import { describe, it, expect } from 'vitest';
import { fetchStations, fetchProfile, fetchUserFavorites, fetchUserVehicles, fetchReservations } from '../lib/supabaseService';

describe('4. Database & Supabase Services Resiliency', () => {
  it('fetchStations returns array and does not throw permission errors', async () => {
    const stations = await fetchStations();
    expect(Array.isArray(stations)).toBe(true);
  });

  it('fetchProfile gracefully handles unauthenticated callers', async () => {
    const profile = await fetchProfile('dummy-unauthenticated-id');
    expect(profile).toBeNull();
  });

  it('fetchUserFavorites returns empty array when unauthenticated', async () => {
    const favorites = await fetchUserFavorites();
    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites.length).toBe(0);
  });

  it('fetchUserVehicles returns empty array when unauthenticated', async () => {
    const vehicles = await fetchUserVehicles();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBe(0);
  });

  it('fetchReservations returns empty array when unauthenticated', async () => {
    const reservations = await fetchReservations();
    expect(Array.isArray(reservations)).toBe(true);
    expect(reservations.length).toBe(0);
  });
});
