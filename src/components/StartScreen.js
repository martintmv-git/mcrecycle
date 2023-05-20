import React from "react";

const StartScreen = ({ onStartGame, onLeaderboards, onShop }) => {
  return (
    <div className="startscreen-wrapper">
      <div className="startscreen-container">
        <button className="startscreen-button startgame-button" onClick={onStartGame}>
          Start Game
        </button>
        <div className="buttons-row">
          <button className="startscreen-button leaderboard-button" onClick={onLeaderboards}>
            Leaderboard
          </button>
          <button className="startscreen-button shop-button" onClick={onShop}>
            Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
