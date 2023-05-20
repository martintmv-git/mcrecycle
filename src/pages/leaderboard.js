import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Image from "next/image";

const Leaderboard = () => {
  const { user } = useUser();
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("/api/players");
      const sortedPlayers = response.data.sort(
        (a, b) => b.points - a.points
      );
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleLeftButtonClick = () => {
    router.push("/");
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        <div className="navbar">
          <button className="left-button" onClick={handleLeftButtonClick}>
            Back
          </button>
          <div className="logo">
            <Image
              src="/leaderboard.png"
              alt="Leaderboard logo"
              width={150}
              height={120}
            />
          </div>
        </div>
        <br></br>
        {user && (
  <div className="welcome-wrapper">
    <h2 className="leaderboard-welcome">
      👋 Welcome, {user.fullName}!
    </h2>
    <p className="rank-message">
      Your current rank is {1}
    </p>
  </div>
)}

<div className="table">
  <div className="header-row">
    <div>Rank</div>
    <div>Name</div>
    <div>Points</div>
  </div>
  {players.map((player, index) => {
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
  })}
  <button className="left-button">
    View All
  </button>
</div>

      </div>
    </div>
  );
};

export default Leaderboard;