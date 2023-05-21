// Leaderboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Image from "next/image";
import GameInfo from "../components/GameInfo";
import { FaQuestion, FaTimes } from "react-icons/fa";

const Leaderboard = () => {
  const { user } = useUser();
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await axios.get("/api/players");
    const sortedPlayers = response.data.sort((a, b) => b.points - a.points);
    setPlayers(sortedPlayers);
    setIsLoading(false);
  };

  const handleLeftButtonClick = () => {
    router.push("/");
  };

  const handleOverlayToggle = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        <div className="navbar">
          <button className="left-button" onClick={handleLeftButtonClick}>
            Back
          </button>
          <button className="right-button" onClick={handleOverlayToggle}>
            {isOverlayOpen ? <FaTimes /> : <FaQuestion />}
          </button>
          <div className="logo">
            <Image src="/leaderboard.png" alt="Leaderboard logo" width={152} height={129} />
          </div>
        </div>
        {isOverlayOpen && (
          <div className="overlay" onClick={handleOverlayToggle}>
      <GameInfo />
          </div>
        )}
        {user && (
          <div className="welcome-wrapper">
            <h2 className="leaderboard-welcome">👋 Welcome, {user.fullName}!</h2>
            <h3 className="rank-message">Your current rank is {1}</h3>
          </div>
        )}
        <div className="table">
          <div className="header-row">
            <div>RANK</div>
            <div>NAME</div>
            <div>POINTS</div>
          </div>
          <hr></hr>
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            players.map((player, index) => {
              let rowClass = "player-row";
              if (index === 0) rowClass += " gold";
              else if (index === 1) rowClass += " silver";
              else if (index === 2) rowClass += " bronze";
              return (
                <div key={index} className={rowClass}>
                  <div>{index + 1}</div>
                  <div>{player.name}</div>
                  <div>{player.points}</div>
                </div>
              );
            })
          )}
          <hr></hr>
          <button className="view-button">View All</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
