import { describe, it, expect } from 'vitest';
import { formatAuthErrorMessage } from '../hooks/useAuth';
import { verifyHostAuthorization, getUserPermissions } from '../lib/supabaseService';
import { calculateDistance } from '../data/mockStations';
import { isStationCompatibleWithVehicle, INDIAN_EV_DATABASE } from '../data/vehicles';

describe('1. Authentication Validation & Error Formatting', () => {
  it('formats rate limit errors correctly with safety cooldown explanation', () => {
    const errorMsg = formatAuthErrorMessage('over_email_send_rate_limit');
    expect(errorMsg).toContain('Email rate limit reached');
  });

  it('formats duplicate registration error clearly', () => {
    const errorMsg = formatAuthErrorMessage('User already registered');
    expect(errorMsg).toContain('already registered');
  });

  it('handles generic error gracefully without leaking secrets', () => {
    const errorMsg = formatAuthErrorMessage('Invalid login credentials');
    expect(errorMsg).toBe('Invalid login credentials');
  });
});

describe('2. Authorization, Role Boundaries & Add Charger Restriction', () => {
  it('rejects station creation when user ID does not match active session or user is unauthenticated', async () => {
    const result = await verifyHostAuthorization('unauthenticated-user-id');
    expect(result.authorized).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('retrieves default consumer permissions when no session is active', async () => {
    const perms = await getUserPermissions('unauthenticated-user-id');
    expect(perms.role).toBe('consumer');
    expect(perms.isHost).toBe(false);
    expect(perms.isConsumer).toBe(false);
  });
});

describe('3. Vehicle Compatibility & Station Discovery Algorithms', () => {
  it('calculates geographic distance accurately between two GPS points', () => {
    // Distance between Connaught Place (28.6315, 77.2167) and India Gate (28.6129, 77.2295) is approx ~2.4 km
    const dist = calculateDistance(28.6315, 77.2167, 28.6129, 77.2295);
    expect(dist).toBeGreaterThan(1.5);
    expect(dist).toBeLessThan(3.5);
  });

  it('verifies vehicle connector compatibility with CCS2 stations', () => {
    const tataNexon = INDIAN_EV_DATABASE.find(v => v.model.includes('Nexon'));
    expect(tataNexon).toBeDefined();

    const mockCcsStation: any = {
      id: 'st-1',
      name: 'Delhi Fast Hub',
      primaryConnectors: ['CCS2'],
      connectors: [{ id: 'c1', type: 'CCS2', powerKw: 60, speedType: 'DC Fast' }]
    };

    if (tataNexon) {
      const compatible = isStationCompatibleWithVehicle(mockCcsStation, tataNexon);
      expect(compatible).toBe(true);
    }
  });

  it('rejects vehicle connector compatibility when vehicle does not support station connector', () => {
    const atherScooter = INDIAN_EV_DATABASE.find(v => v.brand.includes('Ather'));
    expect(atherScooter).toBeDefined();

    const mockCcsStation: any = {
      id: 'st-1',
      name: 'DC Super Hub',
      primaryConnectors: ['CCS2'],
      connectors: [{ id: 'c1', type: 'CCS2', powerKw: 150, speedType: 'DC Fast' }]
    };

    if (atherScooter) {
      const compatible = isStationCompatibleWithVehicle(mockCcsStation, atherScooter);
      expect(compatible).toBe(false);
    }
  });
});
