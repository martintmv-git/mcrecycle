// GameInfo.js
import React from 'react';

const GameInfo = () => {
  const gameInfoItems = [
    {
      title: "How do points work?",
      image: "/point.png",
      description: "When playing McRecycle you get 25 points per drop. After playing a while you’ll stack enough points to convert them into food coupons!",
    },
    {
      title: "How do coupons work?",
      image: "/qricon.png",
      description: "When you convert your points, you will receive a QR code that you can use at any McDonalds store you like!",
    },
    {
      title: "How does the leaderboard work?",
      image: "/leaderboardicon.png",
      description: "The TOP 3 players in the game will win special prices. They will have the option to choose between a game console or a full month of free McDonalds meals!",
    },
  ];

  return (
    <div className="game-info-container">
      {gameInfoItems.map((item, index) => (
        <div key={index} className="game-info-item">
          <div className="game-info-title-box">
            <img src={item.image} alt={item.title} className="game-info-image" />
            <h2 className="game-info-title">{item.title}</h2>
          </div>
          <div className="game-info-description-box">
            <p className="game-info-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameInfo;
