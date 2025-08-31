'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Clock, Star } from 'lucide-react';
import SnakeGame from './SnakeGame';
import MemoryGame from './MemoryGame';

interface GameCenterProps {
  projectId: string;
  generationProgress: number;
  currentStep: string;
}

type GameType = 'snake' | 'memory' | null;

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  timeSpent: number;
  highScore: number;
}

export default function GameCenter({ projectId, generationProgress, currentStep }: GameCenterProps) {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalScore: 0,
    timeSpent: 0,
    highScore: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  const games = [
    {
      id: 'snake' as GameType,
      name: 'Snake',
      description: 'Classic snake game - eat food and grow!',
      icon: '🐍',
      color: 'from-green-400 to-green-600',
      difficulty: 'Medium'
    },
    {
      id: 'memory' as GameType,
      name: 'Memory Match',
      description: 'Match pairs of cards to test your memory',
      icon: '🧠',
      color: 'from-blue-400 to-blue-600',
      difficulty: 'Easy'
    }
  ];

  const handleScoreUpdate = (score: number) => {
    setGameStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      highScore: Math.max(prev.highScore, score)
    }));
  };

  const handleGameEnd = (finalScore: number) => {
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + finalScore,
      highScore: Math.max(prev.highScore, finalScore),
      timeSpent: prev.timeSpent + Math.floor((Date.now() - sessionStartTime) / 1000)
    }));
    setSessionStartTime(Date.now());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getProgressMessage = (progress: number) => {
    if (progress < 20) return "🚀 Initializing your website...";
    if (progress < 40) return "🎨 Designing the layout...";
    if (progress < 60) return "✨ Generating content...";
    if (progress < 80) return "📱 Making it mobile-friendly...";
    if (progress < 100) return "🔍 Optimizing for search engines...";
    return "✅ Your website is ready!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Game Center</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Play some games while we build your amazing website!
          </p>
          
          {/* Progress Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Website Generation</h3>
                <p className="text-sm text-gray-600">{currentStep}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{generationProgress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="text-center text-lg">
              {getProgressMessage(generationProgress)}
            </div>
          </div>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{gameStats.highScore}</div>
            <div className="text-sm text-gray-600">High Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{gameStats.gamesPlayed}</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{formatTime(gameStats.timeSpent)}</div>
            <div className="text-sm text-gray-600">Time Played</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900">{gameStats.totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedGame ? (
            /* Game Selection */
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGame(game.id)}
                  className="bg-white rounded-2xl p-8 shadow-lg cursor-pointer overflow-hidden relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10`} />
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 text-center">{game.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {game.name}
                    </h3>
                    <p className="text-gray-600 text-center mb-4">
                      {game.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.difficulty}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium"
                      >
                        Play Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Game Play Area */
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {games.find(g => g.id === selectedGame)?.name}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGame(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Back to Games
                </motion.button>
              </div>

              <div className="flex justify-center">
                {selectedGame === 'snake' && (
                  <SnakeGame 
                    onScoreUpdate={handleScoreUpdate}
                    onGameEnd={handleGameEnd}
                  />
                )}
                {selectedGame === 'memory' && (
                  <MemoryGame 
                    onScoreUpdate={handleScoreUpdate}
                    onGameEnd={handleGameEnd}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 space-y-4"
        >
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-gray-600 italic">
              "Great things take time. Your website is going to be amazing! 🌟"
            </p>
          </div>
          
          {generationProgress >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 rounded-xl p-6 border-2 border-green-200"
            >
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Your Website is Ready!
              </h3>
              <p className="text-green-700">
                Time to check out your new website and make any adjustments you'd like.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-medium"
                onClick={() => window.location.href = `/preview/${projectId}`}
              >
                View My Website
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
