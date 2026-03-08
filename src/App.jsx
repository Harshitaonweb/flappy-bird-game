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
  const [volume, setVolume] = useState(0.5);
  const bgMusicRef = useRef(null);
  const musicStartedRef = useRef(false);

  useEffect(() => {
    // Load background music
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;
    bgAudio.volume = volume;
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
  }, [isMusicOn, volume]);

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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = newVolume;
    }
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
      {gameState === 'START' && (
        <StartScreen 
          onStart={handleStart} 
          isMusicOn={isMusicOn}
          toggleMusic={toggleMusic}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
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
