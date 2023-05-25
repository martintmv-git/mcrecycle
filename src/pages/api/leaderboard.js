import { fetchUserId, fetchUserBalance } from "../../lib/databaseHelper";

const leaderboard = [
    { id: 1, name: 'Alice', points: 100 },
    { id: 2, name: 'Bob', points: 80 },
    { id: 3, name: 'Charlie', points: 60 },
    { id: 4, name: 'Dave', points: 40 },
    { id: 5, name: 'Eve', points: 20 },
  ];
  
  export default function handler(req, res) {
    res.status(200).json(leaderboard);
  }