'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  onGameEnd: (finalScore: number) => void;
}

export default function SnakeGame({ onScoreUpdate, onGameEnd }: SnakeGameProps) {
  const GRID_SIZE = 20;
  const CANVAS_SIZE = 400;
  
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || 
          head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        onGameEnd(score);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        onGameEnd(score);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, isPlaying, score, onScoreUpdate, onGameEnd, generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        e.preventDefault();
        setIsPaused(prev => !prev);
        break;
    }
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;
    
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake, isPlaying, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-lg font-semibold">Score: {score}</div>
        <div className="flex gap-2">
          {!isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
            >
              Start Game
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(prev => !prev)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </motion.button>
          )}
        </div>
      </div>

      <div 
        className="relative border-2 border-gray-300 bg-gray-100"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-600' : 'bg-green-400'} rounded-sm`}
            style={{
              left: segment.x * GRID_SIZE,
              top: segment.y * GRID_SIZE,
              width: GRID_SIZE - 1,
              height: GRID_SIZE - 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food.x * GRID_SIZE + 2,
            top: food.y * GRID_SIZE + 2,
            width: GRID_SIZE - 4,
            height: GRID_SIZE - 4,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Game Over!</h3>
              <p className="text-gray-600 mb-4">Final Score: {score}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Paused Overlay */}
        {isPaused && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
          >
            <div className="bg-white p-4 rounded-lg">
              <p className="font-semibold">Game Paused</p>
              <p className="text-sm text-gray-600">Press Space to continue</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>Use arrow keys to control the snake</p>
        <p>Press Space to pause/resume</p>
        <p>Eat the red food to grow and score points!</p>
      </div>
    </div>
  );
}
