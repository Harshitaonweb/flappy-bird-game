import { useState, useCallback, useEffect, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import bgMusic from './assets/bgmusic.mp3';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('START');
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore') || '0');
  });
  const bgMusicRef = useRef(null);

  useEffect(() => {
    // Load and play background music
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgMusicRef.current = bgAudio;
    
    // Start background music
    bgAudio.play().catch(err => console.log('Background music play failed:', err));

    return () => {
      // Stop background music when app unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleStart = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = useCallback((score) => {
    // Stop background music when game is over
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
    
    setFinalScore(score);
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [highScore]);

  const handleRestart = () => {
    // Restart background music when restarting
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
    }
    setGameState('PLAYING');
  };

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
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
