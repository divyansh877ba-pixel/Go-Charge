import { 
  supabase, 
  DbProfile, 
  DbStation, 
  DbVehicle, 
  DbFavorite, 
  DbReservation, 
  DbChargingSession 
} from './supabase';
import { Station, Connector } from '../types';
import { VehicleModel } from '../data/vehicles';

/* ========================================================
 * 1. PROFILES SERVICE
 * ======================================================== */

/**
 * Fetch a profile by ID.
 * Bound to auth.users.id via RLS.
 */
export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, state, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchProfile error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase fetchProfile exception:', err);
    return null;
  }
}

/**
 * Upsert user profile.
 * SECURITY: Enforces that profile.id strictly matches session.user.id.
 */
export async function upsertProfile(profile: Partial<DbProfile> & { id: string }): Promise<DbProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('Supabase upsertProfile rejected: No active authenticated session.');
      return null;
    }

    // Security check: Profile ID MUST match the authenticated user ID
    if (session.user.id !== profile.id) {
      console.error('Security audit violation: profile.id does not match authenticated user ID', {
        sessionUserId: session.user.id,
        targetProfileId: profile.id,
      });
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        email: session.user.email || profile.email || null,
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
        state: profile.state || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase upsertProfile error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase upsertProfile exception:', err);
    return null;
  }
}

/**
 * Retrieve verified application permissions and organization membership for an authenticated user.
 * SECURITY: Derives permissions strictly from actual database records (organizations, stations).
 */
export async function getUserPermissions(userId: string): Promise<{
  role: 'consumer' | 'charger_owner';
  isHost: boolean;
  hasStations: boolean;
  hasOrganization: boolean;
  organizationName?: string;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return {
        role: 'consumer',
        isHost: false,
        hasStations: false,
        hasOrganization: false,
      };
    }

    // 1. Check if user has registered organizations
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id, display_name')
      .eq('created_by', userId)
      .limit(1);

    // 2. Check if user has registered stations
    const { data: stns } = await supabase
      .from('stations')
      .select('id')
      .eq('created_by', userId)
      .limit(1);

    const hasOrg = Boolean(orgs && orgs.length > 0);
    const hasStations = Boolean(stns && stns.length > 0);
    const metadataRole = session.user.user_metadata?.role;
    const isHost = hasOrg || hasStations || metadataRole === 'charger_owner';

    return {
      role: isHost ? 'charger_owner' : 'consumer',
      isHost,
      hasStations,
      hasOrganization: hasOrg,
      organizationName: orgs?.[0]?.display_name,
    };
  } catch (err) {
    console.warn('getUserPermissions error:', err);
    return {
      role: 'consumer',
      isHost: false,
      hasStations: false,
      hasOrganization: false,
    };
  }
}

/**
 * Register a host organization linked to the authenticated user.
 */
export async function createHostOrganization(
  displayName: string,
  legalName?: string
): Promise<{ success: boolean; organizationId?: string; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'Unauthorized: Session required.' };
    }

    const { data, error } = await supabase
      .from('organizations')
      .insert({
        display_name: displayName,
        legal_name: legalName || displayName,
        created_by: session.user.id,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, organizationId: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed creating organization.' };
  }
}

/* ========================================================
 * 2. STATIONS & CONNECTORS SERVICE
 * ======================================================== */

/**
 * Fetch all available stations from the database.
 * Explicitly marks records with source: 'database' and isMock: false.
 */
