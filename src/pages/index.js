import React, { useState } from 'react';
import RecyclingGame from '../components/RecyclingGame';
import StartScreen from '../components/StartScreen';

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleLeaderboards = () => {
    console.log('Leaderboards button clicked');
  };

  const handleShop = () => {
    console.log('Shop button clicked');
  };

  return (
    <div>
      {gameStarted ? (
        <RecyclingGame />
      ) : (
        <StartScreen onStartGame={handleStartGame} onLeaderboards={handleLeaderboards} onShop={handleShop} />
      )}
    </div>
  );
}

export default Home;