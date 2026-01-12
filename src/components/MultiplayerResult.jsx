import React from 'react';
import { motion } from 'framer-motion';

export default function MultiplayerResult({ match, onPlayAgain, onNewMatch }) {
  const creatorPoints = match.creator_result?.points || match.creator_result?.totalPoints || 0;
  const opponentPoints = match.opponent_result?.points || match.opponent_result?.totalPoints || 0;
  const creatorWins = creatorPoints > opponentPoints;
  const opponentWins = opponentPoints > creatorPoints;
  const isDraw = creatorPoints === opponentPoints;

  // Spieler-Namen aus roundResults ableiten (beide Spieler haben die gleichen Spieler)
  const matchPlayers = React.useMemo(() => {
    const playersFromRounds = [];
    // Versuche zuerst von creator_result
    if (match.creator_result?.rounds) {
      match.creator_result.rounds.forEach(round => {
        if (round.playerName && !playersFromRounds.find(p => p.name === round.playerName)) {
          playersFromRounds.push({ name: round.playerName });
        }
      });
    }
    // Falls nicht vollständig, ergänze von opponent_result
    if (match.opponent_result?.rounds && playersFromRounds.length < 5) {
      match.opponent_result.rounds.forEach((round, index) => {
        if (round.playerName && !playersFromRounds.find(p => p.name === round.playerName)) {
          playersFromRounds.push({ name: round.playerName });
        } else if (!round.playerName && index < playersFromRounds.length) {
          // Falls kein playerName, aber Index existiert, verwende bereits vorhandenen
        }
      });
    }
    // Stelle sicher, dass wir genau 5 Spieler haben
    while (playersFromRounds.length < 5) {
      playersFromRounds.push({ name: `Spieler ${playersFromRounds.length + 1}` });
    }
    return playersFromRounds.slice(0, 5);
  }, [match.creator_result?.rounds, match.opponent_result?.rounds]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">🏆 Ergebnis</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Creator */}
          <div className={`rounded-xl p-6 border-2 ${
            creatorWins 
              ? 'bg-green-500/20 border-green-500' 
              : isDraw 
                ? 'bg-yellow-500/20 border-yellow-500'
                : 'bg-slate-700 border-slate-600'
          }`}>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Spieler 1</p>
              <p className="text-xl font-bold mb-4">{match.creator_name}</p>
              <p className="text-4xl font-bold">{creatorPoints}</p>
              <p className="text-slate-400 text-sm mt-2">Punkte</p>
              {creatorWins && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 text-3xl"
                >
                  🏆
                </motion.div>
              )}
            </div>
          </div>

          {/* Opponent */}
          <div className={`rounded-xl p-6 border-2 ${
            opponentWins 
              ? 'bg-green-500/20 border-green-500' 
              : isDraw 
                ? 'bg-yellow-500/20 border-yellow-500'
                : 'bg-slate-700 border-slate-600'
          }`}>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Spieler 2</p>
              <p className="text-xl font-bold mb-4">{match.opponent_name}</p>
              <p className="text-4xl font-bold">{opponentPoints}</p>
              <p className="text-slate-400 text-sm mt-2">Punkte</p>
              {opponentWins && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 text-3xl"
                >
                  🏆
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Winner Message */}
        {isDraw ? (
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-yellow-400">Unentschieden! 🤝</p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-green-400">
              {creatorWins ? `${match.creator_name} gewinnt!` : `${match.opponent_name} gewinnt!`}
            </p>
          </div>
        )}

        {/* Round Details */}
        <div className="bg-slate-700 rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-4 text-center">Runden-Details</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((round) => {
              const creatorRound = match.creator_result?.rounds?.[round - 1];
              const opponentRound = match.opponent_result?.rounds?.[round - 1];
              const playerName = creatorRound?.playerName || opponentRound?.playerName || matchPlayers[round - 1]?.name || `Spieler ${round}`;
              return (
                <div key={round} className="bg-slate-600 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Runde {round}</span>
                    <span className="text-xs text-slate-400 italic">{playerName}</span>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <span className="text-sm">{match.creator_name}: <span className="font-bold">{creatorRound?.points || 0}</span></span>
                    <span className="text-sm">{match.opponent_name}: <span className="font-bold">{opponentRound?.points || 0}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onNewMatch}
            className="flex-1 bg-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors"
          >
            Neues Match
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
          >
            Nochmal spielen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
