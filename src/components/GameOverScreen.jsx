import backgroundImage from '../assets/bg.webp';

function GameOverScreen({ score, highScore, onRestart, isMusicOn, toggleMusic, volume, onVolumeChange, difficulty, setDifficulty }) {
  return (
    <div 
      className="screen game-over-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="game-over-content">
        <h1>Game Over</h1>
        <div className="scores">
          <p className="score">Score: {score}</p>
          <p className="high-score">High Score: {highScore}</p>
        </div>
        
        <div className="difficulty-selector">
          <div className="difficulty-label">Difficulty: {difficulty === 'easy' ? 'Easy' : 'Hard'}</div>
          <div className="difficulty-options">
            <button 
              className={`difficulty-option ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`difficulty-option ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>
        
        <button onClick={onRestart} className="btn">
          Restart
        </button>
        
        <div className="volume-control">
          <button className="volume-toggle" onClick={toggleMusic} title={isMusicOn ? 'Mute Music' : 'Unmute Music'}>
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
          <div className="volume-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={onVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreen;
