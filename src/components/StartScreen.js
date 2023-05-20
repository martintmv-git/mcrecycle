import React from "react";

const StartScreen = ({ onStartGame, onLeaderboards, onShop }) => {
  return (
    <div className="startscreen-wrapper">
      <div className="startscreen-container">
        <button className="startscreen-button" onClick={onStartGame}>
          Start Game
        </button>
        <button className="startscreen-button" onClick={onLeaderboards}>
          Leaderboard
        </button>
        <button className="startscreen-button" onClick={onShop}>
          Shop
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
