// Pixel Minds - McRecycle - Fontys UAS Eindhoven - Main Game Logic Code
import React, { useEffect, useState, useRef } from "react";
import { FaHome, FaMusic } from "react-icons/fa";
import { useRouter } from "next/router";
import { insertData } from "@/lib/databaseHelper";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";

// Main component for the recycling game.
const RecyclingGame = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(new Audio("/music.mp3"));
  let axiosCalled = false;

  const { user } = useUser();
  // States to track buttons.
  const [homeButtonActive, setHomeButtonActive] = useState(true);
  const [musicButtonActive, setMusicButtonActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // NEXT.JS router.
  const router = useRouter();

  function handleHomeClick() {
    router.reload();
  }

  function handleMusicButtonClick() {
    if (musicButtonActive) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicButtonActive(!musicButtonActive);
  }

  // Effect runs when the component mounts.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    document.body.style.overflowX = "hidden";

    // Initial score and lives.
    const startScore = 0;
    const startLives = 3;
    // Variables to hold the current score and lives.
    let score = startScore;
    let lives = startLives;
    // Variable to hold the interval for spawning items.
    let spawnInterval;

    // Start playing the audio when the component mounts.
    audioRef.current.autoplay = true;
    audioRef.current.loop = true;
    audioRef.current.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });

    // Handler for resizing the window.
    const handleResize = () => {
      document.body.style.backgroundColor =
        window.innerWidth < 768 ? backgroundColors[currentBackground] : "";
    };

    // Function to draw the score and lives.
    function drawScoreLives() {
      ctx.font = "bold 60px Helvetica";
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      ctx.textAlign = "right";
      ctx.fillText("" + score, canvas.width - 15, 30);

      const heartSize = 52.5;
      const heartSpacing = 33.75;
      for (let i = 0; i < lives; i++) {
        ctx.fillText(
          "❤️",
          canvas.width - 15 - i * (heartSize + heartSpacing),
          105
        );
      }
    }
    // Responsive game canvas.
    function resizeCanvas() {
      const targetWidth = 9.5;
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

    let touchStartX;
    let touchStartBucketX;
    let isMouseDown = false;

    // Function to extract the X coordinate of an event.
    // This supports both touch and non-touch events.
    function getEventClientX(event) {
      return event.type.startsWith("touch")
        ? event.touches[0].clientX
        : event.clientX;
    }

    // Similar to getEventClientX, but for the Y coordinate.
    function getEventClientY(event) {
      return event.type.startsWith("touch")
        ? event.touches[0].clientY
        : event.clientY;
    }

    // Function to handle pointer events (mouse or touch).
    function handlePointer(event, action) {
      if (isTouchDevice()) {
        event.preventDefault();
        if (action === "down") {
          const x = getEventClientX(event);
          const y = getEventClientY(event);
          if (bucket.isTouched(x, y)) {
            isMouseDown = true;
            touchStartX = x;
            touchStartBucketX = bucket.x;
          }
        } else if (
          action === "move" &&
          bucket &&
          bucket.loaded &&
          isMouseDown
        ) {
          const deltaX = getEventClientX(event) - touchStartX;
          bucket.x =
            touchStartBucketX +
            deltaX * (canvas.width / parseFloat(canvas.style.width));

          if (bucket.x < 0) {
            bucket.x = 0;
          } else if (bucket.x > canvas.width - bucket.width) {
            bucket.x = canvas.width - bucket.width;
          }
        } else if (action === "up") {
          isMouseDown = false;
        }
      }
    }

    // Create an image.
    // The image is reloaded every time this function is called, to prevent caching.
    function createImage(src, onload) {
      const image = new Image();
      image.src = src + "?" + new Date().getTime();
      image.onload = onload;
      return image;
    }

    class Background {
      constructor(imageSrc) {
        this.loaded = false;
        this.image = createImage(imageSrc, () => {
          this.loaded = true;
        });
      }

      // Function to draw the background if it is loaded.
      draw() {
        if (this.loaded) {
          ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        }
      }
    }

    const backgroundImages = [
      new Background("background-1.png"),
      new Background("background-2.png"),
      new Background("background-3.png"),
      new Background("background-4.png"),
      new Background("background-5.png"),
      new Background("background-6.png"),
      new Background("background-7.png"),
      new Background("background-8.png"),
    ];

    const backgroundColors = [
      "#7C8B00",
      "#C8D745",
      "#C8D745",
      "#839300",
      "#718000",
      "#718000",
      "#718000",
      "#718000",
    ];

    let currentBackground = 0;

    function drawBackground() {
      backgroundImages[currentBackground].draw();
      if (window.innerWidth < 768) {
        document.body.style.backgroundColor =
          backgroundColors[currentBackground];
      }
    }
    // Class for the bucket that is collecting the items.
    class Bucket {
      constructor(canvas, y, width, height) {
        this.loaded = false;
        // The bucket is initially centered in the canvas.
        this.x = canvas.width / 2 - width / 2;
        this.y = y;
        this.width = width;
        this.height = height;
        // The speed of the bucket when it moves.
        this.speed = 8;
        this.image = createImage("/bin.png", () => {
          this.loaded = true;
        });
      }

      // Function to draw the bucket, if it is loaded.
      // The bucket is drawn according to its aspect ratio.
      draw() {
        if (this.loaded) {
          const aspectRatio = this.image.width / this.image.height;
          const scaledWidth = this.height * aspectRatio;
          ctx.drawImage(this.image, this.x, this.y, scaledWidth, this.height);
        }
      }

      // Function to update the state of the bucket.
      update() {
        moveBucket();
      }

      // Check if the bucket is touched at a given X and Y coordinate.
      isTouched(x, y) {
        const scaleFactor = parseFloat(canvas.style.width) / canvas.width;
        const touchX = x / scaleFactor;
        const touchY = y / scaleFactor;
        return (
          touchX >= this.x &&
          touchX <= this.x + this.width &&
          touchY >= this.y &&
          touchY <= this.y + this.height
        );
      }
    }

    // Array of image sources (URLs) to preload them.
    const itemImages = [
      "/burger.png",
      "/cup.png",
      "/fries.png",
      "/burger-2.png",
      "/cup-2.png",
    ].map((imageSrc) => {
      const image = createImage(imageSrc);
      return { image };
    });

    // Similar to the previous block, but this time for the 'game over' screen.
    const loadedgamescreen = ["/gameoverbox.png"].map((imageSrc) => {
      const image = createImage(imageSrc);
      return { image };
    });

    // Class for the falling items that are collected in the bucket.
    class FallingItem {
      constructor(x, y, width, height, speed, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;
        items.push(this);
      }

      draw() {
        const aspectRatio = this.image.width / this.image.height;
        const scaledWidth = this.height * aspectRatio;
        ctx.drawImage(this.image, this.x, this.y, scaledWidth, this.height);
      }

      update() {
        this.y += this.speed;
        if (this.y + this.height > canvas.height) {
          items.splice(items.indexOf(this), 1);
          decrementLives();
        }
      }

      isColliding(bucket) {
        if (
          this.x < bucket.x + bucket.width &&
          this.x + this.width > bucket.x &&
          this.y < bucket.y + bucket.height &&
          this.y + this.height > bucket.y
        ) {
          return true;
        }
        return false;
      }
    }

    // Array that will store all the falling items.
    const items = [];
    let keys = {};
    let bucket;

    // spawnItem() function is used to create a new falling item.
    function spawnItem() {
      const width = 105;
      const height = 105;
      const x = Math.random() * (canvas.width - width);
      const y = 0 - height;
      let speed = 10 + Math.random() * 1.5 + Math.floor(score / 150) * 3;
      const image =
        itemImages[Math.floor(Math.random() * itemImages.length)].image;

      const item = new FallingItem(x, y, width, height, speed, image);
    }

    // decrementLives() is used to decrease the player's lives by 1, and end the game if no lives are left.
    function decrementLives() {
      lives--;
      if (lives <= 0) {
        gameOver();
      }
    }

    // Sets up the game and starts the game loop.
    function startGame() {
      resizeCanvas();
      handleResize();
      window.addEventListener("resize", handleResize);

      const bucketWidth = 105 * 1.7;
      const bucketHeight = 105 * 1.7;

      bucket = new Bucket(
        canvas,
        canvas.height - bucketHeight - 30,
        bucketWidth,
        bucketHeight
      );

      gameLoop();

      // Check if the game is visible before starting to spawn items.
      if (!document.hidden) {
        startSpawningItems();
      }

      // Handle the visibilitychange event.
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopSpawningItems();
        } else {
          // Only start spawning items if the game is not over.
          if (!gameOver) {
            startSpawningItems();
          }
        }
      });
    }

    startGame();

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      bucket.update();
      bucket.draw();
      drawScoreLives();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.update();
        item.draw();
        if (item.isColliding(bucket)) {
          items.splice(i, 1);
          score += 25;

          if (score % 200 === 0) {
            currentBackground =
              (currentBackground + 1) % backgroundImages.length;
          }
        }
      }

      drawGameOverScreen();
    }

    function gameLoop() {
      update();
      requestAnimationFrame(gameLoop);
    }

    function moveBucket() {
      if (!isTouchDevice()) {
        if (keys["ArrowLeft"] && bucket.x > 0) {
          bucket.x -= bucket.speed;
          if (bucket.x < 0) {
            bucket.x = 0;
          }
        }

        if (keys["ArrowRight"] && bucket.x < canvas.width - bucket.width) {
          bucket.x += bucket.speed;
          if (bucket.x > canvas.width - bucket.width) {
            bucket.x = canvas.width - bucket.width;
          }
        }
      }
    }

    document.addEventListener("keydown", (event) => {
      keys[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
      keys[event.code] = false;
    });

    function gameOver() {
      // Stop the game.
      stopSpawningItems();
      items.length = 0;

      // Set game over state and final score.
      setGameOver(true);

      // Display the final score.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      ctx.font = "bold 60px Helvetica";
      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 60);
      ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
      console.log(user);

      // Send the score to the newBalance API.
      // This is called at the end of the gameOver function so it won't be executed until the game is over.
      if (user && user.id) {
        // Make sure user and user.id exists
        axios
          .post("/api/newBalance", { clerkId: user.id, amount: score })
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            console.error("Error updating balance:", error);
          });
      }
    }

    function drawButton(x, y, width, height, text, callback) {
      // Create rounded rectangle.
      const radius = 10;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      // Fill the button.
      ctx.fillStyle = "rgba(255, 199, 44, 0.7)";
      ctx.fill();

      // Draw border.
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.stroke();

      // Draw the text.
      ctx.font = "bold 50px Helvetica";
      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(text, x + width / 2, y + height / 2);

      // Click event
      canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const offsetX = scaleX * (event.pageX - rect.left);
        const offsetY = scaleY * (event.pageY - rect.top);

        if (
          offsetX >= x &&
          offsetX <= x + width &&
          offsetY >= y &&
          offsetY <= y + height
        ) {
          callback();
        }
      });

      // Touch event.
      canvas.addEventListener(
        "touchstart",
        (event) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const offsetX = scaleX * (event.touches[0].pageX - rect.left);
          const offsetY = scaleY * (event.touches[0].pageY - rect.top);

          if (
            offsetX >= x &&
            offsetX <= x + width &&
            offsetY >= y &&
            offsetY <= y + height
          ) {
            callback();
          }

          // Prevent the window from scrolling when the button is pressed.
          event.preventDefault();
        },
        { passive: false }
      );
    }

    function drawGameOverScreen() {
      if (lives <= 0) {
        // Draw the background box.
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        const boxWidth = canvas.width * 1;
        const boxHeight = canvas.height * 2;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Find the pre-loaded image.
        const imageObj = loadedgamescreen.find((obj) =>
          obj.image.src.includes("/gameoverbox.png")
        );

        // Draw the image.
        if (imageObj && imageObj.image) {
          const image = imageObj.image;
          const imageX = (canvas.width - image.width) / 2;
          const imageY = (canvas.height - image.height) / 5;
          ctx.drawImage(image, imageX, imageY);
        }

        // Draw the "Points earned" text.
        ctx.font = "bold 90px Helvetica";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(
          "Points earned",
          canvas.width / 2,
          canvas.height / 3 + 100
        );

        // Draw the score on a separate row.
        ctx.font = "bold 75px Helvetica";
        ctx.fillText(score, canvas.width / 2, canvas.height / 3 + 200);

        drawButton(
          canvas.width / 2 - 262.5,
          canvas.height / 2 + 80,
          525,
          105,
          "Play again?",
          () => {
            router.reload();
          }
        );

        drawButton(
          canvas.width / 2 - 262.5,
          canvas.height / 2 + 200, // y-coordinate for margin
          525,
          105,
          "Leaderboard",
          () => {
            router.push("/leaderboard");
          }
        );

        drawButton(
          canvas.width / 2 - 262.5,
          canvas.height / 2 + 320, // y-coordinate for margin
          525,
          105,
          "Shop",
          () => {
            router.push("/shop");
          }
        );
      }

      //insertData(score);
      //axios.post("/api/newBalance", { clerkId: user.id, amount: score });
    }

    function startSpawningItems() {
      if (!gameOver) {
        return;
      }

      if (!spawnInterval) {
        spawnInterval = setInterval(() => {
          spawnItem();
        }, 1200);
      }
    }

    function stopSpawningItems() {
      if (spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
      }
    }

    function handleVisibilityChange() {
      if (gameOver) {
        // If the game is over, do not start or stop spawning items.
        return;
      }

      if (document.hidden) {
        stopSpawningItems();
      } else {
        startSpawningItems();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("resize", resizeCanvas);

    function isTouchDevice() {
      return (
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
      );
    }

    canvas.addEventListener(
      "pointerdown",
      (event) => {
        handlePointer(event, "down");
      },
      false
    );

    canvas.addEventListener(
      "pointermove",
      (event) => {
        handlePointer(event, "move");
      },
      false
    );

    canvas.addEventListener(
      "pointerup",
      (event) => {
        handlePointer(event, "up");
      },
      false
    );

    canvas.addEventListener(
      "touchstart",
      (event) => handlePointer(event, "down"),
      false
    );
    canvas.addEventListener(
      "touchmove",
      (event) => handlePointer(event, "move"),
      false
    );
    canvas.addEventListener(
      "touchend",
      (event) => handlePointer(event, "up"),
      false
    );
    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      canvas.removeEventListener("pointerdown", (event) =>
        handlePointer(event, "down")
      );
      canvas.removeEventListener("pointermove", (event) =>
        handlePointer(event, "move")
      );
      canvas.removeEventListener("pointerup", (event) =>
        handlePointer(event, "up")
      );

      canvas.removeEventListener("touchstart", (event) =>
        handlePointer(event, "down")
      );
      canvas.removeEventListener("touchmove", (event) =>
        handlePointer(event, "move")
      );
      canvas.removeEventListener("touchend", (event) =>
        handlePointer(event, "up")
      );

      audioRef.current.pause(); // Ensure that the audio is paused if the component is unmounted.
    };
  }, []);
  return (
    <div className="game-container">
      <Head>
        <title>McRecycle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <canvas ref={canvasRef} className="game-canvas" />
      <div
        className={`game-button game-home-button ${
          homeButtonActive ? "" : "game-button-off"
        }`}
        onClick={() => handleHomeClick(!homeButtonActive)}
      >
        <FaHome className="game-icon" />
      </div>
      <div
        className={`game-button game-music-button ${
          musicButtonActive ? "" : "game-button-off"
        }`}
        onClick={handleMusicButtonClick}
      >
        <FaMusic className="game-icon" />
      </div>
    </div>
  );
};

export default RecyclingGame;
