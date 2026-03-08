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
  const [isMusicOn, setIsMusicOn] = useState(true);
  const bgMusicRef = useRef(null);
  const musicStartedRef = useRef(false);

  useEffect(() => {
    // Load background music
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgMusicRef.current = bgAudio;

    // Auto-play music when app loads
    if (isMusicOn) {
      bgAudio.play().catch(err => console.log('Background music play failed:', err));
      musicStartedRef.current = true;
    }

    return () => {
      // Stop background music when app unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, [isMusicOn]);

  const startBackgroundMusic = () => {
    if (bgMusicRef.current && !musicStartedRef.current && isMusicOn) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
      musicStartedRef.current = true;
    }
  };

  const toggleMusic = () => {
    setIsMusicOn(prev => {
      const newState = !prev;
      if (bgMusicRef.current) {
        if (newState) {
          bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
          musicStartedRef.current = true;
        } else {
          bgMusicRef.current.pause();
        }
      }
      return newState;
    });
  };

  const handleStart = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = useCallback((score, gameOverAudio) => {
    // Stop background music when game is over
    if (bgMusicRef.current && isMusicOn) {
      bgMusicRef.current.pause();
    }
    
    // When game over sound finishes, restart background music
    if (gameOverAudio && isMusicOn) {
      gameOverAudio.onended = () => {
        if (bgMusicRef.current && isMusicOn) {
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
  }, [highScore, isMusicOn]);

  const handleRestart = () => {
    // Make sure background music is playing when restarting
    if (bgMusicRef.current && isMusicOn) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
    }
    setGameState('PLAYING');
  };

  return (
    <div className="app">
      <button className="music-toggle" onClick={toggleMusic} title={isMusicOn ? 'Mute Music' : 'Unmute Music'}>
        {isMusicOn ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>
      
      {gameState === 'START' && <StartScreen onStart={handleStart} />}
      {gameState === 'PLAYING' && (
        <GameCanvas 
          onGameOver={handleGameOver}
          isMusicOn={isMusicOn}
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
