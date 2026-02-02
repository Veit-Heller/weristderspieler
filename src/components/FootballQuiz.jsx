import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import MultiplayerCreate from './MultiplayerCreate';
import MultiplayerJoin from './MultiplayerJoin';
import MultiplayerResult from './MultiplayerResult';
import TipsModal from './TipsModal';
import { submitCreatorResult, submitOpponentResult, getMatch } from '../services/matchService';
import { useMatch } from '../contexts/MatchContext';
import { PLAYERS_DATA } from '../data/players';
import { shuffleArray, seededShuffleArray } from '../utils/shuffle';
import { fuzzyMatch } from '../utils/fuzzyMatch';

const TIP_COSTS = {
  age: 15,
  nationality: 20,
  allStations: 20,
  currentClub: 20,
  sortStations: 20,
};

const INITIAL_GAME_STATE = {
  currentLevel: 0,
  streak: 0,
  points: 0,
  gameState: 'playing',
  selectedAnswer: null,
  showStreakReset: false,
  inputValue: '',
  showTipsModal: false,
  revealedTips: {},
  tipsCostThisRound: 0,
  showAllStations: false,
  stationsSorted: false,
  roundResults: [],
  copyFeedback: false,
  saveFeedback: null,
};

export default function FootballQuiz({ mode: initialMode, navigate, multiplayerState: initialMultiplayerState, urlMatchId: urlMatchIdProp }) {
  const { currentMatch, setCurrentMatch, isCreator, setIsCreator, setMatchState } = useMatch();

  const urlMatchId = useMemo(() => {
    if (urlMatchIdProp) return urlMatchIdProp;
    const path = window.location.pathname;
    const match = path.match(/\/match\/([^/]+)/);
    return match ? match[1] : null;
  }, [urlMatchIdProp]);

  const [multiplayerState, setMultiplayerState] = useState(initialMultiplayerState || null);
  const [mode, setMode] = useState(initialMode || null);

  // Game state
  const [currentLevel, setCurrentLevel] = useState(INITIAL_GAME_STATE.currentLevel);
  const [streak, setStreak] = useState(INITIAL_GAME_STATE.streak);
  const [points, setPoints] = useState(INITIAL_GAME_STATE.points);
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE.gameState);
  const [selectedAnswer, setSelectedAnswer] = useState(INITIAL_GAME_STATE.selectedAnswer);
  const [showStreakReset, setShowStreakReset] = useState(INITIAL_GAME_STATE.showStreakReset);
  const [inputValue, setInputValue] = useState(INITIAL_GAME_STATE.inputValue);
  const [showTipsModal, setShowTipsModal] = useState(INITIAL_GAME_STATE.showTipsModal);
  const [revealedTips, setRevealedTips] = useState(INITIAL_GAME_STATE.revealedTips);
  const [tipsCostThisRound, setTipsCostThisRound] = useState(INITIAL_GAME_STATE.tipsCostThisRound);
  const [showAllStations, setShowAllStations] = useState(INITIAL_GAME_STATE.showAllStations);
  const [stationsSorted, setStationsSorted] = useState(INITIAL_GAME_STATE.stationsSorted);
  const [roundResults, setRoundResults] = useState(INITIAL_GAME_STATE.roundResults);
  const [copyFeedback, setCopyFeedback] = useState(INITIAL_GAME_STATE.copyFeedback);
  const [saveFeedback, setSaveFeedback] = useState(INITIAL_GAME_STATE.saveFeedback);

  // Zentrales Reset aller Spielzustaende
  const resetGameState = useCallback(() => {
    setCurrentLevel(INITIAL_GAME_STATE.currentLevel);
    setStreak(INITIAL_GAME_STATE.streak);
    setPoints(INITIAL_GAME_STATE.points);
    setGameState(INITIAL_GAME_STATE.gameState);
    setSelectedAnswer(INITIAL_GAME_STATE.selectedAnswer);
    setShowStreakReset(INITIAL_GAME_STATE.showStreakReset);
    setInputValue(INITIAL_GAME_STATE.inputValue);
    setShowTipsModal(INITIAL_GAME_STATE.showTipsModal);
    setRevealedTips(INITIAL_GAME_STATE.revealedTips);
    setTipsCostThisRound(INITIAL_GAME_STATE.tipsCostThisRound);
    setShowAllStations(INITIAL_GAME_STATE.showAllStations);
    setStationsSorted(INITIAL_GAME_STATE.stationsSorted);
    setRoundResults(INITIAL_GAME_STATE.roundResults);
    setCopyFeedback(INITIAL_GAME_STATE.copyFeedback);
    setSaveFeedback(INITIAL_GAME_STATE.saveFeedback);
  }, []);

  // Reset nur fuer naechste Runde
  const resetRoundState = useCallback(() => {
    setSelectedAnswer(null);
    setInputValue('');
    setRevealedTips({});
    setTipsCostThisRound(0);
    setShowAllStations(false);
    setStationsSorted(false);
  }, []);

  // Wenn Context-Match vorhanden und URL Match-ID passt
  useEffect(() => {
    if (currentMatch && urlMatchId && currentMatch.id === urlMatchId && !mode) {
      setMode('multiplayer');
      setMultiplayerState('playing');
    }
  }, [currentMatch, urlMatchId, mode]);

  // URL Match-ID: automatisch Match laden oder Join-Seite zeigen
  useEffect(() => {
    if (urlMatchId && !currentMatch && multiplayerState === null && mode !== 'multiplayer' && initialMode === null) {
      const checkMatch = async () => {
        try {
          const match = await getMatch(urlMatchId);

          if (match.creator_result && match.opponent_result) {
            setCurrentMatch(match);
            setIsCreator(false);
            setMode('multiplayer');
            setMultiplayerState('result');
          } else if (match.creator_result && !match.opponent_result) {
            if (isCreator && currentMatch?.id === match.id) {
              setCurrentMatch(match);
              setMode('multiplayer');
              setGameState('finished');
              setPoints(match.creator_result?.points || 0);
            } else {
              setMultiplayerState('join');
            }
          } else {
            setMultiplayerState('join');
          }
        } catch {
          setMultiplayerState('join');
        }
      };
      checkMatch();
    }
  }, [urlMatchId, currentMatch, multiplayerState, mode, initialMode, isCreator]);

  // Spieler-Liste: seed-basiert fuer Multiplayer, zufaellig fuer Solo
  const shuffledPlayers = useMemo(() => {
    if (currentMatch?.seed) {
      return seededShuffleArray(PLAYERS_DATA, currentMatch.seed).slice(0, 5);
    }
    return shuffleArray(PLAYERS_DATA).slice(0, 5);
  }, [currentMatch?.seed]);

  const currentPlayer = shuffledPlayers[currentLevel];

  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentPlayer.options);
  }, [currentLevel]);

  const stationsToShow = useMemo(() => {
    let stations = [...currentPlayer.clubs];
    if (stationsSorted) {
      stations = [...stations].sort();
    }
    if (!showAllStations) {
      stations = shuffleArray([...currentPlayer.clubs]).slice(0, 4);
    }
    return stations;
  }, [currentLevel, showAllStations, stationsSorted, currentPlayer]);

  // Training: Antwort-Handler
  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);

    if (answer === currentPlayer.name) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak >= 5) {
        setTimeout(() => setGameState('finished'), 1500);
        return;
      }

      setTimeout(() => {
        if (currentLevel < shuffledPlayers.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
        } else {
          setGameState('finished');
        }
      }, 1500);
    } else {
      setShowStreakReset(true);
      setTimeout(() => {
        setStreak(0);
        setShowStreakReset(false);
        if (currentLevel < shuffledPlayers.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
        } else {
          setGameState('finished');
        }
      }, 2000);
    }
  };

  // Multiplayer-Ergebnis speichern
  const saveMultiplayerResult = async () => {
    if (!currentMatch) return;

    const result = {
      points: points,
      rounds: roundResults,
    };

    try {
      if (isCreator) {
        await submitCreatorResult(currentMatch.id, result);
      } else {
        await submitOpponentResult(currentMatch.id, result);
      }

      const updatedMatch = await getMatch(currentMatch.id);
      setCurrentMatch(updatedMatch);

      if (updatedMatch.creator_result && updatedMatch.opponent_result) {
        setMultiplayerState('result');
      }
    } catch (error) {
      console.error('Error saving result:', error);
      setSaveFeedback('Fehler beim Speichern. Bitte versuche es erneut.');
      setTimeout(() => setSaveFeedback(null), 4000);
    }
  };

  // Wettkampf/Multiplayer: Antwort-Handler
  const handleCompetitionSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || selectedAnswer) return;

    const isCorrect = fuzzyMatch(inputValue.trim(), currentPlayer.name);
    setSelectedAnswer(inputValue.trim());

    const pointsThisRound = isCorrect ? Math.max(0, 100 - tipsCostThisRound) : 0;
    if (isCorrect) {
      setPoints(points + pointsThisRound);
    }

    if (mode === 'multiplayer') {
      setRoundResults(prev => [...prev, {
        points: pointsThisRound,
        tipsUsed: tipsCostThisRound,
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
      }]);
    }

    const delay = isCorrect ? 1500 : 2000;
    setTimeout(() => {
      const maxLevel = 5;
      if (currentLevel < maxLevel - 1) {
        setCurrentLevel(currentLevel + 1);
        resetRoundState();
      } else {
        setGameState('finished');
        if (mode === 'multiplayer') {
          saveMultiplayerResult();
        }
      }
    }, delay);
  };

  // Tipp kaufen
  const buyTip = (tipType) => {
    const cost = TIP_COSTS[tipType];
    if (!revealedTips[tipType]) {
      setTipsCostThisRound(tipsCostThisRound + cost);
      setRevealedTips({ ...revealedTips, [tipType]: true });
      if (tipType === 'allStations') setShowAllStations(true);
      if (tipType === 'sortStations') setStationsSorted(true);
    }
  };

  // Link kopieren mit Inline-Feedback
  const handleCopyLink = () => {
    const link = `${window.location.origin}/match/${currentMatch.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }).catch(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // Ergebnis pruefen (Multiplayer)
  const checkResult = async () => {
    const updatedMatch = await getMatch(currentMatch.id);
    if (updatedMatch.creator_result && updatedMatch.opponent_result) {
      setCurrentMatch(updatedMatch);
      setMultiplayerState('result');
    }
  };

  // --- RENDER ---

  // Multiplayer: Match erstellen
  if (multiplayerState === 'create') {
    return (
      <MultiplayerCreate
        onMatchCreated={(match) => {
          setCurrentMatch(match);
          setIsCreator(true);
          setMatchState('playing');
          setMultiplayerState('playing');
          setMode('multiplayer');
          resetGameState();
          if (navigate) navigate(`/match/${match.id}`);
        }}
        onCancel={() => setMultiplayerState(null)}
      />
    );
  }

  // Multiplayer: Match beitreten
  if (multiplayerState === 'join') {
    return (
      <MultiplayerJoin
        initialMatchId={urlMatchId}
        onMatchJoined={(match) => {
          setCurrentMatch(match);
          setIsCreator(false);
          setMultiplayerState('playing');
          setMode('multiplayer');
          resetGameState();
          if (navigate) navigate(`/match/${match.id}`);
        }}
        onCancel={() => {
          setMultiplayerState(null);
          if (navigate) navigate('/');
        }}
      />
    );
  }

  // Multiplayer: Ergebnis
  if (multiplayerState === 'result') {
    return (
      <MultiplayerResult
        match={currentMatch}
        onPlayAgain={() => {
          setMultiplayerState(null);
          setCurrentMatch(null);
          setMode(null);
          if (navigate) navigate('/');
        }}
        onNewMatch={() => {
          setMultiplayerState('create');
          setCurrentMatch(null);
          if (navigate) navigate('/multiplayer/create');
        }}
      />
    );
  }

  // Kein Modus gesetzt: zur Startseite
  if (mode === null) {
    if (navigate) {
      navigate('/');
      return null;
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider mb-2">
          WER IST DER SPIELER?
        </h1>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-12 bg-white/30"></div>
          <div className="h-px w-24 bg-white/50"></div>
          <div className="h-px w-12 bg-white/30"></div>
        </div>
        <div className="mt-4">
          <span className="text-xs uppercase tracking-widest text-slate-400">
            {mode === 'training' ? 'Training' : mode === 'multiplayer' ? 'Multiplayer' : 'Wettkampf'}
          </span>
        </div>
      </div>

      {gameState === 'playing' ? (
        <div className="w-full max-w-md">
          {/* Punkteanzeige */}
          {(mode === 'competition' || mode === 'multiplayer') && (() => {
            const maxPossiblePoints = 500 - (currentLevel * 100);
            const pointsThisRound = Math.max(0, 100 - tipsCostThisRound);
            return (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-xl mb-6 border border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs uppercase tracking-widest mb-1">Punkte</p>
                    <p className="text-3xl font-bold text-white">{points}</p>
                    <p className="text-purple-200 text-xs mt-1">Durchgang {currentLevel + 1} von 5</p>
                    {tipsCostThisRound > 0 && (
                      <p className="text-yellow-300 text-xs mt-1">Diese Runde: {pointsThisRound} Punkte möglich</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-xs uppercase tracking-widest mb-1">Noch möglich</p>
                    <p className="text-2xl font-bold text-white">{maxPossiblePoints}</p>
                    <p className="text-purple-200 text-xs mt-1">von 500 max</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Club-Liste */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl mb-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest">
              {showAllStations ? 'Alle Stationen' : '4 ausgewählte Stationen'}
            </p>
            <div className="flex flex-wrap gap-2">
              {stationsToShow.map((club, index) => (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={`${currentPlayer.id}-${index}-${club}`}
                  className="bg-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-600"
                >
                  {club}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Tipps-Button */}
          {(mode === 'competition' || mode === 'multiplayer') && (
            <div className="mb-4">
              <button
                onClick={() => setShowTipsModal(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                Tipps
              </button>
            </div>
          )}

          {/* Training: Multiple Choice */}
          {mode === 'training' && (
            <div className="grid grid-cols-1 gap-3">
              {shuffledOptions.map((option) => {
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
          )}

          {/* Wettkampf/Multiplayer: Text-Input */}
          {(mode === 'competition' || mode === 'multiplayer') && (
            <form onSubmit={handleCompetitionSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!!selectedAnswer}
                  placeholder="Spielername eingeben..."
                  className={`w-full p-4 rounded-xl border-2 text-lg font-semibold bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
                    selectedAnswer
                      ? fuzzyMatch(selectedAnswer, currentPlayer.name)
                        ? 'bg-green-500 border-green-400'
                        : 'bg-red-500 border-red-400'
                      : ''
                  }`}
                  autoFocus
                />
                {selectedAnswer && (
                  <div className="mt-2 text-center">
                    {fuzzyMatch(selectedAnswer, currentPlayer.name) ? (
                      <p className="text-green-400 font-semibold">✓ Richtig! Es ist {currentPlayer.name}</p>
                    ) : (
                      <p className="text-red-400 font-semibold">✗ Falsch! Es ist {currentPlayer.name}</p>
                    )}
                  </div>
                )}
              </div>
              {!selectedAnswer && (
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bestätigen
                </button>
              )}
            </form>
          )}

          {/* Streak-Anzeige (Training) */}
          {mode === 'training' && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">5 in Folge zum Sieg!</p>
              <div className="flex gap-3 items-center relative">
                {[1, 2, 3, 4, 5].map((ballNumber) => (
                  <div key={ballNumber} className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute w-8 h-8 rounded-full border-2 border-slate-500 border-dashed"></div>
                    {streak >= ballNumber && !showStreakReset ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl relative z-10"
                      >
                        ⚽
                      </motion.span>
                    ) : showStreakReset && streak >= ballNumber ? (
                      <motion.span
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 200, opacity: 0 }}
                        transition={{ duration: 1.2, delay: (ballNumber - 1) * 0.15, ease: "easeIn" }}
                        className="text-4xl relative z-10"
                      >
                        ⚽
                      </motion.span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Spiel beendet */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700"
        >
          {mode === 'training' ? (
            streak >= 5 ? (
              <>
                <h2 className="text-4xl font-bold mb-4">Gewonnen!</h2>
                <p className="text-xl mb-6 text-slate-300 text-balance">
                  Du hast 5 richtige Antworten in Folge geschafft!
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-4xl"
                    >
                      ⚽
                    </motion.span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">Spiel beendet! ⚽️</h2>
                <p className="text-xl mb-6 text-slate-300 text-balance">
                  Du hattest einen Streak von {streak} richtigen Antworten.
                </p>
              </>
            )
          ) : mode === 'multiplayer' && gameState === 'finished' && isCreator && currentMatch ? (
            <>
              <h2 className="text-4xl font-bold mb-4">Spiel beendet!</h2>
              <p className="text-xl mb-6 text-slate-300 text-balance">
                Du hast {points} Punkte erreicht!
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-6">
                <p className="text-3xl font-bold text-white text-center">{points} Punkte</p>
              </div>

              <div className="bg-slate-700 rounded-xl p-6 mb-6">
                <p className="text-slate-300 text-sm mb-3 text-center">Teile diesen Link mit deinem Freund:</p>
                <div className="bg-slate-900 rounded-lg p-3 mb-3 border border-slate-600">
                  <p className="text-white font-mono text-sm break-all">
                    {window.location.origin}/match/{currentMatch.id}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
                >
                  {copyFeedback ? '✓ Link kopiert!' : 'Link kopieren'}
                </button>
              </div>

              {saveFeedback && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-4 text-red-300 text-sm">
                  {saveFeedback}
                </div>
              )}

              <button
                onClick={checkResult}
                className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
              >
                Ergebnis prüfen
              </button>
            </>
          ) : mode === 'multiplayer' && gameState === 'waiting' ? (
            <>
              <h2 className="text-4xl font-bold mb-4">Warte auf Gegner</h2>
              <p className="text-xl mb-6 text-slate-300 text-balance">
                Du hast {points} Punkte erreicht!
              </p>
              <p className="text-lg mb-4 text-slate-400">
                Warte darauf, dass dein Gegner fertig spielt...
              </p>
              <button
                onClick={checkResult}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
              >
                Ergebnis prüfen
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">Wettkampf beendet! ⚽️</h2>
              <p className="text-xl mb-6 text-slate-300 text-balance">
                Du hast {points} von 500 möglichen Punkten erreicht!
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-6">
                <p className="text-3xl font-bold text-white text-center">{points} Punkte</p>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (navigate) {
                  navigate('/');
                } else {
                  setMode(null);
                  resetGameState();
                }
              }}
              className="bg-slate-700 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
            >
              Modus wählen
            </button>
            <button
              onClick={resetGameState}
              className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
            >
              Nochmal spielen
            </button>
          </div>
        </motion.div>
      )}

      {/* Tipps-Modal */}
      {showTipsModal && (
        <TipsModal
          currentPlayer={currentPlayer}
          revealedTips={revealedTips}
          tipsCostThisRound={tipsCostThisRound}
          points={points}
          onBuyTip={buyTip}
          onClose={() => setShowTipsModal(false)}
        />
      )}
    </div>
  );
}
