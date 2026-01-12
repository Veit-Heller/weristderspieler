import React from 'react';
import { useNavigate } from 'react-router-dom';
import FootballQuiz from '../components/FootballQuiz';

export default function GamePage({ mode }) {
  const navigate = useNavigate();

  return <FootballQuiz mode={mode} navigate={navigate} />;
}
