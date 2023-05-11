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
      ctx.font = 'bold 50px Arial';
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
        const targetWidth = 9;
        const targetHeight = 16;
        const targetRatio = targetWidth / targetHeight;
      
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;
      
        const currentRatio = newWidth / newHeight;
      
        if (currentRatio > targetRatio) {
          // The window width is too large, decrease it to maintain aspect ratio
          newWidth = newHeight * targetRatio;
        } else {
          // The window height is too large, decrease it to maintain aspect ratio
          newHeight = newWidth / targetRatio;
        }
      
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
      
        canvas.width = targetWidth * 100; // 900
        canvas.height = targetHeight * 100; // 1600
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

  return (
    <canvas
      ref={canvasRef}
      id="startScreenCanvas"
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
};

export default StartScreen;