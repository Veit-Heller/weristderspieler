import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MatchProvider } from './contexts/MatchContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MatchProvider>
      <App />
    </MatchProvider>
  </StrictMode>,
)