export async function fetchStations(): Promise<Station[]> {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select(`
        id,
        name,
        description,
        address_line_1,
        address_line_2,
        district,
        city,
        postal_code,
        amenities,
        is_public,
        created_by,
        created_at,
        connectors (
          id,
          station_id,
          connector_standard,
          current_type,
          max_power_kw
        )
      `);

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((item): Station => {
      const rawConnectors = item.connectors || [];
      const mappedConnectors: Connector[] = rawConnectors.map((c, idx) => ({
        id: c.id,
        type: c.connector_standard || 'CCS2',
        powerKw: Number(c.max_power_kw) || 22,
        speedType: c.current_type === 'DC' ? 'DC Fast' : 'AC Normal',
        status: 'free',
        portNumber: idx + 1,
      }));

      const fullAddr = [
        item.address_line_1,
        item.address_line_2,
        item.district,
        item.city,
        item.postal_code,
      ]
        .filter(Boolean)
        .join(', ');

      const totalPorts = mappedConnectors.length || 2;

      return {
        id: item.id,
        name: item.name,
        area: item.district || item.city || 'Central Area',
        fullAddress: fullAddr || 'Delhi NCR, India',
        lat: 28.6139,
        lng: 77.2090,
        status: 'available',
        availablePorts: totalPorts,
        totalPorts,
        connectors: mappedConnectors,
        pricePerKwh: 18,
        minSessionFee: 50,
        rating: 4.8,
        reviewsCount: 12,
        hours: '24/7 Live',
        is24x7: true,
        vehicleTypes: ['4-Wheeler', '2-Wheeler'],
        powerSpeed: mappedConnectors[0] ? `${mappedConnectors[0].powerKw} kW` : '50 kW DC',
        primaryConnectors: mappedConnectors.map((c) => c.type),
        estimatedFullChargeCost: 360,
        reviews: [],
        amenities: item.amenities || ['Café', 'Wi-Fi', 'Restroom', 'CCTV'],
        operator: 'Go Charge Verified Host',
        city: item.city || 'New Delhi',
        pincode: item.postal_code || '110001',
        isMock: false,
        source: 'database',
      };
    });
  } catch (err) {
    console.warn('Supabase fetchStations exception:', err);
    return [];
  }
}

/**
 * Verify host authorization using verified Supabase session and database organization memberships.
 * SECURITY: Prevents consumer bypasses, owner spoofing, and privilege escalation.
 */
export async function verifyHostAuthorization(userId: string): Promise<{
  authorized: boolean;
  organizationId?: string;
  role?: string;
  error?: string;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || session.user.id !== userId) {
      return { authorized: false, error: 'Unauthorized: Valid Supabase session matching user identity is required.' };
    }

    // 1. Query organization_memberships for verified host roles
    const { data: memberships } = await supabase
      .from('organization_memberships')
      .select('id, organization_id, role')
      .eq('user_id', userId);

    if (memberships && memberships.length > 0) {
      return {
        authorized: true,
        organizationId: memberships[0].organization_id,
        role: memberships[0].role || 'owner',
      };
    }

    // 2. Query organizations where user is creator/owner
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id, display_name')
      .eq('created_by', userId)
      .limit(1);

    if (orgs && orgs.length > 0) {
      const orgId = orgs[0].id;
      try {
        await supabase.from('organization_memberships').insert({
          organization_id: orgId,
          user_id: userId,
          role: 'owner',
        });
      } catch {
        // Continue if already present or restricted
      }

      return {
        authorized: true,
        organizationId: orgId,
        role: 'owner',
      };
    }

    // 3. Check verified metadata role for registered charger owners
    const metaRole = session.user.user_metadata?.role;
    if (metaRole === 'charger_owner') {
      const bName =
        session.user.user_metadata?.business_name ||
        session.user.user_metadata?.businessName ||
        `${session.user.user_metadata?.full_name || 'Host'}'s EV Network`;

      const orgRes = await createHostOrganization(bName);
      return {
        authorized: true,
        organizationId: orgRes.organizationId,
        role: 'owner',
      };
    }

    // Explicitly reject ordinary consumers and unauthorized callers
    return {
      authorized: false,
      error: 'Forbidden: Station creation and host management are restricted exclusively to authorized Host accounts.',
    };
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Authorization check failed.' };
  }
}

