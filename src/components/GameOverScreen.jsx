import backgroundImage from '../assets/bg.webp';

function GameOverScreen({ score, highScore, onRestart }) {
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
        <button onClick={onRestart} className="btn">
          Restart
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
