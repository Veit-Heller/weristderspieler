import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Beispieldaten - Später könntest du diese aus einer API laden
const PLAYERS_DATA = [
  {
    id: 1,
    name: "Cristiano Ronaldo",
    clubs: ["Sporting Lissabon", "Manchester United", "Real Madrid", "Juventus Turin", "Al-Nassr"],
    options: ["Cristiano Ronaldo", "Luis Figo", "Bruno Fernandes", "Nani"]
  },
  {
    id: 2,
    name: "Lionel Messi",
    clubs: ["FC Barcelona", "PSG", "Inter Miami"],
    options: ["Neymar Jr", "Lionel Messi", "Angel Di Maria", "Luis Suarez"]
  },
  {
    id: 3,
    name: "Toni Kroos",
    clubs: ["Hansa Rostock", "Bayer Leverkusen", "Bayern München", "Real Madrid"],
    options: ["Thomas Müller", "Toni Kroos", "Mesut Özil", "Bastian Schweinsteiger"]
  }
];

export default function FootballQuiz() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'result'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentPlayer = PLAYERS_DATA[currentLevel];

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    
    if (answer === currentPlayer.name) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentLevel < PLAYERS_DATA.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setSelectedAnswer(null);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Wer ist der Spieler?
      </h1>

      {gameState === 'playing' ? (
        <div className="w-full max-w-md">
          {/* Club-Liste */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl mb-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest">Stationen:</p>
            <div className="flex flex-wrap gap-2">
              {currentPlayer.clubs.map((club, index) => (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={club}
                  className="bg-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-600"
                >
                  {club}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Antwort-Optionen */}
          <div className="grid grid-cols-1 gap-3">
            {currentPlayer.options.map((option) => {
              const isCorrect = option === currentPlayer.name;
              const isSelected = selectedAnswer === option;
              
              let bgColor = "bg-slate-800";
              if (selectedAnswer) {
                if (isCorrect) bgColor = "bg-green-500 border-green-400";
                else if (isSelected) bgColor = "bg-red-500 border-red-400";
              }

              return (
                <motion.button
                  whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                  whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`${bgColor} p-4 rounded-xl border border-slate-700 transition-colors duration-300 text-left font-semibold`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 text-center text-slate-500 uppercase text-xs tracking-widest">
            Level {currentLevel + 1} von {PLAYERS_DATA.length} | Score: {score}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700"
        >
          <h2 className="text-4xl font-bold mb-4">Spiel beendet! ⚽️</h2>
          <p className="text-xl mb-6 text-slate-300 text-balance">
            Du hast {score} von {PLAYERS_DATA.length} Spielern erkannt.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
          >
            Nochmal spielen
          </button>
        </motion.div>
      )}
    </div>
  );
}