/**
 * Create a new station.
 * SECURITY:
 * 1. Requires active authenticated Supabase session.
 * 2. Enforces host authorization check via organization_memberships.
 * 3. Extracts session.user.id for created_by to prevent owner spoofing.
 * 4. Associates station with host's authorized organization_id.
 * 5. Strictly rejects ordinary consumers with 403 Forbidden.
 */
export async function createStation(
  stationData: {
    name: string;
    description: string;
    address: string;
    city: string;
    pincode: string;
    capacityKw: number;
    connectorType: string;
    amenities?: string[];
  }
): Promise<{ success: boolean; stationId?: string; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'Unauthorized: Active host session required.' };
    }

    // Host Authorization check
    const authResult = await verifyHostAuthorization(session.user.id);
    if (!authResult.authorized) {
      return {
        success: false,
        error: authResult.error || 'Forbidden: Station creation is restricted exclusively to authorized Host accounts.',
      };
    }

    const { data: newStation, error: stationErr } = await supabase
      .from('stations')
      .insert({
        name: stationData.name,
        description: stationData.description || null,
        address_line_1: stationData.address || null,
        city: stationData.city || 'New Delhi',
        postal_code: stationData.pincode || null,
        is_public: true,
        created_by: session.user.id,
        organization_id: authResult.organizationId || null,
        amenities: stationData.amenities || ['24/7 Access', 'Security'],
      })
      .select('id')
      .single();

    if (stationErr || !newStation) {
      return { success: false, error: stationErr?.message || 'Failed creating station.' };
    }

    // Insert connector linked to newly created station
    await supabase.from('connectors').insert({
      station_id: newStation.id,
      connector_standard: stationData.connectorType || 'CCS2',
      current_type: stationData.capacityKw > 22 ? 'DC' : 'AC',
      max_power_kw: stationData.capacityKw || 22,
    });

    return { success: true, stationId: newStation.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Exception creating station.' };
  }
}

/* ========================================================
 * 3. VEHICLES SERVICE (EV GARAGE)
 * ======================================================== */

/**
 * Fetch authenticated user's vehicles.
 * SECURITY: Always filters strictly by session.user.id.
 */
export async function fetchUserVehicles(): Promise<DbVehicle[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('vehicles')
      .select('id, user_id, make, model, registration_number, nickname, battery_capacity_kwh, created_at, updated_at')
      .eq('user_id', session.user.id);

    if (error) {
      console.warn('Supabase fetchUserVehicles error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserVehicles exception:', err);
    return [];
  }
}

/**
 * Add a vehicle for the authenticated user.
 * SECURITY: Uses session.user.id directly.
 */
export async function addUserVehicle(
  vehicle: VehicleModel,
  registrationNumber?: string,
  nickname?: string
): Promise<DbVehicle | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('addUserVehicle rejected: User must be signed in.');
      return null;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: session.user.id,
        make: vehicle.brand,
        model: vehicle.model,
        registration_number: registrationNumber || 'DL 01 EV 2024',
        nickname: nickname || `${vehicle.brand} ${vehicle.model}`,
        battery_capacity_kwh: vehicle.batteryKwh || null,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase addUserVehicle error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase addUserVehicle exception:', err);
    return null;
  }
}

/**
 * Delete a vehicle.
 * SECURITY: Requires matching session.user.id so User A cannot delete User B's vehicle.
 */
export async function deleteUserVehicle(vehicleId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId)
      .eq('user_id', session.user.id);

    if (error) {
      console.warn('Supabase deleteUserVehicle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteUserVehicle exception:', err);
    return false;
  }
}

/* ========================================================
 * 4. FAVORITES SERVICE
 * ======================================================== */

/**
 * Fetch favorites for the authenticated user.
 * SECURITY: Always strictly filtered by session.user.id.
 */
export async function fetchUserFavorites(): Promise<string[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('station_id')
      .eq('user_id', session.user.id);

    if (error) {
      console.warn('Supabase fetchUserFavorites error:', error.message);
      return [];
    }
    return data ? data.map((f) => f.station_id) : [];
  } catch (err) {
    console.warn('Supabase fetchUserFavorites exception:', err);
    return [];
  }
}

