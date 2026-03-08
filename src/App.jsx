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
  const musicStartedRef = useRef(false);

  useEffect(() => {
    // Load background music
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgMusicRef.current = bgAudio;

    return () => {
      // Stop background music when app unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  const startBackgroundMusic = () => {
    if (bgMusicRef.current && !musicStartedRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
      musicStartedRef.current = true;
    }
  };

  const handleStart = () => {
    startBackgroundMusic();
    setGameState('PLAYING');
  };

  const handleStartScreenClick = () => {
    // Start music on any interaction with start screen
    startBackgroundMusic();
  };

  const handleGameOver = useCallback((score, gameOverAudio) => {
    // Stop background music when game is over
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    
    // When game over sound finishes, restart background music
    if (gameOverAudio) {
      gameOverAudio.onended = () => {
        if (bgMusicRef.current) {
          bgMusicRef.current.currentTime = 0;
          bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
        }
      };
    }
    
    setFinalScore(score);
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [highScore]);

  const handleRestart = () => {
    // Make sure background music is playing when restarting
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
    }
    setGameState('PLAYING');
  };

  return (
    <div className="app">
      {gameState === 'START' && <StartScreen onStart={handleStart} onInteraction={handleStartScreenClick} />}
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
