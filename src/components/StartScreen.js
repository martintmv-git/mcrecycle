import React, { useEffect } from "react";

const StartScreen = ({ onStartGame, onLeaderboards, onShop, currentBackground }) => {
  const handleResize = () => {
    if (window.innerWidth >= 450) {
      document.body.style.backgroundImage = "url('/mcd_pattern.png')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundColor = [currentBackground];
    }
  };

  // Run once the component has been mounted
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Remove the listener
    return () => window.removeEventListener("resize", handleResize);
  }, [currentBackground]);

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