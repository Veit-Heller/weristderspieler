import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Prüfe ob Environment Variables gesetzt sind
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase Environment Variables nicht gesetzt!');
  console.warn('Für lokale Entwicklung: Erstelle eine .env Datei mit VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY');
  console.warn('Für Produktion: Setze die Umgebungsvariablen in deinem Deployment-Service (z.B. Vercel)');
}

// Erstelle Supabase Client nur wenn Variablen gesetzt sind
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Test-Verbindung beim Start (nur wenn Client erstellt wurde)
    supabase.from('matches').select('count').limit(1)
      .then(() => console.log('✅ Supabase Verbindung erfolgreich'))
      .catch((err) => console.error('❌ Supabase Verbindungsfehler:', err.message));
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Supabase Clients:', error);
  }
} else {
  console.error('❌ Supabase Client konnte nicht erstellt werden: Umgebungsvariablen fehlen');
}

export { supabase };
