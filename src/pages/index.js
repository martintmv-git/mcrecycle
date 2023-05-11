import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Game</h1>
      <Link href="/leaderboard">
        <span>View Leaderboard</span>
      </Link>

      <style jsx>{`
        span {
          cursor: pointer;
          text-decoration: underline;
          color: blue;
        }
      `}</style>
    </div>
  );
}
