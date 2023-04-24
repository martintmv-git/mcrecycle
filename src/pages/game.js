import React, { useEffect, useRef, useState } from "react";
import "../styles/game.css";

function App() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    // Place the entire index.js code here and replace the following variables
    const canvas = canvasRef.current;
    const scoreElement = setScore;
    const livesElement = setLives;

    const startScore = 0;
    const startLives = 3;

    //const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    // Function to resize the canvas
    function resizeCanvas() {
      // Set the canvas width and height based on the window size
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;

      // Make sure the canvas doesn't exceed a maximum size
      const maxWidth = 800;
      const maxHeight = 500;
      if (canvas.width > maxWidth) {
        canvas.width = maxWidth;
      }
      if (canvas.height > maxHeight) {
        canvas.height = maxHeight;
      }
    }

    // Resize the canvas initially
    resizeCanvas();

    // Resize the canvas when the window is resized
    window.addEventListener("resize", resizeCanvas);

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("touchend", handleTouchEnd, false);

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("touchend", handleTouchEnd, false);

    // Touch event handler functions
    let touchStartX;
    let touchStartBucketX;

    function handleTouchStart(event) {
      event.preventDefault();
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartBucketX = bucket.x;
    }

    function handleTouchMove(event) {
      event.preventDefault();
      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartX;
      bucket.x = touchStartBucketX + deltaX;

      // Make sure the bucket stays within the canvas bounds
      if (bucket.x < 0) {
        bucket.x = 0;
      } else if (bucket.x > canvas.width - bucket.width) {
        bucket.x = canvas.width - bucket.width;
      }
    }

    function handleTouchEnd(event) {
      event.preventDefault();
    }

    class Background {
      constructor(imageSrc) {
        this.loaded = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
          this.loaded = true;
        };
      }

      draw() {
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      }
    }

    const backgroundImages = [
      new Background(
        "https://via.placeholder.com/800x600.png?text=Background+1"
      ),
      new Background(
        "https://via.placeholder.com/800x600.png?text=Background+2"
      ),
      new Background(
        "https://via.placeholder.com/800x600.png?text=Background+3"
      ),
    ];

    let currentBackground = 0;

    function drawBackground() {
      if (backgroundImages[currentBackground].loaded) {
        backgroundImages[currentBackground].draw();
      }
    }

    // Bucket class for the player's object
    class Bucket {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.image = new Image();
        this.image.src = "../assets/bin.png";
      }

      // Draw the bucket on the canvas
      draw() {
        if (this.image.loaded) {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
      }

      // Update the bucket's position based on the player's input
      update() {
        moveBucket();
      }
    }

    // Create the bucket object
    const bucket = new Bucket(
      canvas.width / 2 - 25,
      canvas.height - 50,
      50,
      50
    );

    // FallingItem class for the falling objects
    class FallingItem {
      constructor(x, y, width, height, speed, imageSrc) {
        // ...
        this.loaded = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
          this.loaded = true;
        };
      }

      // Draw the falling item on the canvas
      draw() {
        if (this.image.loaded) {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
      }

      // Update the falling item's position based on its speed
      update() {
        this.y += this.speed;
        if (this.y + this.height > canvas.height) {
          items.splice(items.indexOf(this), 1);
          lives--;
          livesElement.innerHTML = lives;
          if (lives <= 0) {
            clearInterval(updateLoop);
            alert("Game Over!");
          }
        }
      }

      // Check if the falling item is colliding with the bucket
      // Consider to make it so it only can fall sucessfully if it's in the bucket and not on the edges
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

    const items = []; // Array to store falling items
    let score = 0; // Initialize score
    let lives = 3; // Initialize lives

    // Spawn a new falling item with random properties
    function spawnItem() {
      const width = 25 + Math.random() * 50;
      const height = width;
      const x = Math.random() * (canvas.width - width);
      const y = 0 - height;
      let speed = 2 + Math.random() * 1 + Math.floor(score / 150) * 0.8;
      let imageSrc;

      // Randomly choose an image for the falling item
      const randomNum = Math.floor(Math.random() * 3) + 1;
      switch (randomNum) {
        case 1:
          imageSrc = "../assets/block.png";
          break;
        case 2:
          imageSrc = "../assets/block-2.png";
          break;
        case 3:
          imageSrc = "../assets/block-3.png";
          break;
      }

      const item = new FallingItem(x, y, width, height, speed, imageSrc);

      // Add the item to the items array once the image is loaded
      item.image.onload = () => {
        items.push(item);
      };
    }

    // Update the game state, check for collisions, and draw objects
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      bucket.update();
      bucket.draw();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.update();
        item.draw();
        if (item.isColliding(bucket)) {
          items.splice(i, 1);
          score += 25;
          scoreElement.innerHTML = score;

          // Update the background based on the score
          if (score >= 200 && currentBackground < 1) {
            currentBackground = 1;
          } else if (score >= 400 && currentBackground < 2) {
            currentBackground = 2;
          }
        } else if (item.y + item.height > canvas.height) {
          items.splice(i, 1);
          lives--;
          livesElement.innerHTML = lives;
          if (lives === 0) {
            resetGame();
          }
        }
      }
    }

    let keys = {}; // Object to store the state of arrow keys

    // Update the bucket's position based on arrow key input
    function moveBucket() {
      if (keys["ArrowLeft"] && bucket.x > 0) {
        bucket.x -= bucket.speed;
      }

      if (keys["ArrowRight"] && bucket.x < canvas.width - bucket.width) {
        bucket.x += bucket.speed;
      }
    }

    // Update the keys object based on keydown and keyup events
    document.addEventListener("keydown", function (event) {
      keys[event.code] = true;
    });

    document.addEventListener("keyup", function (event) {
      keys[event.code] = false;
    });

    // Reset the game to its initial state
    function resetGame() {
      score = startScore;
      lives = startLives;
      items.length = 0;
      scoreElement.innerHTML = score;
      livesElement.innerHTML = lives;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Set up the game loop
    const updateLoop = setInterval(() => {
      update();
    }, 10);

    // Spawn new items every second
    setInterval(() => {
      spawnItem();
    }, 1000);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <canvas ref={canvasRef} width="400" height="600"></canvas>
          <div className="scoreboard">
            <span>
              Score: <span>{score}</span>
            </span>
            <span>
              Lives: <span>{lives}</span>
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
