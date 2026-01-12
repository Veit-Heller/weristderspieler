import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Debug: Prüfe ob Environment Variables gesetzt sind
if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ Supabase Environment Variables nicht gesetzt! Bitte fülle die .env Datei aus.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test-Verbindung beim Start
supabase.from('matches').select('count').limit(1)
  .then(() => console.log('✅ Supabase Verbindung erfolgreich'))
  .catch((err) => console.error('❌ Supabase Verbindungsfehler:', err.message))
