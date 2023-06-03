import React, { useState } from "react";
import RecyclingGame from "../components/RecyclingGame";
import StartScreen from "../components/StartScreen";
import { useRouter } from "next/router";
import Head from "next/head";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const router = useRouter();

  const handleLeaderboards = () => {
    router.push("/leaderboard");
  };

  const handleShop = () => {
    router.push("/shop");
  };

  return (
    <div>
      <Head>
        <title>McRecycle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {gameStarted ? (
        <RecyclingGame />
      ) : (
        <StartScreen
          onStartGame={handleStartGame}
          onLeaderboards={handleLeaderboards}
          onShop={handleShop}
        />
      )}
    </div>
  );
};

export default Home;
