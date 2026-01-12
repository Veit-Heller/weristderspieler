import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMatch, joinMatch } from '../services/matchService';

export default function MultiplayerJoin({ onMatchJoined, onCancel, initialMatchId }) {
  // Prüfe URL für Match-ID
  const urlMatchId = window.location.pathname.match(/\/match\/([^/]+)/)?.[1];
  const [matchId, setMatchId] = useState(initialMatchId || urlMatchId || '');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);

  // Wenn Match-ID aus URL, automatisch prüfen
  useEffect(() => {
    if (urlMatchId && !matchId) {
      setMatchId(urlMatchId);
    }
  }, [urlMatchId]);

  const handleJoin = async () => {
    if (!matchId.trim()) {
      setError('Bitte gib die Match-ID ein');
      return;
    }
    if (!playerName.trim()) {
      setError('Bitte gib deinen Namen ein');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Prüfe ob Match existiert
      const match = await getMatch(matchId.trim().toUpperCase());
      
      if (match.status === 'finished') {
        setError('Dieses Match ist bereits beendet');
        setIsJoining(false);
        return;
      }

      if (match.opponent_name) {
        setError('Dieses Match hat bereits einen Gegner');
        setIsJoining(false);
        return;
      }

      // Trete Match bei
      const updatedMatch = await joinMatch(match.id, playerName.trim());
      onMatchJoined(updatedMatch);
    } catch (err) {
      setError('Match nicht gefunden oder Fehler beim Beitreten. Bitte überprüfe die Match-ID.');
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">👥 Match beitreten</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Match-ID
            </label>
            <input
              type="text"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value.toUpperCase())}
              placeholder="z.B. ABC123"
              className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors uppercase"
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dein Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="z.B. Marius"
              className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
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
              onClick={handleJoin}
              disabled={isJoining}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Tritt bei...' : 'Beitreten'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
