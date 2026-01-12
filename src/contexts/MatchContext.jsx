import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext(null);

export function MatchProvider({ children }) {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [matchState, setMatchState] = useState(null); // 'creating', 'joining', 'playing', 'finished'

  const value = {
    currentMatch,
    setCurrentMatch,
    isCreator,
    setIsCreator,
    matchState,
    setMatchState,
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within MatchProvider');
  }
  return context;
}
