import backgroundImage from '../assets/bg.webp';

function StartScreen({ onStart }) {
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
      </div>
    </div>
  );
}

export default StartScreen;
