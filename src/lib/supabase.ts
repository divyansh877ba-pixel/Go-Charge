/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Publishable Key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Entity Types matching existing schema
export interface DbProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  state: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbStation {
  id: string;
  name: string;
  description: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  district: string | null;
  city: string | null;
  postal_code: string | null;
  amenities: string[] | null;
  location?: unknown;
  opening_hours?: unknown;
  is_public: boolean | null;
  created_by: string | null;
  created_at?: string;
  updated_at?: string;
  connectors?: DbConnector[];
}

export interface DbConnector {
  id: string;
  station_id: string;
  connector_standard: string;
  current_type: string | null;
  max_power_kw: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbVehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  registration_number: string | null;
  nickname: string | null;
  battery_capacity_kwh: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbFavorite {
  user_id: string;
  station_id: string;
  created_at?: string;
}

export interface DbReservation {
  id: string;
  station_id: string | null;
  connector_id: string | null;
  vehicle_id: string | null;
  start_at: string | null;
  end_at: string | null;
  status: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbChargingSession {
  id: string;
  station_id: string | null;
  connector_id: string | null;
  reservation_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  status: string | null;
  stop_reason: string | null;
  created_at?: string;
  updated_at?: string;
}
