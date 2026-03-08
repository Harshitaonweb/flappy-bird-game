import backgroundImage from '../assets/bg.webp';

function StartScreen({ onStart, onInteraction }) {
  const handleClick = () => {
    if (onInteraction) {
      onInteraction();
    }
  };

  return (
    <div 
      className="screen start-screen"
      onClick={handleClick}
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
          <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>Click anywhere to enable sound</p>
        </div>
        <button onClick={onStart} className="btn">
          Start Game
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
