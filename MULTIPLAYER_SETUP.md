# Multiplayer Setup Anleitung

## 1. Supabase Projekt erstellen

1. Gehe zu https://supabase.com und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Warte bis das Projekt fertig eingerichtet ist

## 2. Datenbank-Tabelle erstellen

Gehe in dein Supabase-Projekt → SQL Editor und führe folgendes SQL aus:

```sql
-- Erstelle die Matches-Tabelle
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_name TEXT NOT NULL,
  opponent_name TEXT,
  seed BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  creator_result JSONB,
  opponent_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erlaube öffentlichen Zugriff (für Demo-Zwecke)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON matches
  FOR UPDATE USING (true);
```

## 3. Environment Variables setzen

1. Kopiere `.env.example` zu `.env`
2. Öffne dein Supabase-Projekt → Settings → API
3. Kopiere die folgenden Werte:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Füge sie in die `.env` Datei ein

## 4. Dependencies installieren

```bash
npm install
```

## 5. App starten

```bash
npm run dev
```

## Fertig! 🎉

Jetzt kannst du:
- Ein Match erstellen
- Die Match-ID mit einem Freund teilen
- Beide spielen die gleichen 5 Spieler
- Am Ende wird verglichen, wer gewonnen hat

## Troubleshooting

**Fehler: "Failed to fetch"**
- Prüfe ob die Supabase URL und Key korrekt in `.env` sind
- Stelle sicher, dass die Tabelle `matches` existiert
- Prüfe die RLS (Row Level Security) Policies

**Match wird nicht erstellt**
- Öffne die Browser-Konsole (F12) und schaue nach Fehlern
- Prüfe ob Supabase-Projekt aktiv ist
