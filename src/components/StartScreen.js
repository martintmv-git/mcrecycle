import React, { useEffect, useRef } from 'react';

const StartScreen = ({ onStartGame, onLeaderboards, onShop }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawButton(text, x, y, width, height) {
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = 'black';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + width / 2, y + height / 2);
    }

    function drawStartScreen() {
      const centerX = canvas.width / 2;
      const startY = canvas.height / 2 - 100;
      const buttonWidth = 200;
      const buttonHeight = 50;
      const buttonSpacing = 20;

      drawButton('Start Game', centerX - buttonWidth / 2, startY, buttonWidth, buttonHeight);
      drawButton('Leaderboards', centerX - buttonWidth / 2, startY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight);
      drawButton('Shop', centerX - buttonWidth / 2, startY + 2 * (buttonHeight + buttonSpacing), buttonWidth, buttonHeight);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth * 1;
      canvas.height = window.innerHeight * 1;

      const maxWidth = 800;
      const maxHeight = 500;
      if (canvas.width > maxWidth) {
        canvas.width = maxWidth;
      }
      if (canvas.height > maxHeight) {
        canvas.height = maxHeight;
      }
    }

    function handleClick(event) {
        // Calculate the canvas size ratio between the actual size and the CSS size
        const scaleX = canvas.width / canvas.clientWidth;
        const scaleY = canvas.height / canvas.clientHeight;
      
        const rect = canvas.getBoundingClientRect();
        // Adjust the click coordinates according to the canvas size and position
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
      
        const centerX = canvas.width / 2;
        const startY = canvas.height / 2 - 100;
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonSpacing = 20;
      
        if (x >= centerX - buttonWidth / 2 && x <= centerX + buttonWidth / 2) {
          if (y >= startY && y <= startY + buttonHeight) {
            onStartGame();
          } else if (y >= startY + buttonHeight + buttonSpacing && y <= startY + 2 * buttonHeight + buttonSpacing) {
            onLeaderboards();
          } else if (y >= startY + 2 * (buttonHeight + buttonSpacing) && y <= startY + 3 * buttonHeight + 2 * buttonSpacing) {
            onShop();
          }
        }
      }

    resizeCanvas();
    drawStartScreen();
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} id="startScreenCanvas" />;
};

export default StartScreen;