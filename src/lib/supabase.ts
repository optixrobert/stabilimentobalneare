import { createClient } from '@supabase/supabase-js';

// Environment variables should be defined in .env
// VITE_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate config
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Database features will be disabled.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper types matching our DB schema
export type Database = {
  public: {
    Tables: {
      establishment_settings: {
        Row: { id: string; name: string; rows: number; cols: number; created_at: string; updated_at: string };
        Insert: { name?: string; rows?: number; cols?: number };
        Update: { name?: string; rows?: number; cols?: number };
      };
      umbrella_spots: {
        Row: { id: string; row_label: string; number: number; status: 'free'|'occupied'|'reserved'; sunbeds: number };
        Insert: { id: string; row_label: string; number: number; status?: 'free'|'occupied'|'reserved'; sunbeds?: number };
        Update: { status?: 'free'|'occupied'|'reserved'; sunbeds?: number };
      };
      // ... Add other tables as needed
    };
  };
};