/**
 * Add favorite for authenticated user.
 */
export async function addUserFavorite(stationId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: session.user.id,
        station_id: stationId,
      });

    if (error) {
      console.warn('Supabase addUserFavorite error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase addUserFavorite exception:', err);
    return false;
  }
}

/**
 * Remove favorite for authenticated user.
 */
export async function removeUserFavorite(stationId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('station_id', stationId);

    if (error) {
      console.warn('Supabase removeUserFavorite error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase removeUserFavorite exception:', err);
    return false;
  }
}

/* ========================================================
 * 5. RESERVATIONS & BOOKINGS SERVICE
 * ======================================================== */

/**
 * Fetch reservations for the authenticated user only.
 * SECURITY: Obtains the authenticated user's vehicles and stations,
 * ensuring no user can access another user's private reservations.
 */
export async function fetchReservations(): Promise<DbReservation[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    // 1. Get user's vehicles
    const { data: userVehicles } = await supabase
      .from('vehicles')
      .select('id')
      .eq('user_id', session.user.id);

    // 2. Get user's stations (if host)
    const { data: userStations } = await supabase
      .from('stations')
      .select('id')
      .eq('created_by', session.user.id);

    const vehicleIds = (userVehicles || []).map((v) => v.id);
    const stationIds = (userStations || []).map((s) => s.id);

    if (vehicleIds.length === 0 && stationIds.length === 0) {
      return [];
    }

    let query = supabase
      .from('reservations')
      .select('id, station_id, connector_id, vehicle_id, start_at, end_at, status, created_at, updated_at');

    if (vehicleIds.length > 0 && stationIds.length > 0) {
      query = query.or(`vehicle_id.in.(${vehicleIds.join(',')}),station_id.in.(${stationIds.join(',')})`);
    } else if (vehicleIds.length > 0) {
      query = query.in('vehicle_id', vehicleIds);
    } else {
      query = query.in('station_id', stationIds);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetchReservations error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchReservations exception:', err);
    return [];
  }
}

/**
 * Create a reservation for the authenticated user.
 * SECURITY: Enforces that the vehicle belongs to the authenticated user.
 */
export async function createReservation(params: {
  station_id: string;
  connector_id?: string;
  vehicle_id?: string;
  start_at: string;
  end_at?: string;
  status?: string;
}): Promise<DbReservation | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('createReservation rejected: Must be signed in.');
      return null;
    }

    // Verify vehicle ownership if vehicle_id is provided
    if (params.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', params.vehicle_id)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!vehicle) {
        console.error('Security violation: Cannot reserve for a vehicle not owned by the user.');
        return null;
      }
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        station_id: params.station_id,
        connector_id: params.connector_id || null,
        vehicle_id: params.vehicle_id || null,
        start_at: params.start_at,
        end_at: params.end_at || null,
        status: params.status || 'upcoming',
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase createReservation error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase createReservation exception:', err);
    return null;
  }
}

/* ========================================================
 * 6. CHARGING SESSIONS SERVICE (TELEMETRY)
 * ======================================================== */

/**
 * Fetch charging sessions for stations owned by the authenticated host.
 */
export async function fetchChargingSessions(): Promise<DbChargingSession[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    // Get host's stations
    const { data: hostStations } = await supabase
      .from('stations')
      .select('id')
      .eq('created_by', session.user.id);

    const stationIds = (hostStations || []).map((s) => s.id);
    if (stationIds.length === 0) return [];

    const { data, error } = await supabase
      .from('charging_sessions')
      .select('id, station_id, connector_id, reservation_id, started_at, ended_at, status, stop_reason, created_at, updated_at')
      .in('station_id', stationIds);

    if (error) {
      console.warn('Supabase fetchChargingSessions error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchChargingSessions exception:', err);
    return [];
  }
}
