import React, { useEffect, useRef } from "react";

const StartScreen = ({ onStartGame, onLeaderboards, onShop }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawButton(text, x, y, width, height) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "white";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + width / 2, y + height / 2);
    }

    function drawCanvas() {
      let bgImg = new Image();
      bgImg.src = "/startscreen.png";
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        drawButtons();
      };
    }

    function drawButtons() {
      const centerX = canvas.width / 2;
      const startY = canvas.height / 2 - 100;
      const buttonWidth = 600;
      const buttonHeight = 150;
      const buttonSpacing = 10;

      drawButton(
        "Start Game",
        centerX - buttonWidth / 2,
        startY,
        buttonWidth,
        buttonHeight
      );
      drawButton(
        "Leaderboard",
        centerX - buttonWidth / 1.4,
        startY + 4.4 * (buttonHeight + buttonSpacing),
        buttonWidth / 1.5,
        buttonHeight * 1.2
      );
      drawButton(
        "Shop",
        centerX - buttonWidth / 40 + 40,
        startY + 4.4 * (buttonHeight + buttonSpacing),
        buttonWidth / 1.5,
        buttonHeight * 1.2
      );
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
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      const centerX = canvas.width / 2;
      const startY = canvas.height / 2 - 100;
      const buttonWidth = 600;
      const buttonHeight = 150;
      const buttonSpacing = 10;

      if (
        clickX >= centerX - buttonWidth / 2 &&
        clickX <= centerX + buttonWidth / 2
      ) {
        if (clickY >= startY && clickY <= startY + buttonHeight) {
          onStartGame();
        } else if (
          clickX >= centerX - buttonWidth / 1.4 &&
          clickX <= centerX - buttonWidth / 3.2 &&
          clickY >= startY + 4.4 * (buttonHeight + buttonSpacing) &&
          clickY <= startY + 5.4 * (buttonHeight + buttonSpacing)
        ) {
          onLeaderboards();
        } else if (
          clickX >= centerX - buttonWidth / 40 + 40 &&
          clickX <= centerX + buttonWidth / 3.2 &&
          clickY >= startY + 4.4 * (buttonHeight + buttonSpacing) &&
          clickY <= startY + 5.4 * (buttonHeight + buttonSpacing)
        ) {
          onShop();
        }
      }
    }

    resizeCanvas();
    drawCanvas();
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} id="startScreenCanvas"></canvas>;
};

export default StartScreen;