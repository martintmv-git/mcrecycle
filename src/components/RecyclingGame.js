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
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      ctx.textAlign = "right";
      ctx.fillText("Score: " + score, canvas.width - 10, 20);

      const heartSize = 35;
      const heartSpacing = 22.5;
      for (let i = 0; i < lives; i++) {
        ctx.fillText("❤️", canvas.width - 10 - i * (heartSize + heartSpacing), 70);
      }
    }

    function resizeCanvas() {
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

    let touchStartX;
    let touchStartBucketX;
    let isMouseDown = false;

    function getEventClientX(event) {
      return event.type.startsWith("touch") ? event.touches[0].clientX : event.clientX;
    }

    function handlePointer(event, action) {
      if (isTouchDevice()) {
        event.preventDefault();
        if (action === "down") {
          isMouseDown = true;
          touchStartX = getEventClientX(event);
          touchStartBucketX = bucket.x;
        } else if (action === "move" && bucket && bucket.loaded && isMouseDown) {
          const deltaX = getEventClientX(event) - touchStartX;
          bucket.x = touchStartBucketX + deltaX * (canvas.width / parseFloat(canvas.style.width));

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

    let currentBackground = 0;

    function drawBackground() {
      backgroundImages[currentBackground].draw();
    }

    class Bucket {
      constructor(canvas, y, width, height) {
        this.loaded = false;
        this.x = canvas.width / 2 - width / 2;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 8;
        this.image = createImage("/bin.png", () => {
          this.loaded = true;
        });
      }

      draw() {
        if (this.loaded) {
          const aspectRatio = this.image.width / this.image.height;
          const scaledWidth = this.height * aspectRatio;
          ctx.drawImage(this.image, this.x, this.y, scaledWidth, this.height);
        }
      }

      update() {
        moveBucket();
      }
    }

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

    const items = [];
    let keys = {};
    let bucket;

    function spawnItem() {
      const width = 105;
      const height = 105;
      const x = Math.random() * (canvas.width - width);
      const y = 0 - height;
      let speed = 10 + Math.random() * 1.5 + Math.floor(score / 150) * 3;
      const image = itemImages[Math.floor(Math.random() * itemImages.length)].image;

      const item = new FallingItem(x, y, width, height, speed, image);
    }

    function decrementLives() {
      lives--;
      if (lives <= 0) {
        resetGame();
      }
    }

    function startGame() {
      resizeCanvas();

      const bucketWidth = 105 * 1.7;
      const bucketHeight = 105 * 1.7;

      bucket = new Bucket(
        canvas,
        canvas.height - bucketHeight,
        bucketWidth,
        bucketHeight
      );

      gameLoop();

      // Check if the document is visible before starting to spawn items
      if (!document.hidden) {
        startSpawningItems();
      }
    }

    startGame();

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground ();
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
            currentBackground = (currentBackground + 1) % backgroundImages.length;
          }
        }
      }
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

    function resetGame() {
      score = startScore;
      lives = startLives;
      items.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentBackground = 0;
    }

    function startSpawningItems() {
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

    canvas.addEventListener("touchstart", (event) => handlePointer(event, "down"), false);
    canvas.addEventListener("touchmove", (event) => handlePointer(event, "move"), false);
    canvas.addEventListener("touchend", (event) => handlePointer(event, "up"), false);
  }, []);
  return (
    <>
      <canvas ref={canvasRef} id="canvas" />
    </>
  );
};

export default RecyclingGame;