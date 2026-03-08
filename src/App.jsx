import { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('START');
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore') || '0');
  });

  const handleStart = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = useCallback((score) => {
    setFinalScore(score);
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [highScore]);

  return (
    <div className="app">
      {gameState === 'START' && <StartScreen onStart={handleStart} />}
      {gameState === 'PLAYING' && (
        <GameCanvas 
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'GAME_OVER' && (
        <GameOverScreen 
          score={finalScore}
          highScore={highScore}
          onRestart={handleStart}
        />
      )}
    </div>
  );
}

export default App;
