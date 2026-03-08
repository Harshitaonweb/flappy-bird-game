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
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
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
      bgAudio.play()
        .then(() => {
          musicStartedRef.current = true;
          setShowPlayPrompt(false);
        })
        .catch(err => {
          console.log('Autoplay blocked, waiting for user interaction:', err);
          setShowPlayPrompt(true);
        });
    }

    // Try to play on any user interaction
    const handleInteraction = () => {
      if (bgMusicRef.current && isMusicOn && !musicStartedRef.current) {
        bgMusicRef.current.play()
          .then(() => {
            musicStartedRef.current = true;
            setShowPlayPrompt(false);
          })
          .catch(err => console.log('Play failed:', err));
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      // Stop background music when app unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume;
    }
  }, [volume]);

  // Handle music on/off
  useEffect(() => {
    if (bgMusicRef.current) {
      if (isMusicOn && musicStartedRef.current) {
        bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
      } else if (!isMusicOn) {
        bgMusicRef.current.pause();
      }
    }
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
      {showPlayPrompt && (
        <div className="play-prompt">
          Click anywhere to enable music
        </div>
      )}
      
      {gameState === 'PLAYING' && (
        <div className="floating-volume-control">
          <button className="volume-toggle floating" onClick={toggleMusic} title={isMusicOn ? 'Mute Music' : 'Unmute Music'}>
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
          <div className="volume-slider-container floating">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      )}
      
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
          isMusicOn={isMusicOn}
          toggleMusic={toggleMusic}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
}

export default App;
