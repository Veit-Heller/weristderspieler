import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createMatch } from '../services/matchService';

export default function MultiplayerCreate({ onMatchCreated, onCancel }) {
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setError('Bitte gib deinen Namen ein');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const match = await createMatch(playerName.trim());
      onMatchCreated(match);
    } catch (err) {
      console.error('Fehler beim Erstellen:', err);
      // Detailliertere Fehlermeldung
      if (err.message?.includes('relation "matches" does not exist')) {
        setError('Die Datenbank-Tabelle existiert nicht. Bitte führe das SQL-Script aus MULTIPLAYER_SETUP.md aus.');
      } else if (err.message?.includes('permission denied') || err.message?.includes('new row violates row-level security')) {
        setError('Berechtigungsfehler. Prüfe die RLS Policies in Supabase.');
      } else {
        setError(`Fehler: ${err.message || 'Unbekannter Fehler'}. Öffne die Konsole (F12) für Details.`);
      }
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">👥 Multiplayer Match erstellen</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dein Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="z.B. Max"
              className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Erstelle...' : 'Match erstellen'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
