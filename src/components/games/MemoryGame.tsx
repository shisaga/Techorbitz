'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onScoreUpdate: (score: number) => void;
  onGameEnd: (finalScore: number) => void;
}

export default function MemoryGame({ onScoreUpdate, onGameEnd }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const cardValues = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎵', '🎲'];
  const totalPairs = cardValues.length;

  const initializeGame = useCallback(() => {
    const gameCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setIsPlaying(true);
    setGameComplete(false);
    setTimeElapsed(0);
  }, []);

  const flipCard = (cardId: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId)) return;
    if (cards[cardId]?.isMatched) return;

    setFlippedCards(prev => [...prev, cardId]);
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
  };

  const calculateScore = (movesCount: number, timeInSeconds: number) => {
    const baseScore = 1000;
    const movesPenalty = movesCount * 10;
    const timePenalty = timeInSeconds * 2;
    return Math.max(0, baseScore - movesPenalty - timePenalty);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards[firstCardId];
      const secondCard = cards[secondCardId];

      setMoves(prev => prev + 1);

      setTimeout(() => {
        if (firstCard.value === secondCard.value) {
          // Match found
          setCards(prev => prev.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          
          const newScore = calculateScore(moves + 1, timeElapsed);
          setScore(newScore);
          onScoreUpdate(newScore);
        } else {
          // No match - flip cards back
          setCards(prev => prev.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, cards, moves, timeElapsed, onScoreUpdate]);

  useEffect(() => {
    if (matchedPairs === totalPairs && isPlaying) {
      setGameComplete(true);
      setIsPlaying(false);
      const finalScore = calculateScore(moves, timeElapsed);
      onGameEnd(finalScore);
    }
  }, [matchedPairs, totalPairs, isPlaying, moves, timeElapsed, onGameEnd]);

  useEffect(() => {
    if (!isPlaying || gameComplete) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-lg">
        <div className="text-sm space-y-1">
          <div>Moves: {moves}</div>
          <div>Time: {formatTime(timeElapsed)}</div>
        </div>
        <div className="text-lg font-semibold">Score: {score}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initializeGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
        >
          {isPlaying ? 'Restart' : 'Start Game'}
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-3 p-4 bg-gray-100 rounded-xl">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative w-16 h-16 cursor-pointer"
            onClick={() => flipCard(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-full h-full absolute backface-hidden"
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Back */}
              <div 
                className="w-full h-full absolute backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-white text-xl">?</div>
              </div>
              
              {/* Card Front */}
              <div 
                className="w-full h-full absolute backface-hidden bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center text-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {card.value}
              </div>
            </motion.div>
            
            {card.isMatched && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-green-200/80 rounded-lg flex items-center justify-center"
              >
                <div className="text-green-600 text-xl">✓</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>Match all pairs to complete the game!</p>
        <p>Fewer moves and less time = higher score</p>
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-2xl text-center max-w-sm mx-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <div className="space-y-2 mb-6 text-gray-600">
                <p>Final Score: <span className="font-semibold">{score}</span></p>
                <p>Moves: {moves}</p>
                <p>Time: {formatTime(timeElapsed)}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
