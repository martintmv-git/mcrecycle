import React, { useEffect, useRef } from "react";

const RecyclingGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startScore = 0;
    const startLives = 3;
    let score = startScore;
    let lives = startLives;
    let spawnInterval;

    function drawScoreLives() {
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      ctx.textAlign = "right";
      ctx.fillText("Score: " + score, canvas.width - 10, 10);
      ctx.fillText("Lives: " + lives, canvas.width - 10, 40);
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
        if (this.loaded) {
          ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        }
      }
    }

    const backgroundImages = [
      new Background("background-test.png"),
      new Background("https://via.placeholder.com/800x600.png?text=Background+2"),
      new Background("https://via.placeholder.com/800x600.png?text=Background+3"),
    ];

    let currentBackground = 0;

    function drawBackground() {
      backgroundImages[currentBackground].draw();
    }

    class Bucket {
      constructor(x, y, width, height) {
        this.loaded = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.image = new Image();
        this.image.src = "/bin.png";
        this.image.onload = () => {
          this.loaded = true;
        };
      }

      draw() {
        if (this.loaded) {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
      }

      update() {
        moveBucket();
      }
    }

    const bucket = new Bucket(
      canvas.width / 2 - 25,
      canvas.height - 50,
      50,
      50
    );

    class FallingItem {
      constructor(x, y, width, height, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
          items.push(this);
        };
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
          lives--;
          if (lives <= 0) {
            clearInterval(updateLoop);
            alert("Game Over!");
          }
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

    const items = [];
    let keys = {};

    function spawnItem() {
      const width = 25 + Math.random() * 50;
      const height = width;
      const x = Math.random() * (canvas.width - width);
      const y = 0 - height;
      let speed = 2 + Math.random() * 1 + Math.floor(score / 150) * 0.8;
      let imageSrc;

      const randomNum = Math.floor(Math.random() * 5) + 1;
      switch (randomNum) {
        case 1:
          imageSrc = "/burger.png";
          break;
        case 2:
          imageSrc = "/cup.png";
          break;
        case 3:
          imageSrc = "/fries.png";
          break;
        case 4:
          imageSrc = "/burger-2.png";
          break;
        case 5:
          imageSrc = "/cup-2.png";
          break;
      }

      const item = new FallingItem(x, y, width, height, speed, imageSrc);
    }

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

          if (score >= 200 && currentBackground < 1) {
            currentBackground = 1;
          } else if (score >= 400 && currentBackground < 2) {
            currentBackground = 2;
          }
        } else if (item.y + item.height > canvas.height) {
          items.splice(i, 1);
          lives--;
          if (lives === 0) {
            resetGame();
          }
        }
      }
    }

      function moveBucket() {
        if (keys["ArrowLeft"] && bucket.x > 0) {
          bucket.x -= bucket.speed;
        }
  
        if (keys["ArrowRight"] && bucket.x < canvas.width - bucket.width) {
          bucket.x += bucket.speed;
        }
      }
  
      document.addEventListener("keydown", function (event) {
        keys[event.code] = true;
      });
  
      document.addEventListener("keyup", function (event) {
        keys[event.code] = false;
      });
  
      function resetGame() {
        score = startScore;
        lives = startLives;
        items.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
  
      const updateLoop = setInterval(() => {
        update();
      }, 10);
  
      function startSpawningItems() {
        if (!spawnInterval) {
          spawnInterval = setInterval(() => {
            spawnItem();
          }, 1000);
        }
      }
  
      function stopSpawningItems() {
        if (spawnInterval) {
          clearInterval(spawnInterval);
          spawnInterval = null;
        }
      }
  
      startSpawningItems();
      resizeCanvas();
  
      function handleVisibilityChange() {
        if (document.hidden) {
          stopSpawningItems();
        } else {
          startSpawningItems();
        }
      }
  
      document.addEventListener("visibilitychange", handleVisibilityChange);
  
      window.addEventListener("resize", resizeCanvas);
  
      canvas.addEventListener("touchstart", handleTouchStart, false);
      canvas.addEventListener("touchmove", handleTouchMove, false);
      canvas.addEventListener("touchend", handleTouchEnd, false);
    }, []);
  
    return (
      <>
        <canvas ref={canvasRef} id="canvas" />
      </>
    );
  };
  
  export default RecyclingGame;