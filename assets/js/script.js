document.addEventListener("DOMContentLoaded", () => {
  console.log("Connected to script.js");

  // Get references to DOM elements
  const paddle = document.getElementById("paddle");
  const ball = document.getElementById("ball");
  const bricksContainer = document.getElementById("bricks");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startButton = document.getElementById("start-game");

  // Initialize game variables
  const initialSpeed = 8; // Initial speed
  let ballSpeed = { x: 0, y: 0 }; // Speed of the ball in x and y directions
  let ballPosition = { x: 0, y: 0 }; // Position of the ball
  let paddlePosition = 250; // Initial position of the paddle
  let score = 0; // Initial score
  let lives = 3; // Initial number of lives
  let isGameRunning = false; // Game state
  let isCooldown = false; // Cooldown flag
  let currentRound = 1; // Current round

  // Function to create bricks for round 1
  function createBricks() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 20; i++) {
      const brick = document.createElement("div");
      brick.classList.add("brick");

      if (i < 5) brick.classList.add("red-brick");
      else if (i < 10) brick.classList.add("blue-brick");
      else if (i < 15) brick.classList.add("green-brick");
      else brick.classList.add("yellow-brick");

      bricksContainer.appendChild(brick);
    }
  }

  // Function to create bricks for round 2
  function createBricksRound2() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 30; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");

      if (i < 10) brick.classList.add("red-brick");
      else if (i < 20) brick.classList.add("blue-brick");
      else brick.classList.add("green-brick");

      bricksContainer.appendChild(brick);
    }
  }

  // Function to create bricks for round 3
  function createBricksRound3() {
    bricksContainer.innerHTML = ""; // Clear existing bricks
    for (let i = 0; i < 40; i++) { // Increase the number of bricks
      const brick = document.createElement("div");
      brick.classList.add("brick");

      if (i < 10) brick.classList.add("red-brick");
      else if (i < 20) brick.classList.add("blue-brick");
      else if (i < 30) brick.classList.add("green-brick");
      else brick.classList.add("yellow-brick");

      bricksContainer.appendChild(brick);
    }
  }

  // Function to check if there are no bricks left
  function checkBricks() {
    const bricks = document.querySelectorAll(".brick");
    return bricks.length === 0;
  }

  // Reset the ball and paddle position
  function resetBallAndPaddle() {
    const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;
    const ballDiameter = ball.offsetWidth;

    // Center the paddle in the game viewport
    paddlePosition = (gameBounds.width - paddleWidth) / 2;
    paddle.style.left = `${paddlePosition}px`;

    // Position the ball just above the paddle, centered horizontally
    ballPosition.x = paddlePosition + paddleWidth / 2 - ballDiameter / 2;
    ballPosition.y = gameBounds.height - paddle.offsetHeight - ballDiameter - 10; // Place ball just above paddle
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    ballSpeed = { x: 0, y: 0 };

    // Re-enable the start button
    startButton.disabled = false;

    // Debugging output
    console.log("Ball Position:", ballPosition);
    console.log("Paddle Position:", paddlePosition);
  }

  // Function to set initial ball direction
  function setInitialBallDirection() {
    const angle = (Math.random() * 60 + 60) * (Math.PI / 180); // Angle between 60-120 degrees
    ballSpeed = { x: initialSpeed * Math.cos(angle), y: -initialSpeed * Math.sin(angle) }; // Ball goes upwards
  }

  // Function to reset the game
  function resetGame() {
    lives = 3;
    score = 0;
    currentRound = 1;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    createBricks();
    resetBallAndPaddle();
  }

  // Event listener to move the paddle
  document.addEventListener("mousemove", (e) => {
    const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;

    // Calculate new paddle position
    let newPaddleX = e.clientX - gameBounds.left - paddleWidth / 2;

    // Constrain paddle within the game bounds
    newPaddleX = Math.max(0, Math.min(newPaddleX, gameBounds.width - paddleWidth));

    // Update paddle position
    paddle.style.left = `${newPaddleX}px`;

    // Update ball position if the ball is not moving
    if (ballSpeed.x === 0 && ballSpeed.y === 0) {
      ballPosition.x = newPaddleX + paddleWidth / 2 - ball.offsetWidth / 2;
      ball.style.left = `${ballPosition.x}px`;
    }
  });

  // Start game event
  startButton.addEventListener("click", () => {
    if (!isGameRunning || (ballSpeed.x === 0 && ballSpeed.y === 0)) {
      isGameRunning = true;
      startButton.disabled = true; // Disable the start button
      setInitialBallDirection();
      gameLoop();
    }
  });

  // Ball movement and collision detection
  function moveBall() {
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    // Wall collision
    if (ballPosition.x <= 0 || ballPosition.x >= 590) ballSpeed.x *= -1;
    if (ballPosition.y <= 0) ballSpeed.y *= -1;

    // Paddle collision
    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    if (
      ballRect.bottom >= paddleRect.top &&
      ballRect.left < paddleRect.right &&
      ballRect.right > paddleRect.left &&
      ballSpeed.y > 0 // Ensure the ball is moving downwards
    ) {
      ballSpeed.y *= -1;
    }

    // Brick collision
    if (!isCooldown) {
      const bricks = document.querySelectorAll(".brick");
      for (const brick of bricks) {
        const rect = brick.getBoundingClientRect();
        if (
          ballRect.left < rect.right &&
          ballRect.right > rect.left &&
          ballRect.top < rect.bottom &&
          ballRect.bottom > rect.top
        ) {
          ballSpeed.y *= -1;
          const emptyDiv = document.createElement("div");
          emptyDiv.classList.add("placeholder"); // Add a class for styling if needed
          brick.replaceWith(emptyDiv);
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
          isCooldown = true;
          setTimeout(() => {
            isCooldown = false;
          }, 500); // 500 millisecond cooldown
          break; // Exit the loop after hitting one brick
        }
      }
    }

    // Check if there are no bricks left
    if (checkBricks()) {
      alert("Round Cleared!");
      currentRound++;
      if (currentRound === 2) {
        createBricksRound2();
      } else if (currentRound === 3) {
        createBricksRound3();
      } else {
        alert("You have completed all rounds!");
        isGameRunning = false;
        resetGame();
      }
      resetBallAndPaddle();
    }

    // Lose condition (ball hits bottom of viewport)
    const gameBounds = document.getElementById("game-viewport").getBoundingClientRect();
    if (ballPosition.y >= gameBounds.height - ball.offsetHeight) { // Ball hits bottom of the viewport
      lives--;
      livesDisplay.textContent = `Lives: ${lives}`;
      if (lives > 0) {
        resetBallAndPaddle();
        startButton.disabled = false; // Re-enable the start button
      } else {
        alert("Game Over!");
        isGameRunning = false;
        resetGame();
      }
    }

    // Update ball position
    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;
  }

  // Game loop
  function gameLoop() {
    if (isGameRunning || lives > 0 || ballSpeed.x !== 0 || ballSpeed.y !== 0) {
      moveBall();
      requestAnimationFrame(gameLoop);
    }
  }

  // Initialize game
  resetGame();
});
