import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const Leaderboard = () => {
  const { user } = useUser();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("/api/players");
      const sortedPlayers = response.data.sort((a, b) => b.points - a.points);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error("Error fetching players:", error);
    }  
};

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Leaderboard</h1>
      <h2>Welcome, {user.fullName}! your rank is {}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

