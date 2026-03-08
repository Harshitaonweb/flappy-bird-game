import { useEffect, useRef } from 'react';
import birdImage from '../assets/blueBird.webp';
import gameOverSound from '../assets/game over sound.wav';
import bgMusic from '../assets/bgmusic.mp3';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const FLAP_STRENGTH = 8;
const PIPE_SPEED = 2;
const PIPE_GAP = 150;
const PIPE_WIDTH = 60;
const BIRD_SIZE = 30;

function GameCanvas({ onGameOver }) {
  const canvasRef = useRef(null);
  const birdImgRef = useRef(null);
  const audioRef = useRef(null);
  const bgMusicRef = useRef(null);
  const scoreRef = useRef(0);
  const gameRef = useRef({
    birdY: CANVAS_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [],
    lastPipeTime: 0,
    animationId: null,
    clouds: []
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    // Load bird image
    const img = new Image();
    img.src = birdImage;
    birdImgRef.current = img;

    // Load game over sound
    const audio = new Audio(gameOverSound);
    audioRef.current = audio;

    // Load and play background music
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgMusicRef.current = bgAudio;
    
    // Start background music
    bgAudio.play().catch(err => console.log('Background music play failed:', err));

    // Reset game state
    game.birdY = CANVAS_HEIGHT / 2;
    game.birdVelocity = 0;
    game.pipes = [];
    game.lastPipeTime = Date.now();
    scoreRef.current = 0;
    
    // Game over sound function
    const playGameOverSound = () => {
      // Stop background music
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
      // Play game over sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
    };
    
    // Initialize clouds
    game.clouds = [];
    for (let i = 0; i < 5; i++) {
      game.clouds.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT / 2),
        width: 60 + Math.random() * 40,
        height: 30 + Math.random() * 20,
        speed: 0.3 + Math.random() * 0.3
      });
    }

    const flap = () => {
      game.birdVelocity = -FLAP_STRENGTH;
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = () => flap();
    const handleTouch = (e) => {
      e.preventDefault();
      flap();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);

    const checkCollision = (birdX, birdY, pipe) => {
      // Add small margin to make collision more forgiving
      const margin = 5;
      const birdLeft = birdX + margin;
      const birdRight = birdX + BIRD_SIZE - margin;
      const birdTop = birdY + margin;
      const birdBottom = birdY + BIRD_SIZE - margin;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      // Check if bird is in pipe's horizontal range
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top pipe or bottom pipe
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
          return true;
        }
      }
      return false;
    };

    const gameLoop = () => {
      // Update bird physics
      game.birdVelocity += GRAVITY;
      game.birdY += game.birdVelocity;

      // Check ground/ceiling collision
      if (game.birdY <= 0 || game.birdY + BIRD_SIZE >= CANVAS_HEIGHT) {
        playGameOverSound();
        onGameOver(scoreRef.current);
        return;
      }

      // Generate pipes
      const now = Date.now();
      if (now - game.lastPipeTime > 1500) {
        const minHeight = 50;
        const maxHeight = CANVAS_HEIGHT - PIPE_GAP - 50;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        game.pipes.push({
          x: CANVAS_WIDTH,
          topHeight,
          scored: false
        });
        game.lastPipeTime = now;
      }

      // Update pipes
      const birdX = 50;
      for (let i = game.pipes.length - 1; i >= 0; i--) {
        const pipe = game.pipes[i];
        pipe.x -= PIPE_SPEED;

        // Check collision
        if (checkCollision(birdX, game.birdY, pipe)) {
          playGameOverSound();
          onGameOver(scoreRef.current);
          return;
        }

        // Update score
        if (!pipe.scored && birdX > pipe.x + PIPE_WIDTH) {
          pipe.scored = true;
          scoreRef.current += 1;
        }

        // Remove off-screen pipes
        if (pipe.x + PIPE_WIDTH < 0) {
          game.pipes.splice(i, 1);
        }
      }

      // Update clouds
      game.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
          cloud.x = CANVAS_WIDTH;
          cloud.y = Math.random() * (CANVAS_HEIGHT / 2);
        }
      });

      // Render - Sky gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      game.clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.width * 0.3, cloud.y - cloud.height * 0.3, cloud.width / 3, cloud.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x - cloud.width * 0.3, cloud.y - cloud.height * 0.2, cloud.width / 3, cloud.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw pipes with darker green
      ctx.fillStyle = '#2D5016';
      game.pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Pipe cap
        ctx.fillStyle = '#3A6B1F';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
        
        // Bottom pipe
        ctx.fillStyle = '#2D5016';
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT);
        // Pipe cap
        ctx.fillStyle = '#3A6B1F';
        ctx.fillRect(pipe.x - 5, pipe.topHeight + PIPE_GAP, PIPE_WIDTH + 10, 30);
      });

      // Draw bird
      if (birdImgRef.current && birdImgRef.current.complete) {
        ctx.drawImage(birdImgRef.current, birdX, game.birdY, BIRD_SIZE, BIRD_SIZE);
      } else {
        // Fallback to square if image not loaded
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(birdX, game.birdY, BIRD_SIZE, BIRD_SIZE);
      }

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = '32px Arial';
      ctx.fillText(scoreRef.current, 20, 50);

      game.animationId = requestAnimationFrame(gameLoop);
    };

    game.animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
      if (game.animationId) {
        cancelAnimationFrame(game.animationId);
      }
      // Stop background music when component unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, [onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="game-canvas"
    />
  );
}

export default GameCanvas;
