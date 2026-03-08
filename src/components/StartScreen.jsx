import backgroundImage from '../assets/bg.webp';

function StartScreen({ onStart, isMusicOn, toggleMusic, volume, onVolumeChange }) {
  return (
    <div 
      className="screen start-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="start-content">
        <h1>Flappy Bird</h1>
        <div className="instructions">
          <p>Press SPACE, CLICK, or TAP to flap</p>
        </div>
        <button onClick={onStart} className="btn">
          Start Game
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

export default StartScreen;
