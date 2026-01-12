import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import MultiplayerCreate from './components/MultiplayerCreate';
import MultiplayerJoin from './components/MultiplayerJoin';
import FootballQuiz from './components/FootballQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Startseite */}
        <Route path="/" element={<StartPage />} />
        <Route path="/start" element={<StartPage />} />
        
        {/* Solo-Modi */}
        <Route path="/training" element={<GamePage mode="training" />} />
        <Route path="/competition" element={<GamePage mode="competition" />} />
        
        {/* Multiplayer */}
        <Route path="/multiplayer/create" element={<MultiplayerCreatePage />} />
        <Route path="/multiplayer/join" element={<MultiplayerJoinPage />} />
        <Route path="/match/:matchId" element={<MatchPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Multiplayer Create Page
function MultiplayerCreatePage() {
  const navigate = useNavigate();
  return (
    <FootballQuiz 
      mode={null} 
      navigate={navigate} 
      multiplayerState="create"
    />
  );
}

// Multiplayer Join Page
function MultiplayerJoinPage() {
  const navigate = useNavigate();
  return (
    <MultiplayerJoin
      onMatchJoined={(match) => {
        navigate(`/match/${match.id}`);
      }}
      onCancel={() => navigate('/')}
    />
  );
}

// Match Page (für /match/:matchId)
function MatchPage() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  return <FootballQuiz mode={null} navigate={navigate} urlMatchId={matchId} />;
}

export default App;
