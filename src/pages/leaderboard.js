import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/router';

const Leaderboard = () => {
  const canvasRef = useRef(null);
  const { user } = useUser();
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  // Add your logo image source here
  const logoSrc = './leaderboard.png';
  const logoImage = new Image();
  logoImage.src = logoSrc;

  useEffect(() => {
    fetchPlayers();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      resizeCanvas();
      drawLeaderboard();

      window.addEventListener('resize', () => {
        resizeCanvas();
        drawLeaderboard();
      });

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [players]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('/api/players');
      const sortedPlayers = response.data.sort((a, b) => b.points - a.points);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const targetWidth = 9;
      const targetHeight = 16;
      const targetRatio = targetWidth / targetHeight;

      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;

      const currentRatio = newWidth / newHeight;

      if (currentRatio > targetRatio) {
        newWidth = newHeight * targetRatio;
      } else {
        newHeight = newWidth / targetRatio;
      }

      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      canvas.width = targetWidth * 100;
      canvas.height = targetHeight * 100;
    }
  };

  const drawNavbar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const buttonRadius = 30;
    const logoWidth = logoImage.width * 1.5;
    const logoHeight = logoImage.height * 1.5;
    const margin = 10;

    // Draw left button
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(buttonRadius + margin, buttonRadius + margin, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw right button
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(canvas.width - buttonRadius - margin, buttonRadius + margin, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw logo
    ctx.drawImage(
      logoImage,
      (canvas.width - logoWidth) / 2,
      (2 * buttonRadius - logoHeight) / 2,
      logoWidth,
      logoHeight
    );
  };

  const handleLeftButtonClick = () => {
    router.push('/');
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const buttonRadius = 30;
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Check if click is within the left button's circular area
    if (x >= 0 && x <= 2 * buttonRadius && y >= 0 && y <= 2 * buttonRadius) {
      handleLeftButtonClick();
    }
  };

  const drawLeaderboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNavbar();

    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('Leaderboard', canvas.width / 2, 150);

    if (user) {
      ctx.font = 'bold 30px Arial';
      ctx.fillText(
        `Welcome, ${user.fullName}! Your rank is {}`,
        canvas.width / 2,
        240
      );
    }

    ctx.font = '27px Arial';
    ctx.fillText('Rank', canvas.width / 4, 330);
    ctx.fillText('Name', canvas.width / 2, 330);
    ctx.fillText('Points', (3 * canvas.width) / 4, 330);

    players.forEach((player, index) => {
      ctx.fillText(index + 1, canvas.width / 4, 390 + index * 60);
      ctx.fillText(player.name, canvas.width / 2, 390 + index * 60);
      ctx.fillText(player.points, (3 * canvas.width) / 4, 390 + index * 60);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
    ></canvas>
  );
};

export default Leaderboard;